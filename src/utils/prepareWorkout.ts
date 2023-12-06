import { collection, addDoc, writeBatch, doc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { firestore } from '../firebase/config'; // Update with the correct path


export const prepareWorkoutPlanData = (openAIResponse: any, numberOfSets: number, targetRepsPerSet: number) => {
    const workoutPlan = {
        title: openAIResponse.name,
        workoutDays: openAIResponse.days.map((day: { name: any; bodyparts: any[]; }) => ({
            name: day.name,
            exercises: day.bodyparts.map(exerciseName => ({
                name: exerciseName,
                description: `Description for ${exerciseName}`,
                sets: Array.from({ length: numberOfSets }, (_, i) => ({
                    setNumber: i + 1,
                    targetReps: targetRepsPerSet,
                    weight: '',
                    repsCompleted: null,
                    completed: false
                }))
            }))
        }))
    };

    return workoutPlan;
};

export const saveOptimizedWorkoutPlanToFirestore = async (workoutPlan: any, currentUser: User) => {
    // ... user check ...

    try {
        const workoutPlanDocRef = doc(collection(firestore, 'workoutPlans'));
        await setDoc(workoutPlanDocRef, {
            ...workoutPlan,
            userId: currentUser.uid
        });

        console.log('Workout plan saved successfully');
    } catch (error) {
        console.error('Error saving workout plan:', error);
    }
};
