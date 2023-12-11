import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { fetchData, fetchDocument, updateData } from './firebaseService';
import ExerciseComponent from './ExerciseComponent';
import { WorkoutDay, Exercise, UserType } from '../../types';
import { where } from 'firebase/firestore';

interface CurrentWorkoutDayProps {
    currentUser: User | null;
}

const CurrentWorkoutDay: React.FC<CurrentWorkoutDayProps> = ({ currentUser }) => {
    const [currentDay, setCurrentDay] = useState<WorkoutDay | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [subscribedWorkoutPlanId, setSubscribedWorkoutPlanId] = useState<string>('');

    useEffect(() => {
        const fetchCurrentDay = async () => {
            setLoading(true);
            if (currentUser) {
                try {
                    // Assuming currentUser.uid is the document ID for the user in Firestore
                    const userDocPath = `users/${currentUser.uid}`;
                    const userDoc = await fetchDocument<UserType>(userDocPath);

                    if (userDoc && userDoc.subscribedWorkoutPlanId && userDoc.currentWorkoutDayId) {
                        setSubscribedWorkoutPlanId(userDoc.subscribedWorkoutPlanId);

                        const dayPath = `workoutPlans/${userDoc.subscribedWorkoutPlanId}/workoutDays/${userDoc.currentWorkoutDayId}`;
                        const currentDay = await fetchDocument<WorkoutDay>(dayPath);
                        setCurrentDay(currentDay);

                        if (currentDay && currentDay.id) {
                            const exercisePath = `workoutPlans/${userDoc.subscribedWorkoutPlanId}/workoutDays/${currentDay.id}/exercises`;
                            const fetchedExercises = await fetchData<Exercise>(exercisePath);
                            setExercises(fetchedExercises);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user or workout day data:", error);
                }
            }
            setLoading(false);
        };

        fetchCurrentDay();
    }, [currentUser]);


    const handleDayCompletion = async () => {
        if (!currentUser || !currentDay || !subscribedWorkoutPlanId) return;

        // Get the current date and time
        const currentDate = new Date();

        // Mark the current day as completed and set the dateCompleted
        const dayPath = `workoutPlans/${subscribedWorkoutPlanId}/workoutDays/${currentDay.id}`;
        await updateData(dayPath, {
            isCompleted: true,
            dateCompleted: currentDate // Add the current date as dateCompleted
        });

        // Fetch the next workout day
        const nextDayPath = `workoutPlans/${subscribedWorkoutPlanId}/workoutDays`;
        const constraints = [where('isCompleted', '==', false)];
        const nextDays = await fetchData<WorkoutDay>(nextDayPath, constraints);
        const nextDay = nextDays.sort((a, b) => a.name.localeCompare(b.name))[0];

        // Update user document with previous and current workout day ID
        const userPath = `users/${currentUser.uid}`;
        await updateData(userPath, {
            previousCurrentDayId: currentDay.id,
            currentWorkoutDayId: nextDay ? nextDay.id : null
        });

        // Update the local state
        setCurrentDay(nextDay || null);

        // Fetch exercises and sets for the new current day
        if (nextDay && nextDay.id) {
            const exercisePath = `workoutPlans/${subscribedWorkoutPlanId}/workoutDays/${nextDay.id}/exercises`;
            const fetchedExercises = await fetchData<Exercise>(exercisePath);
            setExercises(fetchedExercises);
        } else {
            setExercises([]); // Clear exercises if no next day is found
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!currentDay) return <div>No current workout day found.</div>;

    return (
        <div>
            <h2>Current Workout Day: {currentDay?.name}</h2>
            <button onClick={handleDayCompletion} disabled={!currentDay}>
                Mark as Completed
            </button>
            {exercises.map((exercise, index) => (
                <ExerciseComponent
                    key={index}
                    exercise={exercise}
                    workoutPlanId={subscribedWorkoutPlanId}
                    dayId={currentDay?.id || ''}
                />
            ))}
        </div>
    );
};

export default CurrentWorkoutDay;
