// WorkoutDayDetails.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData, fetchDocument } from './firebaseService';
import ExerciseComponent from './Exercise';
import { Exercise, WorkoutDay } from '../../types';
import WorkoutPlanDetails from './WorkoutPlanDetails';

const WorkoutDayDetails = () => {
    const { planId, dayId } = useParams();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [workoutDay, setWorkoutDay] = useState<WorkoutDay | null>(null); // State to hold the workout day details

    useEffect(() => {
        const fetchExercises = async () => {
            if (planId && dayId) {
                const dayDetails = await fetchDocument<WorkoutDay>(`workoutPlans/${planId}/workoutDays/${dayId}`);
                setWorkoutDay(dayDetails); // Set the workout day details in state


                const fetchedExercises = await fetchData<Exercise>(`workoutPlans/${planId}/workoutDays/${dayId}/exercises`);
                setExercises(fetchedExercises);
            }
        };

        fetchExercises();
    }, [planId, dayId]);

    return (
        <div>
            <h1>{workoutDay?.name}</h1>
            <h2></h2>
            {exercises.map((exercise, index) => (
                <ExerciseComponent
                    key={exercise.id}
                    exercise={exercise}
                    workoutPlanId={planId!}
                    dayId={dayId!}
                />
            ))}
        </div>
    );
};

export default WorkoutDayDetails;
