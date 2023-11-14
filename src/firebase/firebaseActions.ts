import { firestore } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { WorkoutPlan } from '../types';

export const addWorkoutPlan = async (plan: WorkoutPlan) => {
    try {
        await addDoc(collection(firestore, 'workoutPlans'), plan);
        console.log('Workout plan added successfully');
    } catch (error) {
        console.error('Error adding workout plan: ', error);
    }
};

// Add more functions here as needed for CRUD operations
