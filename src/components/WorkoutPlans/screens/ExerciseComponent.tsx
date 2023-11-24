import React, { useState, useEffect } from 'react';
import { Exercise as ExerciseType, ExerciseSet } from '../../../types';
import { firestore } from '../../../firebase/config';
import { collection, getDocs, addDoc } from 'firebase/firestore';

interface ExerciseProps {
    exercise: ExerciseType;
    workoutPlanId: string;
    dayId: string;
}

const ExerciseComponent: React.FC<ExerciseProps> = ({ exercise, workoutPlanId, dayId }) => {
    const [sets, setSets] = useState<ExerciseSet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSets();
    }, [exercise.id, workoutPlanId, dayId]);

    const fetchSets = async () => {
        setLoading(true);
        try {
            const setsCollectionRef = collection(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises/${exercise.id}/sets`);
            const setsSnapshot = await getDocs(setsCollectionRef);
            const setsData = setsSnapshot.docs.map(doc => doc.data() as ExerciseSet);
            setSets(setsData);
        } catch (error) {
            console.error("Error fetching sets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSet = async () => {
        const lastSet = sets[sets.length - 1];
        const newSet = { ...lastSet, setNumber: lastSet.setNumber + 1 };

        try {
            await addDoc(collection(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises/${exercise.id}/sets`), newSet);
            fetchSets(); // Refetch sets to update UI
        } catch (error) {
            console.error('Error adding new set:', error);
        }
    };

    if (loading) {
        return <div>Loading sets...</div>;
    }

    return (
        <div>
            <h2>{exercise.name}</h2>
            {sets.length > 0 ? (
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
                        {sets.map((set, index) => (
                            <tr key={index}>
                                <td>{set.setNumber}</td>
                                <td>{set.weight}</td>
                                <td>{set.targetReps}</td>
                                <td>{set.repsCompleted}</td>
                                <td>{set.completed ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            ) : (
                <div>No sets available</div>
            )}
            <button onClick={handleAddSet}>+ Add Set</button>
        </div>
    );
};

export default ExerciseComponent;

