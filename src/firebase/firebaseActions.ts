import { firestore } from '../firebase/config';
import { addDoc, doc, updateDoc, arrayUnion, arrayRemove, collection, query, getDocs, limit, runTransaction } from 'firebase/firestore';

import { WorkoutPlan, ExerciseSet } from '../types';
export const addWorkoutPlan = async (plan: WorkoutPlan) => {
    try {
        await addDoc(collection(firestore, 'workoutPlans'), plan);
        console.log('Workout plan added successfully');
    } catch (error) {
        console.error('Error adding workout plan: ', error);
    }
};



export const fetchFirstSetOfFirstExercise = async () => {
    try {
        const q = query(collection(firestore, 'workoutPlans'), limit(1));
        const querySnapshot = await getDocs(q);
        let firstSet = null;

        querySnapshot.forEach((doc) => {
            const plan = doc.data() as WorkoutPlan;
            if (plan.workoutDays && plan.workoutDays.length > 0) {
                const firstDay = plan.workoutDays[0];
                if (firstDay.exercises && firstDay.exercises.length > 0) {
                    const firstExercise = firstDay.exercises[0];
                    if (firstExercise.sets && firstExercise.sets.length > 0) {
                        firstSet = firstExercise.sets[0];
                    }
                }
            }
        });

        console.log("First Set:", firstSet);
        return firstSet;
    } catch (error) {
        console.error("Error fetching first set of first exercise:", error);
    }
};

export const fetchAllSetsOfFirstExercise = async () => {
    try {
        const q = query(collection(firestore, 'workoutPlans'), limit(1));
        const querySnapshot = await getDocs(q);
        let allSets: any[] = [];

        querySnapshot.forEach((doc) => {
            const plan = doc.data() as WorkoutPlan;
            if (plan.workoutDays && plan.workoutDays.length > 0) {
                const firstDay = plan.workoutDays[0];
                if (firstDay.exercises && firstDay.exercises.length > 0) {
                    const firstExercise = firstDay.exercises[0];
                    if (firstExercise.sets && firstExercise.sets.length > 0) {
                        allSets = firstExercise.sets;
                    }
                }
            }
        });

        console.log("All Sets of First Exercise:", allSets);
        return allSets;
    } catch (error) {
        console.error("Error fetching all sets of first exercise:", error);
    }
};

export const fetchExercisesFromFirstDay = async () => {
    try {
        const q = query(collection(firestore, 'workoutPlans'), limit(1));
        const querySnapshot = await getDocs(q);
        let firstDayExercises: any[] = [];

        querySnapshot.forEach((doc) => {
            const plan = doc.data() as WorkoutPlan;
            if (plan.workoutDays && plan.workoutDays.length > 0) {
                const firstDay = plan.workoutDays[0];
                if (firstDay.exercises && firstDay.exercises.length > 0) {
                    firstDayExercises = firstDay.exercises;
                }
            }
        });

        console.log("Exercises from First Day:", firstDayExercises);
        return firstDayExercises;
    } catch (error) {
        console.error("Error fetching exercises from first workout day:", error);
    }
};
// Add this near your type definitions (e.g., in types/index.ts)
export interface FetchedWorkoutPlan extends WorkoutPlan {
    id: string;
}

export const fetchWorkoutPlan = async (): Promise<FetchedWorkoutPlan | null> => {
    try {
        const querySnapshot = await getDocs(collection(firestore, 'workoutPlans'));
        let workoutPlan: FetchedWorkoutPlan | null = null;

        querySnapshot.forEach((doc) => {
            if (!workoutPlan) {
                workoutPlan = { id: doc.id, ...doc.data() as WorkoutPlan };
            }
        });

        return workoutPlan;
    } catch (error) {
        console.error("Error fetching workout plan:", error);
        return null;
    }
};

export const saveExerciseChanges = async (
    workoutPlanId: string,
    dayIndex: number,
    exerciseIndex: number,
    setIndex: number,
    updatedSet: ExerciseSet
) => {
    const workoutPlanDocRef = doc(firestore, 'workoutPlans', workoutPlanId);

    try {
        await runTransaction(firestore, async (transaction) => {
            // Get the current document state
            const workoutPlanSnapshot = await transaction.get(workoutPlanDocRef);
            if (!workoutPlanSnapshot.exists()) {
                throw new Error('Document does not exist!');
            }
            const workoutPlanData = workoutPlanSnapshot.data();

            // Clone the exercises array to modify
            const exercises = [...workoutPlanData.workoutDays[dayIndex].exercises];
            const exerciseToUpdate = exercises[exerciseIndex];

            // Update the specific set within the cloned exercises array
            exerciseToUpdate.sets[setIndex] = updatedSet;

            // Update the cloned exercises array back to the workout plan data
            workoutPlanData.workoutDays[dayIndex].exercises = exercises;

            // Commit the transaction
            transaction.update(workoutPlanDocRef, workoutPlanData);
        });

        console.log('Exercise set updated successfully');
    } catch (error) {
        console.error('Error updating exercise set:', error);
    }
};