import React, { useState } from 'react';
import { Exercise as ExerciseType, ExerciseSet } from '../../types';
import { saveExerciseChanges } from '../../firebase/firebaseActions';

interface ExerciseProps {
    exercise: ExerciseType;
    workoutPlanId: string;
    dayIndex: number;
    exerciseIndex: number;
}

const Exercise: React.FC<ExerciseProps> = ({ exercise, workoutPlanId, dayIndex, exerciseIndex }) => {
    const [editableSets, setEditableSets] = useState<ExerciseSet[]>(exercise.sets);

    const handleSetChange = (setIndex: number, field: keyof ExerciseSet, value: string | number) => {
        const updatedSets = editableSets.map((set, index) =>
            index === setIndex ? { ...set, [field]: value } : set
        );
        setEditableSets(updatedSets);
    };

    const handleSaveChanges = async () => {
        // Iterate over each set and save changes individually
        for (let i = 0; i < editableSets.length; i++) {
            try {
                await saveExerciseChanges(
                    workoutPlanId,
                    dayIndex,
                    exerciseIndex,
                    i,  // setIndex
                    editableSets[i]  // updatedSet
                );
                console.log(`Set ${i + 1} changes saved`);
            } catch (error) {
                console.error(`Error saving changes for set ${i + 1}:`, error);
            }
        }
    };

    return (
        <div>
            <h2>{exercise.name}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Set</th>
                        <th>Weight</th>
                        <th>Target Reps</th>
                        <th>Reps</th>
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
                                    value={set.repsCompleted !== null ? set.repsCompleted : ''}
                                    onChange={(e) => handleSetChange(index, 'repsCompleted', e.target.valueAsNumber)}
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={set.completed}
                                    onChange={(e) => handleSetChange(index, 'completed', "yes")}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleSaveChanges}>Save Changes</button>
        </div>
    );
};

export default Exercise;
