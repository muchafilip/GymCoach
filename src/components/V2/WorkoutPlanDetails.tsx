// WorkoutPlanDetails.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchData } from './firebaseService';
import { WorkoutDay } from '../../types';

const WorkoutPlanDetails = () => {
    const { planId } = useParams();
    const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);


    useEffect(() => {
        const fetchWorkoutDays = async () => {
            if (planId) {
                const days = await fetchData<WorkoutDay>(`workoutPlans/${planId}/workoutDays`);
                setWorkoutDays(days);

            }
        };

        fetchWorkoutDays();
    }, [planId]);

    return (
        <div>
            <h1>Workout Plan Details</h1>
            {workoutDays.map(day => (
                <Link key={day.id} to={`/workout-plans/${planId}/days/${day.id}`}>
                    <div>
                        <h3>{day.name}</h3>
                        <p>{day.isCompleted ? 'Completed' : 'Not Completed'}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default WorkoutPlanDetails;
