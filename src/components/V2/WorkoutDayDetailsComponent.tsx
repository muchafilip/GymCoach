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
    const [loading, setLoading] = useState(true); // Added loading state


    useEffect(() => {
        const fetchDayDetails = async () => {
            setLoading(true); // Start loading

            if (planId) {
                const allDays = await fetchData<WorkoutDay>(`workoutPlans/${planId}/workoutDays`);
                const sortedDays = allDays.sort((a, b) => {
                    // Regular expression to match the day number
                    const dayNumberRegex = /\bDay (\d+)/i;

                    // Extract day numbers from the name strings
                    const matchA = a.name.match(dayNumberRegex);
                    const matchB = b.name.match(dayNumberRegex);

                    // Ensure matches are found and extract day numbers; default to 0 if not found
                    const dayANum = matchA ? parseInt(matchA[1], 10) : 0;
                    const dayBNum = matchB ? parseInt(matchB[1], 10) : 0;

                    // Compare the day numbers as integers
                    return dayANum - dayBNum;
                });

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
            setLoading(false); // Data has been fetched, stop loading

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

    if (loading) {
        return <div>Loading day details...</div>; // Or a spinner/loader component
    }


    return (
        <div>
            <button onClick={handlePrevDay} disabled={!prevDayId}>← Previous Day</button>
            <button onClick={handleNextDay} disabled={!nextDayId}>Next Day →</button>

            <h1>{workoutDay?.name}</h1>
            {workoutDay?.isCompleted ? 'Completed' : 'Not Completed'}
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
