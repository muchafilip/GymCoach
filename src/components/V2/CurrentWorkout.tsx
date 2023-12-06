import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { fetchData, fetchDocument, updateData } from './firebaseService';
import ExerciseComponent from './Exercise';
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

        // Update the current day as completed
        const dayPath = `workoutPlans/${subscribedWorkoutPlanId}/workoutDays/${currentDay.id}`;
        await updateData(dayPath, { isCompleted: true });

        // Fetch the next day that is not completed and set it as current
        const nextDayPath = `workoutPlans/${subscribedWorkoutPlanId}/workoutDays`;
        const constraints = [where('isCompleted', '==', false)];
        const sortedDays = await fetchData<WorkoutDay>(nextDayPath, constraints);
        const nextDay = sortedDays.sort((a, b) => a.name.localeCompare(b.name))[0];

        if (nextDay) {
            // Update the user document with the new current day ID
            const userPath = `users/${currentUser.uid}`;
            await updateData(userPath, { currentWorkoutDayId: nextDay.id });

            // Set the new current day in the state
            setCurrentDay(nextDay);

            // Fetch exercises and sets for the new current day
            const exercisePath = `workoutPlans/${subscribedWorkoutPlanId}/workoutDays/${nextDay.id}/exercises`;
            const fetchedExercises = await fetchData<Exercise>(exercisePath);
            setExercises(fetchedExercises);
        } else {
            console.log("No more workout days available or all have been completed.");
        }
    };


    if (loading) return <div>Loading...</div>;
    if (!currentDay) return <div>No current workout day found.</div>;

    return (
        <div>
            <h2></h2>
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
