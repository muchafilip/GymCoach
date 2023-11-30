import React, { useState } from 'react';
import { getExerciseSuggestionsFromAI } from '../utils/openAiUtils'; // Update the path accordingly
import plan from '../utils/planTemplate'; // Update the path accordingly
import { firestore } from '../firebase/config'; // Update with the correct path
import { collection, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';


interface GeneratorProps {
    currentUser: User | null
}
const WorkoutPlanGenerator: React.FC<GeneratorProps> = ({ currentUser }) => {
    const [selectedPlan, setSelectedPlan] = useState('');
    const [equipment, setEquipment] = useState('');
    const [planResult, setPlanResult] = useState(null);

    const saveWorkoutPlanToFirestore = async (openAIResponse: any, numberOfSets: number, targetRepsPerSet: number, currentUser: User) => {
        if (!currentUser || !currentUser.uid) {
            console.error('User not logged in');
            return;
        }

        try {
            // Create a new workout plan document with userId
            const workoutPlanDocRef = await addDoc(collection(firestore, 'workoutPlans'), {
                title: openAIResponse.name,
                userId: currentUser.uid
            });

            // Iterate over days in the response
            for (const day of openAIResponse.days) {
                const dayDocRef = await addDoc(collection(firestore, `workoutPlans/${workoutPlanDocRef.id}/workoutDays`), {
                    name: day.name
                });

                // Iterate over bodyparts/exercises
                for (const exerciseName of day.bodyparts) {
                    const exerciseDocRef = await addDoc(collection(firestore, `workoutPlans/${workoutPlanDocRef.id}/workoutDays/${dayDocRef.id}/exercises`), {
                        name: exerciseName,
                        description: `Description for ${exerciseName}`
                    });

                    // Create sets for each exercise
                    for (let setNumber = 1; setNumber <= numberOfSets; setNumber++) {
                        await addDoc(collection(firestore, `workoutPlans/${workoutPlanDocRef.id}/workoutDays/${dayDocRef.id}/exercises/${exerciseDocRef.id}/sets`), {
                            setNumber: setNumber,
                            targetReps: targetRepsPerSet,
                            weight: '', // You can leave it empty or set a default value
                            repsCompleted: null,
                            completed: false
                        });
                    }
                }
            }

            console.log('Workout plan saved successfully');
        } catch (error) {
            console.error('Error saving workout plan:', error);
        }
    };

    const handleGeneratePlan = async () => {
        if (!selectedPlan) {
            console.error("No plan selected.");
            return;
        }

        const result = await getExerciseSuggestionsFromAI(equipment.split(',').map(e => e.trim()));
        setPlanResult(result);
    };

    const handleSavePlan = async () => {
        if (!planResult || !currentUser) {
            console.error("No plan generated to save or user not logged in.");
            return;
        }

        const numberOfSets = 3;
        const targetRepsPerSet = 12;
        await saveWorkoutPlanToFirestore(planResult, numberOfSets, targetRepsPerSet, currentUser);
    };

    return (
        <div>
            <h1>Current user: {currentUser?.uid}</h1>
            <h2>Generate Workout Plan</h2>
            <select value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)}>
                <option value="">Select a Plan</option>
                <option value={plan.name}>{plan.name}</option>
            </select>
            <input
                type="text"
                value={equipment}
                onChange={e => setEquipment(e.target.value)}
                placeholder="Available Equipment (comma separated)"
            />
            <button onClick={handleGeneratePlan}>Generate Plan</button>

            {planResult && (
                <div>
                    <h3>Generated Plan:</h3>
                    <pre>{JSON.stringify(planResult, null, 2)}</pre>
                    <button onClick={handleSavePlan}>Save Plan</button>
                </div>
            )}
        </div>
    );
};

export default WorkoutPlanGenerator;
