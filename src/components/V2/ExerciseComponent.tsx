import React, { useState, useEffect } from 'react';
import { Exercise as ExerciseType, ExerciseSet } from '../../types';
import { fetchData, addData, updateData } from './firebaseService'; // Adjust the import path
import styles from './ExerciseComponent.module.css';

interface ExerciseProps {
    exercise: ExerciseType;
    workoutPlanId: string;
    dayId: string;
}

const ExerciseComponent: React.FC<ExerciseProps> = ({ exercise, workoutPlanId, dayId }) => {
    const [editableSets, setEditableSets] = useState<ExerciseSet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSets = async () => {
            setLoading(true);
            const path = `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises/${exercise.id}/sets`;
            const sets = await fetchData<ExerciseSet>(path);
            sets.sort((a, b) => a.setNumber - b.setNumber);
            setEditableSets(sets);
            setLoading(false);
        };

        fetchSets();
    }, [exercise.id, workoutPlanId, dayId]);

    const handleAddSet = async () => {
        const lastSet = editableSets[editableSets.length - 1];
        const newSet = {
            setNumber: lastSet ? lastSet.setNumber + 1 : 1,
            targetReps: lastSet ? lastSet.targetReps : 0,
            weight: lastSet ? lastSet.weight : '',
            repsCompleted: null,
            completed: false
        };

        const path = `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises/${exercise.id}/sets`;
        const addedSet = await addData<ExerciseSet>(path, newSet);
        setEditableSets([...editableSets, addedSet]);
    };

    const handleSetChange = async (setIndex: number, field: keyof ExerciseSet, value: string | number | boolean) => {
        const updatedSets = editableSets.map((set, index) =>
            index === setIndex ? { ...set, [field]: value } : set
        );

        setEditableSets(updatedSets);
    };

    const handleSetUpdate = async (setIndex: number) => {
        const setToUpdate = editableSets[setIndex];
        if (setToUpdate) {
            const path = `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises/${exercise.id}/sets/${setToUpdate.id}`;
            await updateData(path, setToUpdate);
        }
    };

    if (loading) {
        return <div>.</div>;
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
                                <input
                                    className={styles.inputField}
                                    type="text"
                                    value={set.weight}
                                    onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                                    onBlur={() => handleSetUpdate(index)}
                                />
                            </td>
                            <td>{set.targetReps}</td>
                            <td>
                                <input
                                    className={styles.inputField}
                                    type="number"
                                    value={set.repsCompleted || ''}
                                    onChange={(e) => handleSetChange(index, 'repsCompleted', e.target.valueAsNumber)}
                                    onBlur={() => handleSetUpdate(index)}
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={set.completed}
                                    onChange={(e) => handleSetChange(index, 'completed', e.target.checked)}
                                    onBlur={() => handleSetUpdate(index)}
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
