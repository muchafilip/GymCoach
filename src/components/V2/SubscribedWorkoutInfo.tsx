import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { fetchData, fetchDocument } from './firebaseService';
import { WorkoutDay, WorkoutPlan } from '../../types';

interface SubscribedWorkoutInfoProps {
    currentUser: User | null;
}

// ... Other imports and setup

const SubscribedWorkoutInfo: React.FC<SubscribedWorkoutInfoProps> = ({ currentUser }) => {
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [completedDaysCount, setCompletedDaysCount] = useState<number>(0);

    useEffect(() => {
        const fetchSubscribedPlanInfo = async () => {
            if (!currentUser) return;

            try {
                const userDoc = await fetchDocument<{ subscribedWorkoutPlanId?: string }>(`users/${currentUser.uid}`);
                console.log("User document:", userDoc); // Logging the user document

                if (userDoc?.subscribedWorkoutPlanId) {
                    let plan = await fetchDocument<WorkoutPlan>(`workoutPlans/${userDoc.subscribedWorkoutPlanId}`);
                    console.log("Workout plan:", plan); // Logging the workout plan

                    const days = await fetchData<WorkoutDay>(`workoutPlans/${userDoc.subscribedWorkoutPlanId}/workoutDays`);
                    console.log("Workout days:", days); // Logging the workout days

                    // Include the fetched days in the workout plan object
                    plan = { ...plan, workoutDays: days };
                    setWorkoutPlan(plan);

                    // Compute the completed days count
                    const completedCount = days.filter(day => day.isCompleted).length;
                    setCompletedDaysCount(completedCount);
                }
            } catch (error) {
                console.error("Error fetching subscribed workout plan info:", error);
            }
        };

        fetchSubscribedPlanInfo();
    }, [currentUser]);

    // Make sure to handle the potential for workoutPlan to be null
    if (!workoutPlan || !workoutPlan.workoutDays) return null;

    return (
        <div>
            <h3>Current Plan: {workoutPlan.title}</h3>
            <p>Days Completed: {completedDaysCount} / {workoutPlan.workoutDays.length}</p>
        </div>
    );
};

export default SubscribedWorkoutInfo;
