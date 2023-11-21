import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase/config';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { WorkoutPlan as WorkoutPlanType, ExerciseSet } from '../types';
import '../WorkoutPlan.css'; // Import the CSS file
import SetComponent from '../components/WorkoutPlans/Set';

const WorkoutPlans: React.FC = () => {
    const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlanType[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, 'workoutPlans'), (querySnapshot) => {
            const plans: WorkoutPlanType[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }) as WorkoutPlanType);
            setWorkoutPlans(plans);
        });

        return () => unsubscribe();
    }, []);

    const handleSetChange = async <T extends keyof ExerciseSet>(
        planId: string,
        dayIndex: number,
        exerciseIndex: number,
        setIndex: number,
        field: T,
        value: ExerciseSet[T]
    ) => {
        let newWorkoutPlans = [...workoutPlans];

        // Specify the type for 'plan' as 'WorkoutPlanType'
        const setToUpdate = newWorkoutPlans.find((plan: WorkoutPlanType) => plan.id === planId)!
            .workoutDays[dayIndex].exercises[exerciseIndex].sets[setIndex];

        // Perform the update
        //setToUpdate[field] = value;

        // Update state and Firestore
        setWorkoutPlans(newWorkoutPlans);
        const planDoc = doc(firestore, 'workoutPlans', planId);
        await updateDoc(planDoc, { workoutDays: newWorkoutPlans.find((plan: WorkoutPlanType) => plan.id === planId)!.workoutDays });
    };




    const addSet = async (planId: string, dayIndex: number, exerciseIndex: number) => {
        let newWorkoutPlans = [...workoutPlans];
        const newSet = { setNumber: 1, targetReps: 5, weight: '100', repsCompleted: 3, completed: true };

        newWorkoutPlans.find(plan => plan.id === planId)!
            .workoutDays[dayIndex].exercises[exerciseIndex].sets.push(newSet);

        setWorkoutPlans(newWorkoutPlans);

        // Update Firestore
        const planDoc = doc(firestore, 'workoutPlans', planId);
        await updateDoc(planDoc, { workoutDays: newWorkoutPlans.find(plan => plan.id === planId)!.workoutDays });
    };

    return (
        <div className="workout-plans-container">
            <h2 className="workout-plans-title">Workout Plans</h2>
            {workoutPlans.map(plan => (
                <div key={plan.id} className="workout-plan">
                    <h3 className="plan-title">{plan.title}</h3>
                    {plan.workoutDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="workout-day">
                            <h4 className="day-name">{day.name}</h4>



                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default WorkoutPlans;
