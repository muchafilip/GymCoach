// // components/WorkoutDayCard.tsx
// import React, { useState, useEffect } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { firestore } from '../../../firebase/config';
// import { WorkoutDay as WorkoutDayType, Exercise as ExerciseType } from '../../../types';
// //import ExerciseComponent from './ExerciseComponent';
// import styles from './WorkoutDayCard.module.css'

// interface WorkoutDayCardProps {
//     day: WorkoutDayType;
//     workoutPlanId: string;
// }

// const WorkoutDayCard: React.FC<WorkoutDayCardProps> = ({ day, workoutPlanId }) => {
//     const [exercises, setExercises] = useState<ExerciseType[]>([]);
//     const [expanded, setExpanded] = useState(false);


//     useEffect(() => {
//         if (expanded && exercises.length === 0) {
//             fetchExercises();
//         }
//     }, [expanded, day.id, workoutPlanId]);

//     const toggleExpanded = () => {
//         setExpanded(!expanded);
//         if (!expanded && exercises.length === 0) {
//             fetchExercises();
//         }
//     };

//     const fetchExercises = async () => {
//         try {
//             const exercisesSnapshot = await getDocs(collection(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${day.id}/exercises`));
//             const exercisesData = exercisesSnapshot.docs.map(exerciseDoc => ({
//                 id: exerciseDoc.id,
//                 ...exerciseDoc.data()
//             })) as ExerciseType[];
//             console.log(exercisesData);
//             setExercises(exercisesData);
//         } catch (error) {
//             console.error('Error fetching exercises:', error);
//         }
//     };

//     return (
//         <div className={styles.dayContainer}>
//             <div className={styles.dayHeader}>
//                 <h2>{day.name}</h2>
//                 <button onClick={toggleExpanded}>{expanded ? '-' : '+'}</button>
//             </div>
//             {expanded && exercises.map((exercise, index) => (
//                 <ExerciseComponent
//                     key={exercise.id}
//                     exercise={exercise}
//                     workoutPlanId={workoutPlanId}
//                     dayId={day.id}
//                 />
//             ))}
//         </div>
//     );
// };

// export default WorkoutDayCard;
export { };