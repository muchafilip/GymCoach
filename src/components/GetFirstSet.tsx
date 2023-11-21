import React, { useState, useEffect } from 'react';
import { fetchAllSetsOfFirstExercise } from '../firebase/firebaseActions';
import { ExerciseSet } from '../types';

const OneSetViewer: React.FC = () => {
    const [allSets, setAllSets] = useState<ExerciseSet[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedSets = await fetchAllSetsOfFirstExercise();
            if (fetchedSets) {
                setAllSets(fetchedSets);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>All Sets of First Exercise</h1>
            {allSets.length > 0 ? (
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
                        {allSets.map((set, index) => (
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
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default OneSetViewer;
