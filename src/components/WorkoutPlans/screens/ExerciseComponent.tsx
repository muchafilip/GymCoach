import React, { useState, useEffect } from 'react';
import { Exercise as ExerciseType, ExerciseSet } from '../../../types';
import { firestore } from '../../../firebase/config';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';

interface ExerciseProps {
    exercise: ExerciseType;
    workoutPlanId: string;
    dayId: string;
}

const ExerciseComponent: React.FC<ExerciseProps> = ({ exercise, workoutPlanId, dayId }) => {
    const [editableSets, setEditableSets] = useState<ExerciseSet[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleSetChange = (index: number, field: any, value: any) => {
        const updatedSets = editableSets.map((set, i) =>
            i === index ? { ...set, [field]: value } : set
        );
        setEditableSets(updatedSets);
    };

    const handleSaveChanges = async () => {
        if (editableSets.every(set => set.completed)) {
            for (let set of editableSets) {
                const setRef = doc(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises/${exercise.id}/sets`, set.id);
                const updatedSet = {
                    weight: set.weight,
                    targetReps: set.targetReps,
                    repsCompleted: set.repsCompleted,
                    completed: set.completed
                };
                await updateDoc(setRef, updatedSet);
            }
            console.log('All sets updated');
        } else {
            console.log('Not all sets are completed. Changes are not saved.');
        }
    };


    if (loading) {
        return <div>Loading sets...</div>;
    }

    return (
        <div>
            <h2>{exercise.name}</h2>
            <table>
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
                                <input
                                    type="text"
                                    value={set.weight}
                                    onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                                />
                            </td>
                            <td>{set.targetReps}</td>
                            <td>
                                <input
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
            <button onClick={handleAddSet}>+ Add Set</button>
            <button onClick={handleSaveChanges}>Save Changes</button>
        </div>
    );
};

export default ExerciseComponent;
