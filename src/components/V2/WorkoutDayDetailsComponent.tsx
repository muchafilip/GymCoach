import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchData, fetchDocument } from './firebaseService';
import ExerciseComponent from './ExerciseComponent';
import { Exercise, WorkoutDay } from '../../types';

const WorkoutDayDetailsComponent = () => {
    const { planId, dayId } = useParams();
    const navigate = useNavigate();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [workoutDay, setWorkoutDay] = useState<WorkoutDay | null>(null);
    const [prevDayId, setPrevDayId] = useState<string | null>(null);
    const [nextDayId, setNextDayId] = useState<string | null>(null);

    useEffect(() => {
        const fetchDayDetails = async () => {
            if (planId) {
                const allDays = await fetchData<WorkoutDay>(`workoutPlans/${planId}/workoutDays`);
                const sortedDays = allDays.sort((a, b) => a.name.localeCompare(b.name));
                const currentIndex = sortedDays.findIndex(day => day.id === dayId);

                const prevDay = sortedDays[currentIndex - 1];
                const nextDay = sortedDays[currentIndex + 1];
                setPrevDayId(prevDay?.id || null);
                setNextDayId(nextDay?.id || null);

                if (dayId) {
                    const dayDetails = await fetchDocument<WorkoutDay>(`workoutPlans/${planId}/workoutDays/${dayId}`);
                    setWorkoutDay(dayDetails);
                    const fetchedExercises = await fetchData<Exercise>(`workoutPlans/${planId}/workoutDays/${dayId}/exercises`);
                    setExercises(fetchedExercises);
                }
            }
        };

        fetchDayDetails();
    }, [planId, dayId]);

    const handlePrevDay = () => {
        if (prevDayId) {
            navigate(`/workout-plans/${planId}/days/${prevDayId}`);
        }
    };

    const handleNextDay = () => {
        if (nextDayId) {
            navigate(`/workout-plans/${planId}/days/${nextDayId}`);
        }
    };

    return (
        <div>
            <button onClick={handlePrevDay} disabled={!prevDayId}>← Previous Day</button>
            <button onClick={handleNextDay} disabled={!nextDayId}>Next Day →</button>

            <h1>{workoutDay?.name}</h1>
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

export default WorkoutDayDetailsComponent;
