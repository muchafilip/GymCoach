// //components/ExerciseComponent.tsx
// import React, { useState, useEffect } from 'react';
// import { Exercise as ExerciseType, ExerciseSet } from '../../../types';
// import { firestore } from '../../../firebase/config';
// import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
// import styles from './ExerciseComponent.module.css';

// interface ExerciseProps {
//     exercise: ExerciseType;
//     workoutPlanId: string;
//     dayId: string;
// }

// const ExerciseComponent: React.FC<ExerciseProps> = ({ exercise, workoutPlanId, dayId }) => {
//     const [editableSets, setEditableSets] = useState<ExerciseSet[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [isExerciseCompleted, setIsExerciseCompleted] = useState(exercise.isCompleted ?? false);


//     useEffect(() => {
//         fetchSets();
//     }, [exercise.id, workoutPlanId, dayId]);

//     const fetchSets = async () => {
//         setLoading(true);
//         try {
//             const setsCollectionRef = collection(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises/${exercise.id}/sets`);
//             const setsSnapshot = await getDocs(setsCollectionRef);
//             const setsData = setsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ExerciseSet[];

//             // Sorting the sets by setNumber
//             setsData.sort((a, b) => a.setNumber - b.setNumber);

//             setEditableSets(setsData);
//         } catch (error) {
//             console.error("Error fetching sets:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddSet = async () => {
//         // Get the last set's details, or default to 0 if no sets exist
//         const lastSet = editableSets[editableSets.length - 1];
//         const newSetNumber = lastSet ? lastSet.setNumber + 1 : 1;
//         const newSetWeight = lastSet ? lastSet.weight : '';
//         const newSetTargetReps = lastSet ? lastSet.targetReps : 0;

//         const newSet = {
//             setNumber: newSetNumber,
//             targetReps: newSetTargetReps,
//             weight: newSetWeight,
//             repsCompleted: null,
//             completed: false
//         };

//         try {
//             const addedSetRef = await addDoc(collection(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises/${exercise.id}/sets`), newSet);
//             // Update state directly without fetching from Firestore
//             setEditableSets([...editableSets, { ...newSet, id: addedSetRef.id }]);
//         } catch (error) {
//             console.error('Error adding new set:', error);
//         }
//     };


//     const handleSetChange = async (setIndex: number, field: keyof ExerciseSet, value: string | number | boolean) => {
//         const updatedSets = editableSets.map((set, index) =>
//             index === setIndex ? { ...set, [field]: value } : set
//         );

//         // Save changes to Firestore
//         const setRef = doc(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises/${exercise.id}/sets`, editableSets[setIndex].id);
//         const setUpdate = { ...editableSets[setIndex], [field]: value };
//         await updateDoc(setRef, setUpdate);

//         setEditableSets(updatedSets);
//     };

//     const handleSetUpdate = async (setIndex: number) => {
//         const setToUpdate = editableSets[setIndex];
//         if (setToUpdate) {
//             // Construct an update object with keys as field paths
//             const updateObject = {
//                 setNumber: setToUpdate.setNumber,
//                 targetReps: setToUpdate.targetReps,
//                 weight: setToUpdate.weight,
//                 repsCompleted: setToUpdate.repsCompleted,
//                 completed: setToUpdate.completed
//             };

//             const setRef = doc(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${dayId}/exercises/${exercise.id}/sets`, setToUpdate.id);
//             await updateDoc(setRef, updateObject);
//         }
//     };



//     if (loading) {
//         return <div>Loading sets...</div>;
//     }

//     return (
//         <div className={styles.exerciseContainer}>
//             <div className={styles.exerciseHeader}>
//                 <h2>{exercise.name}</h2>
//                 <input
//                     type="checkbox"
//                     checked={editableSets.every(set => set.completed)}
//                     onChange={e => editableSets.forEach((set, index) => handleSetChange(index, 'completed', e.target.checked))}
//                 />
//             </div>
//             <table className={styles.exerciseTable}>
//                 <thead>
//                     <tr>
//                         <th>Set</th>
//                         <th>Weight</th>
//                         <th>Target Reps</th>
//                         <th>Reps Completed</th>
//                         <th>Completed</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {editableSets.map((set, index) => (
//                         <tr key={index}>
//                             <td>{set.setNumber}</td>
//                             <td>
//                                 <input
//                                     className={styles.inputField}
//                                     type="text"
//                                     value={set.weight}
//                                     onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
//                                     onBlur={() => handleSetUpdate(index)}
//                                 />
//                             </td>
//                             <td>{set.targetReps}</td>
//                             <td>
//                                 <input
//                                     className={styles.inputField}
//                                     type="number"
//                                     value={set.repsCompleted || ''}
//                                     onChange={(e) => handleSetChange(index, 'repsCompleted', e.target.valueAsNumber)}
//                                     onBlur={() => handleSetUpdate(index)}
//                                 />
//                             </td>
//                             <td>
//                                 <input
//                                     type="checkbox"
//                                     checked={set.completed}
//                                     onChange={(e) => handleSetChange(index, 'completed', e.target.checked)}
//                                     onBlur={() => handleSetUpdate(index)}
//                                 />
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             <button className={styles.addButton} onClick={handleAddSet}>+ Add Set</button>

//         </div>
//     );
// };

// export default ExerciseComponent;
export { }