// components/WorkoutPlanPage.tsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebase/config';
import WorkoutDayCard from './WorkoutDayCard';
import { WorkoutDay as WorkoutDayType } from '../../../types';
import { useParams } from 'react-router-dom';

const WorkoutPlanPage: React.FC = () => {
    const [workoutDays, setWorkoutDays] = useState<WorkoutDayType[]>([]);
    const { workoutPlanId } = useParams();

    useEffect(() => {
        const fetchWorkoutDays = async () => {
            if (!workoutPlanId) {
                console.log('No Workout Plan ID provided');
                return;
            }
            const path = `workoutPlans/${workoutPlanId}/workoutDays`;
            const response = await getDocs(collection(firestore, path));
            const days = response.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as WorkoutDayType[];
            setWorkoutDays(days);
        };

        fetchWorkoutDays();
    }, [workoutPlanId]);

    return (
        <div>
            <h1>Workout Plan {workoutPlanId}</h1>
            {workoutDays.map(day => (
                <WorkoutDayCard key={day.id} day={day} workoutPlanId={workoutPlanId!} dayId={day.id} />
            ))}
        </div>
    );
};

export default WorkoutPlanPage;
