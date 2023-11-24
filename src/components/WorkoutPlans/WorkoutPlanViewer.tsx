// components/WorkoutPlanViewer.tsx
import React, { useEffect, useState } from 'react';
import WorkoutDay from './WorkoutDay';
import { fetchWorkoutPlan, FetchedWorkoutPlan } from '../../firebase/firebaseActions';


const WorkoutPlanViewer: React.FC = () => {
    const [workoutPlan, setWorkoutPlan] = useState<FetchedWorkoutPlan | null>(null);

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
            <h1>{workoutPlan ? workoutPlan.id : 'Loading Workout Plan...'}</h1>
            {workoutPlan && workoutPlan.workoutDays.map((day: any, index: number) => (
                <div key={index}>
                    <WorkoutDay workoutDay={day} workoutPlanId={workoutPlan.id} dayIndex={index} />
                </div>
            ))}
        </div>
    );
};

export default WorkoutPlanViewer;