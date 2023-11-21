import React from 'react';
import { Exercise as ExerciseType } from '../../types'; // Assuming you have an Exercise type

interface ExerciseProps {
    exercise: ExerciseType;
}

const Exercise: React.FC<ExerciseProps> = ({ exercise }) => {
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
                    {exercise.sets.map((set, index) => (
                        <tr key={index}>
                            <td>{set.setNumber}</td>
                            <td>{set.weight}</td>
                            <td>{set.targetReps}</td>
                            <td>{set.repsCompleted !== null ? set.repsCompleted : 'N/A'}</td>
                            <td>{set.completed ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Exercise;
