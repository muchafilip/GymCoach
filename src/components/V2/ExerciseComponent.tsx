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
        let updatedValue: any;

        if (field === 'repsCompleted') {
            // Ensure the value is a string before parsing it as a number
            updatedValue = typeof value === 'string' ? parseInt(value, 10) : value;
        } else {
            updatedValue = value;
        }

        const updatedSets = editableSets.map((set, index) =>
            index === setIndex ? { ...set, [field]: updatedValue } : set
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
    const generateWeightOptions = () => {
        const options = [];
        for (let i = 0; i <= 500; i += 0.5) { // Adjust the upper limit as needed
            options.push(<option key={i} value={i}>{i}</option>);
        }
        return options;
    };

    const generateRepsOptions = () => {
        const options = [];
        for (let i = 0; i <= 100; i++) {
            options.push(<option key={i} value={i}>{i}</option>);
        }
        return options;
    };

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
                                <select
                                    className={styles.weightInputField}
                                    value={set.weight}
                                    onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                                    onBlur={() => handleSetUpdate(index)}
                                >
                                    {generateWeightOptions()}
                                </select>
                            </td>
                            <td>{set.targetReps}</td>
                            <td>
                                <select
                                    className={styles.weightInputField}
                                    value={set.repsCompleted || ''}
                                    onChange={(e) => handleSetChange(index, 'repsCompleted', e.target.value)}
                                    onBlur={() => handleSetUpdate(index)}
                                >
                                    {generateRepsOptions()}
                                </select>
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
