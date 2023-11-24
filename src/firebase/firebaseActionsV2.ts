import { firestore } from '../firebase/config';
import { addDoc, doc, updateDoc, arrayUnion, arrayRemove, collection, query, getDocs, limit, runTransaction } from 'firebase/firestore';

import { WorkoutPlan, ExerciseSet, Exercise, WorkoutDay } from '../types';

export const addWorkoutPlanNew = async (title: string) => {
    try {
        const workoutPlanRef = await addDoc(collection(firestore, 'workoutPlans'), { title });
        console.log('Workout plan added successfully with ID:', workoutPlanRef.id);
        return workoutPlanRef;
    } catch (error) {
        console.error('Error adding workout plan: ', error);
    }
};

export const addWorkoutDayNew = async (workoutPlanId: string, workoutDay: WorkoutDay) => {
    try {
        const workoutDayRef = await addDoc(collection(firestore, `workoutPlans/${workoutPlanId}/workoutDays`), {
            name: workoutDay.name
        });
        console.log('Workout day added successfully with ID:', workoutDayRef.id);

        // Add exercises for this workout day
        for (const exercise of workoutDay.exercises) {
            await addExercise(workoutPlanId, workoutDayRef.id, exercise);
        }
    } catch (error) {
        console.error('Error adding workout day: ', error);
    }
};

export const addExercise = async (workoutPlanId: string, workoutDayId: string, exercise: Exercise) => {
    try {
        const exerciseRef = await addDoc(collection(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${workoutDayId}/exercises`), {
            name: exercise.name,
            description: exercise.description
        });
        console.log('Exercise added successfully with ID:', exerciseRef.id);

        // Add sets for this exercise
        for (const set of exercise.sets) {
            await addSet(workoutPlanId, workoutDayId, exerciseRef.id, set);
        }
    } catch (error) {
        console.error('Error adding exercise: ', error);
    }
};

export const addSet = async (workoutPlanId: string, workoutDayId: string, exerciseId: string, set: ExerciseSet) => {
    try {
        const setRef = await addDoc(collection(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${workoutDayId}/exercises/${exerciseId}/sets`), set);
        console.log('Set added successfully with ID:', setRef.id);
    } catch (error) {
        console.error('Error adding set: ', error);
    }
};
