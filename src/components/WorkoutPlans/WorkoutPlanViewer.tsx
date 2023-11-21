// components/WorkoutPlanViewer.tsx
import React, { useEffect, useState } from 'react';
import { WorkoutDay as WorkoutDayType, WorkoutPlan } from '../../types';
import WorkoutDay from './WorkoutDay';
import { fetchWorkoutPlan } from '../../firebase/firebaseActions';

const WorkoutPlanViewer: React.FC = () => {
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedPlan = await fetchWorkoutPlan();
            if (fetchedPlan) {
                setWorkoutPlan(fetchedPlan);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>{workoutPlan ? workoutPlan.title : 'Loading Workout Plan...'}</h1>
            {workoutPlan && workoutPlan.workoutDays.map((day, index) => (
                <div key={index}>
                    <WorkoutDay workoutDay={day} />
                </div>
            ))}
        </div>
    );
};

export default WorkoutPlanViewer;
