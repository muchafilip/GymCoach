import { firestore } from '../firebase/config';
import { addDoc, collection, query, getDocs, limit } from 'firebase/firestore';

import { WorkoutPlan } from '../types';

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

export const fetchWorkoutPlan = async (): Promise<WorkoutPlan | null> => {
    try {
        const querySnapshot = await getDocs(collection(firestore, 'workoutPlans'));
        let workoutPlan: WorkoutPlan | null = null;

        querySnapshot.forEach((doc) => {
            // Assuming you want to fetch the first workout plan
            if (!workoutPlan) {
                workoutPlan = doc.data() as WorkoutPlan;
            }
        });

        return workoutPlan;
    } catch (error) {
        console.error("Error fetching workout plan:", error);
        return null; // Ensure null is returned in case of an error
    }
};
