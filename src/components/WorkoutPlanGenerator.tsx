//WorkoutPlanGenerator.tsx
import React, { useState } from 'react';
import { getExerciseSuggestionsFromAI } from '../utils/openAiUtils'; // Update the path accordingly
import plan from '../utils/planTemplate'; // Update the path accordingly
import { firestore } from '../firebase/config'; // Update with the correct path
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { User } from 'firebase/auth';
interface GeneratorProps {
    currentUser: User | null
}
const WorkoutPlanGenerator: React.FC<GeneratorProps> = ({ currentUser }) => {
    const [selectedPlan, setSelectedPlan] = useState('');
    const [equipment, setEquipment] = useState('');
    const [planResult, setPlanResult] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    const saveWorkoutPlanToFirestore = async (openAIResponse: any, numberOfSets: number, targetRepsPerSet: number, currentUser: User) => {
        if (!currentUser || !currentUser.uid) {
            console.error('User not logged in');
            return;
        }
        const currentDate = new Date();

        try {
            const batch = writeBatch(firestore);

            // Create a reference for a new workout plan document with userId
            const workoutPlanDocRef = doc(collection(firestore, 'workoutPlans'));
            const daysPerWeek = openAIResponse.days.length; // Number of days per week

            batch.set(workoutPlanDocRef, {
                title: openAIResponse.name,
                userId: currentUser.uid,
                dateCreated: currentDate,
                daysPerWeek: daysPerWeek
            });

            openAIResponse.days.forEach((day: any, index: number) => {
                const dayNumber = index + 1
                const dayName = `Day ${dayNumber} - ${day.name}`;

                const dayDocRef = doc(collection(firestore, `workoutPlans/${workoutPlanDocRef.id}/workoutDays`));

                batch.set(dayDocRef, {
                    name: dayName,
                    isCompleted: false,
                    dayIndex: dayNumber
                });

                day.bodyparts.forEach((exerciseName: any, index: number) => {
                    const exerciseDocRef = doc(collection(firestore, `workoutPlans/${workoutPlanDocRef.id}/workoutDays/${dayDocRef.id}/exercises`));

                    batch.set(exerciseDocRef, {
                        name: exerciseName,
                        description: `Description for ${exerciseName}`,
                        exerciseNumber: index + 1
                    });

                    for (let setNumber = 1; setNumber <= 3; setNumber++) {
                        const setDocRef = doc(collection(firestore, `workoutPlans/${workoutPlanDocRef.id}/workoutDays/${dayDocRef.id}/exercises/${exerciseDocRef.id}/sets`));
                        batch.set(setDocRef, {
                            setNumber: setNumber,
                            targetReps: 8,
                            weight: '',
                            repsCompleted: null,
                            completed: false
                        });
                    }
                });
            });

            await batch.commit();
            console.log('Workout plan saved successfully');
            console.log(workoutPlanDocRef.id)
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
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
            {showAlert && (
                <div style={{ backgroundColor: 'green', padding: '10px', margin: '10px 0' }}>
                    Workout plan saved successfully!
                </div>
            )}
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
