// // components/WorkoutDetails.tsx
// import React, { useEffect, useState } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { firestore } from '../../firebase/config';
// import { WorkoutDay as WorkoutDayType, Exercise as ExerciseType } from '../../types';

// interface WorkoutDetailsProps {
//     workoutPlanId: string; // This will be the ID of the workout plan to display
// }

// const WorkoutDetails: React.FC<WorkoutDetailsProps> = ({ workoutPlanId }) => {
//     const [workoutDays, setWorkoutDays] = useState<WorkoutDayType[]>([]);

//     useEffect(() => {
//         const fetchWorkoutDaysAndExercises = async () => {
//             // Fetch workout days
//             const daysSnapshot = await getDocs(collection(firestore, `workoutPlans/${workoutPlanId}/workoutDays`));
//             const daysData = daysSnapshot.docs.map((dayDoc) => {
//                 const dayData = dayDoc.data() as WorkoutDayType;
//                 return {
//                     ...dayData,
//                     id: dayDoc.id, // Store the day document ID
//                     exercises: [] // Placeholder for exercises
//                 };
//             });

//             // Fetch exercises for each workout day
//             for (let day of daysData) {
//                 const exercisesSnapshot = await getDocs(collection(firestore, `workoutPlans/${workoutPlanId}/workoutDays/${day.id}/exercises`));
//                 day.exercises = exercisesSnapshot.docs.map((exerciseDoc) => {
//                     const exerciseData = exerciseDoc.data() as ExerciseType;
//                     return {
//                         ...exerciseData,
//                         id: exerciseDoc.id // Store the exercise document ID
//                     };
//                 });
//             }

//             setWorkoutDays(daysData);
//         };

//         fetchWorkoutDaysAndExercises();
//     }, [workoutPlanId]);

//     return (
//         <div>
//             {workoutDays.map((day) => (
//                 <div key={day.id}>
//                     <h2>{day.name}</h2>
//                     {day.exercises.map((exercise) => (
//                         <div key={exercise.id}>
//                             <h3>{exercise.name}</h3>
//                             {/* Here you would render each exercise's sets */}
//                         </div>
//                     ))}
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default WorkoutDetails;
export { }