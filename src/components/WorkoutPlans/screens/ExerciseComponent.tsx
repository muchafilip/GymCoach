import React, { useState, useEffect } from 'react';
import { Exercise as ExerciseType, ExerciseSet } from '../../../types';
import { firestore } from '../../../firebase/config';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import styles from './ExerciseComponent.module.css';

interface ExerciseProps {
    exercise: ExerciseType;
    workoutPlanId: string;
    dayId: string;
}

const ExerciseComponent: React.FC<ExerciseProps> = ({ exercise, workoutPlanId, dayId }) => {
    const [editableSets, setEditableSets] = useState<ExerciseSet[]>([]);
    const [loading, setLoading] = useState(true);
    const [isExerciseCompleted, setIsExerciseCompleted] = useState(exercise.completed ?? false);


    useEffect(() => {
        fetchSets();
    }, [exercise.id, workoutPlanId, dayId]);

    const fetchSets = async () => {
        setLoading(true);
        try {
            const setsCollectionRef = collection(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises/${exercise.id}/sets`);
            const setsSnapshot = await getDocs(setsCollectionRef);
            const setsData = setsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ExerciseSet[];
            setEditableSets(setsData);
        } catch (error) {
            console.error("Error fetching sets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSet = async () => {
        const lastSet = editableSets[editableSets.length - 1] || { setNumber: 0 };
        const newSet = { ...lastSet, setNumber: lastSet.setNumber + 1, completed: false };

        try {
            await addDoc(collection(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises/${exercise.id}/sets`), newSet);
            fetchSets(); // Refetch sets to update UI
        } catch (error) {
            console.error('Error adding new set:', error);
        }
    };

    const updateSetInFirebase = async (setIndex: number, updatedSet: ExerciseSet) => {
        const setRef = doc(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises/${exercise.id}/sets`, editableSets[setIndex].id);

        const setUpdate = {
            setNumber: updatedSet.setNumber,
            targetReps: updatedSet.targetReps,
            weight: updatedSet.weight,
            repsCompleted: updatedSet.repsCompleted,
            completed: updatedSet.completed,
        };

        await updateDoc(setRef, setUpdate);
    };


    const handleSetChange = async (setIndex: number, field: keyof ExerciseSet, value: string | number | boolean) => {
        const updatedSets = editableSets.map((set, index) =>
            index === setIndex ? { ...set, [field]: value } : set
        );
        setEditableSets(updatedSets);

        if (field === 'completed') {
            // Save changes to Firestore
            await updateSetInFirebase(setIndex, updatedSets[setIndex]);

            // Check if all sets are completed
            const allCompleted = updatedSets.every(set => set.completed);
            if (allCompleted) {
                // Update exercise completed status in Firestore
                const exerciseRef = doc(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises`, exercise.id);
                await updateDoc(exerciseRef, { completed: true });
            }
        }
    };

    if (loading) {
        return <div>Loading sets...</div>;
    }

    return (
        <div className={styles.exerciseContainer}>
            <div className={styles.exerciseHeader}>
                <h2>{exercise.name}</h2>
                <input
                    type="checkbox"
                    checked={editableSets.every(set => set.completed)}
                    onChange={e => editableSets.forEach((set, index) => handleSetChange(index, 'completed', e.target.checked))}
                />
            </div>
            <table className={styles.exerciseTable}>
                <thead>
                    <tr>
                        <th>Set</th>
                        <th>Weight</th>
                        <th>Target Reps</th>
                        <th>Reps Completed</th>
                        <th>Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {editableSets.map((set, index) => (
                        <tr key={index}>
                            <td>{set.setNumber}</td>
                            <td>
                                <input className={styles.inputField}
                                    type="text"
                                    value={set.weight}
                                    onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                                />
                            </td>
                            <td>{set.targetReps}</td>
                            <td>
                                <input className={styles.inputField}
                                    type="number"
                                    value={set.repsCompleted || ''}
                                    onChange={(e) => handleSetChange(index, 'repsCompleted', e.target.valueAsNumber)}
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={set.completed}
                                    onChange={(e) => handleSetChange(index, 'completed', e.target.checked)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className={styles.addButton} onClick={handleAddSet}>+ Add Set</button>

        </div>
    );
};

export default ExerciseComponent;
