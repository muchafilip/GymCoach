import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { where } from 'firebase/firestore';
import { fetchData, updateData, fetchDocument } from './firebaseService'; // Adjust the import path
import { WorkoutPlan, WorkoutDay, UserType } from '../../types'; // Adjust import path as necessary
import { Link } from 'react-router-dom';


interface UserWorkoutPlansProps {
    currentUser: User;
}

const NewUserWorkoutPlans: React.FC<UserWorkoutPlansProps> = ({ currentUser }) => {
    const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
    const [subscribedPlanId, setSubscribedPlanId] = useState<string | null>(null);


    useEffect(() => {
        const fetchUserWorkoutPlans = async () => {
            if (!currentUser) return;

            try {
                // Fetch the user's document to get the subscribed workout plan ID
                const userDoc = await fetchDocument<UserType>(`users/${currentUser.uid}`);
                setSubscribedPlanId(userDoc.subscribedWorkoutPlanId || null);

                // Fetch all workout plans created by the current user
                const userWorkoutPlansPath = `workoutPlans`;
                const plans = await fetchData<WorkoutPlan>(userWorkoutPlansPath, [
                    where('userId', '==', currentUser.uid)
                ]);
                setWorkoutPlans(plans);
            } catch (error) {
                console.error("Error fetching user's subscribed plan ID:", error);
            }
        };

        fetchUserWorkoutPlans();
    }, [currentUser]);



    const subscribeToPlan = async (planId: string | undefined) => {
        if (!planId || !currentUser) return;

        // Update user's subscribed workout plan
        const userPath = `users/${currentUser.uid}`;
        await updateData(userPath, { subscribedWorkoutPlanId: planId });
        console.log('subscribed')

        // Fetch workout days, find the first non-completed day, and set it as current
        const workoutDaysPath = `workoutPlans/${planId}/workoutDays`;
        const workoutDays = await fetchData<WorkoutDay>(workoutDaysPath);
        const firstNonCompletedDay = workoutDays
            .sort((a, b) => a.name.localeCompare(b.name))
            .find(day => !day.isCompleted);

        if (firstNonCompletedDay) {
            // Update user's current workout day
            await updateData(userPath, { currentWorkoutDayId: firstNonCompletedDay.id });
            console.log('current workout day saved')
            console.log(firstNonCompletedDay.id)

        } else {
            // Optionally handle case where all days are completed or no days are found
            console.log("No non-completed workout days available in this plan.");
        }
    };


    return (
        <div>
            <h1>Your Workout Plans</h1>
            {workoutPlans.map(plan => (
                <div key={plan.id}>
                    <h2>{plan.title}</h2>

                    <Link to={`/workout-plans/${plan.id}`}>Show plan</Link>

                    {plan.id === subscribedPlanId ? (
                        <div>Subscribed</div>
                    ) : (
                        <button onClick={() => subscribeToPlan(plan.id)}>Subscribe</button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NewUserWorkoutPlans;
