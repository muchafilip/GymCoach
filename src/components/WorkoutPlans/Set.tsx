import React from 'react';

export interface SetProps {
    set: {
        setNumber: number;
        weight: string;
        targetReps: number;
        repsCompleted: number | null;
        completed: boolean;
    };
    onToggleComplete: (completed: boolean) => void;
}


const SetComponent: React.FC<SetProps> = ({ set, onToggleComplete }) => {
    return (
        <tr>
            <td>{set.setNumber}</td>
            <td>{set.weight}</td>
            <td>{set.targetReps}</td>
            <td>{set.repsCompleted !== null ? set.repsCompleted : 'Not started'}</td>
            <td>
                <input
                    type="checkbox"
                    checked={set.completed}
                    onChange={(e) => onToggleComplete(e.target.checked)}
                />
            </td>
        </tr>
    );
};




export default SetComponent;
