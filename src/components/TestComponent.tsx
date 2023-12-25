import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { writeBatch, doc, collection } from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { templates } from './templates';
import EquipmentSelectionComponent from './EquipmentSelectionComponent';

const barbellExercises = [
  { name: 'Barbell Bench Press', primaryTarget: 'chest', secondaryTargets: ['shoulders'], defaultSets: 2, defaultReps: 10 },
  { name: 'Barbell Row', primaryTarget: 'back', secondaryTargets: ['biceps'], defaultSets: 4, defaultReps: 10 },
  { name: 'Barbell Squat', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'calves'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Deadlift', primaryTarget: 'hamstrings', secondaryTargets: ['back', 'glutes'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Calf Raise', primaryTarget: 'calves', secondaryTargets: [], defaultSets: 3, defaultReps: 12 },
  { name: 'Barbell Curl', primaryTarget: 'biceps', secondaryTargets: [], defaultSets: 3, defaultReps: 10 },
  { name: 'Overhead Barbell Press', primaryTarget: 'shoulders', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Front Squat', primaryTarget: 'quads', secondaryTargets: ['glutes'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Lunges', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 12 },
  { name: 'Barbell Hip Thrust', primaryTarget: 'glutes', secondaryTargets: ['hamstrings'], defaultSets: 3, defaultReps: 12 },
  { name: 'Good Mornings', primaryTarget: 'lower back', secondaryTargets: ['hamstrings'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Shrug', primaryTarget: 'trapezius', secondaryTargets: [], defaultSets: 3, defaultReps: 12 },
  { name: 'Barbell Upright Row', primaryTarget: 'shoulders', secondaryTargets: ['trapezius'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Bent Over Row', primaryTarget: 'back', secondaryTargets: ['biceps'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Push Press', primaryTarget: 'shoulders', secondaryTargets: ['triceps', 'legs'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Romanian Deadlift', primaryTarget: 'hamstrings', secondaryTargets: ['glutes', 'lower back'], defaultSets: 3, defaultReps: 12 },
  { name: 'Barbell Overhead Squat', primaryTarget: 'quads', secondaryTargets: ['shoulders', 'back'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Sumo Deadlift', primaryTarget: 'glutes', secondaryTargets: ['quads', 'hamstrings'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Hack Squat', primaryTarget: 'quads', secondaryTargets: ['glutes'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Incline Bench Press', primaryTarget: 'chest', secondaryTargets: ['shoulders'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Decline Bench Press', primaryTarget: 'chest', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Close Grip Bench Press', primaryTarget: 'triceps', secondaryTargets: ['chest'], defaultSets: 3, defaultReps: 10 },
  { name: 'Barbell Reverse Curl', primaryTarget: 'biceps', secondaryTargets: ['forearms'], defaultSets: 3, defaultReps: 12 },
  { name: 'Barbell Wrist Curl', primaryTarget: 'forearms', secondaryTargets: [], defaultSets: 3, defaultReps: 15 },
  { name: 'Barbell Ab Rollout', primaryTarget: 'abs', secondaryTargets: ['lower back'], defaultSets: 3, defaultReps: 10 }
];

const dumbbellExercises = [
  { name: 'Incline Dumbbell Bench Press', primaryTarget: 'chest', secondaryTargets: ['triceps', 'shoulders'], defaultSets: 3, defaultReps: 12 },
  { name: 'Dumbbell Skull Crushers', primaryTarget: 'triceps', secondaryTargets: [], defaultSets: 3, defaultReps: 15 },
  { name: 'Dumbbell Tricep Kickback', primaryTarget: 'triceps', secondaryTargets: [], defaultSets: 3, defaultReps: 12 },
  { name: 'Dumbbell Row', primaryTarget: 'back', secondaryTargets: ['biceps'], defaultSets: 3, defaultReps: 10 },
  { name: 'Dumbbell Lunges', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
  { name: 'Dumbbell Hamstring Curl', primaryTarget: 'hamstrings', secondaryTargets: [], defaultSets: 3, defaultReps: 12 },
  { name: 'Dumbbell Calf Raise', primaryTarget: 'calves', secondaryTargets: [], defaultSets: 3, defaultReps: 15 },
  { name: 'Dumbbell Curl', primaryTarget: 'biceps', secondaryTargets: [], defaultSets: 3, defaultReps: 10 },
  { name: 'Dumbbell Crunch', primaryTarget: 'abs', secondaryTargets: [], defaultSets: 3, defaultReps: 15 },
  { name: 'Dumbbell Flyes', primaryTarget: 'chest', secondaryTargets: [], defaultSets: 3, defaultReps: 12 },
  { name: 'Dumbbell Shoulder Press', primaryTarget: 'shoulders', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 10 },
  { name: 'Dumbbell Side Lateral Raise', primaryTarget: 'shoulders', secondaryTargets: [], defaultSets: 3, defaultReps: 15 },
  { name: 'Dumbbell Rear Delt Fly', primaryTarget: 'shoulders', secondaryTargets: ['upper back'], defaultSets: 3, defaultReps: 12 },
  { name: 'Dumbbell Bent Over Row', primaryTarget: 'back', secondaryTargets: ['biceps'], defaultSets: 3, defaultReps: 10 },
  { name: 'Dumbbell Pullover', primaryTarget: 'chest', secondaryTargets: ['back'], defaultSets: 3, defaultReps: 12 },
  { name: 'Dumbbell Bulgarian Split Squat', primaryTarget: 'quads', secondaryTargets: ['glutes', 'hamstrings'], defaultSets: 3, defaultReps: 10 },
  { name: 'Dumbbell Step-Up', primaryTarget: 'quads', secondaryTargets: ['glutes', 'hamstrings'], defaultSets: 3, defaultReps: 12 },
  { name: 'Dumbbell Stiff Leg Deadlift', primaryTarget: 'hamstrings', secondaryTargets: ['glutes', 'lower back'], defaultSets: 3, defaultReps: 10 },
  { name: 'Dumbbell Shrug', primaryTarget: 'trapezius', secondaryTargets: [], defaultSets: 3, defaultReps: 12 },
  { name: 'Dumbbell Hammer Curl', primaryTarget: 'biceps', secondaryTargets: ['forearms'], defaultSets: 3, defaultReps: 10 },
  { name: 'Dumbbell Concentration Curl', primaryTarget: 'biceps', secondaryTargets: [], defaultSets: 3, defaultReps: 12 },
  { name: 'Dumbbell Wrist Curl', primaryTarget: 'forearms', secondaryTargets: [], defaultSets: 3, defaultReps: 15 },
  { name: 'Dumbbell Leg Raise', primaryTarget: 'abs', secondaryTargets: ['hip flexors'], defaultSets: 3, defaultReps: 15 },
  { name: 'Dumbbell Russian Twist', primaryTarget: 'abs', secondaryTargets: ['obliques'], defaultSets: 3, defaultReps: 12 }
];



type Exercise = {
  name: string;
  primaryTarget: string;
  secondaryTargets: string[];
  defaultSets: number;
  defaultReps: number;
  sets?: ExerciseSet[]; // Assuming SetType is the type for your sets, add it if necessary
};

type ExerciseSet = {
  id?: string;
  setNumber: number;
  targetReps: number;
  weight: string;
  repsCompleted: number | null;
  isCompleted: boolean;
  isUserAdded?: boolean;
}


type WorkoutPlan = {
  name: string;
  daysPerWeek: number;
  days: WorkoutPlanDay[];
};

type WorkoutPlanDay = {
  name: string;
  bodyparts: {
    name: string;
    exercises: Exercise[];
    selectedExercise: Exercise;
  }[];
};


async function fetchExercisesForEquipment(equipmentList: string[]): Promise<Exercise[]> {
  let availableExercises: Exercise[] = [];

  if (equipmentList.includes('barbell')) {
    availableExercises.push(...barbellExercises);
  }
  if (equipmentList.includes('dumbbell')) {
    availableExercises.push(...dumbbellExercises);
  }

  return availableExercises;
}

interface MyProps {
  currentUser: User | null;
}

const Test: React.FC<MyProps> = ({ currentUser }) => {

  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].name);

  function createSetsForExercise(defaultSets: any, defaultReps: any) {
    return Array.from({ length: defaultSets }, (_, index) => ({
      setNumber: index + 1,
      weight: '', // Default weight to empty string or another default value
      targetReps: defaultReps,
      isCompleted: false, // Default isCompleted to false
      completedReps: 0
      // Add other default properties for a set if needed
    }));
  }
  async function saveWorkoutPlanToFirestore(plan: WorkoutPlan, currentDate: Date) {
    try {
      const batch = writeBatch(firestore);
      const uid = currentUser?.uid;
      const workoutPlanDocRef = doc(collection(firestore, 'workoutPlans'));

      batch.set(workoutPlanDocRef, {
        title: plan.name,
        userId: uid,
        dateCreated: currentDate.toISOString(),
        daysPerWeek: plan.daysPerWeek
      });

      plan.days.forEach((day, dayIndex) => {
        const dayDocRef = doc(collection(firestore, `workoutPlans/${workoutPlanDocRef.id}/workoutDays`));
        batch.set(dayDocRef, { name: `Day ${dayIndex + 1} - ${day.name}`, isCompleted: false });

        day.bodyparts.forEach(bodypart => {
          const selectedExercise = bodypart.selectedExercise;
          const exerciseDocRef = doc(collection(firestore, `workoutPlans/${workoutPlanDocRef.id}/workoutDays/${dayDocRef.id}/exercises`));

          batch.set(exerciseDocRef, {
            name: selectedExercise.name,
            primaryTarget: selectedExercise.primaryTarget,
            secondaryTargets: selectedExercise.secondaryTargets,
            defaultSets: selectedExercise.defaultSets,
            defaultReps: selectedExercise.defaultReps
          });

          // Create sets for the exercise
          const sets = createSetsForExercise(selectedExercise.defaultSets, selectedExercise.defaultReps);

          // Save each set to the sets subcollection
          sets.forEach(set => {
            const setDocRef = collection(firestore, `workoutPlans/${workoutPlanDocRef.id}/workoutDays/${dayDocRef.id}/exercises/${exerciseDocRef.id}/sets`);
            batch.set(doc(setDocRef), {
              setNumber: set.setNumber,
              weight: set.weight,
              targetReps: set.targetReps,
              isCompleted: set.isCompleted,
              repsCompleted: set.completedReps || null
            });
          });
        });
      });

      await batch.commit();
      console.log('Workout plan saved successfully.');
    } catch (error) {
      console.error('Error saving workout plan:', error);
    }
  }

  // Adapter function to convert templates to the new format
  // Assuming fetchExercisesForEquipment is already an async function that returns a Promise<Exercise[]>

  const adaptTemplate = async (template: any): Promise<WorkoutPlan> => {
    const allExercises = await fetchExercisesForEquipment(['barbell', 'dumbbell']); // Await the exercises

    const adaptedDays = template.days.map((day: any) => ({
      name: day.name,
      bodyparts: day.bodyparts.map((bodypartName: string) => {
        const exercisesForBodyPart = allExercises.filter((exercise: Exercise) =>
          exercise.primaryTarget === bodypartName || exercise.secondaryTargets.includes(bodypartName)
        );
        // Assume the first exercise is the default selected exercise
        const selectedExercise = exercisesForBodyPart[0];
        return {
          name: bodypartName,
          exercises: exercisesForBodyPart,
          selectedExercise: selectedExercise
        };
      })
    }));

    return { ...template, days: adaptedDays };
  };

  // Usage within handleGeneratePlan
  const handleGeneratePlan = async () => {
    if (!currentUser) {
      console.error('No user data available');
      return;
    }
    const template = templates.find(t => t.name === selectedTemplateId);
    if (!template) {
      console.error('Selected template not found');
      return;
    }

    // Adapt the template to include exercises
    const adaptedTemplate = await adaptTemplate(template);
    setWorkoutPlan(adaptedTemplate);
  };

  const handleSavePlan = async () => {
    if (!workoutPlan) {
      console.error('No workout plan to save');
      return;
    }

    try {
      const date = new Date();
      await saveWorkoutPlanToFirestore(workoutPlan, date);
    } catch (error) {
      console.error('Error saving workout plan:', error);
    }
  };

  const handleExerciseChange = (
    dayIndex: number,
    bodyPartIndex: number,
    selectedExerciseName: string
  ) => {
    setWorkoutPlan((currentPlan: WorkoutPlan | null) => {
      if (currentPlan === null) return null;

      // Deep copy to avoid directly mutating the state
      const newPlan: WorkoutPlan = JSON.parse(JSON.stringify(currentPlan));

      // Finding the new selected exercise
      const bodyPartExercises = newPlan.days[dayIndex].bodyparts[bodyPartIndex].exercises;
      const selectedExercise = bodyPartExercises.find(
        (exercise) => exercise.name === selectedExerciseName
      );

      if (selectedExercise) {
        newPlan.days[dayIndex].bodyparts[bodyPartIndex].selectedExercise = selectedExercise;
      }

      return newPlan;
    });
  };

  const renderTable = () => {
    if (!workoutPlan) {
      return null;
    }

    return (
      <div>
        {workoutPlan.days.map((day, dayIndex) => (
          <div key={day.name}>
            <h3>{day.name}</h3>
            {day.bodyparts.map((bodypart, bodyPartIndex) => (
              <div key={`${day.name}-${bodypart.name}`}>
                <label>{bodypart.name}: </label>
                <select
                  value={bodypart.selectedExercise.name}
                  onChange={(e) => handleExerciseChange(dayIndex, bodyPartIndex, e.target.value)}
                >
                  {bodypart.exercises.map((exercise) => (
                    <option key={exercise.name} value={exercise.name}>
                      {exercise.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div>
        <EquipmentSelectionComponent onGeneratePlan={handleGeneratePlan} />
      </div>
      <label>Select a Workout Plan Template: </label>
      <select value={selectedTemplateId} onChange={e => setSelectedTemplateId(e.target.value)}>
        {templates.map(template => (
          <option key={template.name} value={template.name}>{template.name}</option>
        ))}
      </select>
      <button onClick={handleGeneratePlan}>Generate Workout Plan</button>
      {workoutPlan && (
        <>
          <div>
            <h3>Workout Plan: {workoutPlan.name}</h3>
            {renderTable()}
          </div>
          <button onClick={handleSavePlan}>Save Workout Plan to Firestore</button>
        </>
      )}
    </div>
  );
}
export default Test;



// async function generateWorkoutPlan(userId: string, planTemplate: WorkoutPlan): Promise<WorkoutPlan> {
//   const equipment = await fetchUserEquipment(userId);
//   const exercises = await fetchExercisesForEquipment(equipment);

//   // Clone the planTemplate to avoid mutating the original
//   let newPlan = JSON.parse(JSON.stringify(planTemplate));

//   for (let day of newPlan.days) {
//     let usedExercises: Set<string> = new Set(); // Track used exercises for the day
//     day.isCompleted = false;
//     for (let i = 0; i < day.bodyparts.length; i++) {
//       const bodypart = day.bodyparts[i];
//       // Find a matching exercise for the bodypart that hasn't been used yet
//       const matchingExercise = exercises.find(exercise =>
//         (exercise.primaryTarget === bodypart || exercise.secondaryTargets.includes(bodypart)) &&
//         !usedExercises.has(exercise.name)
//       );

//       if (matchingExercise) {
//         usedExercises.add(matchingExercise.name); // Mark this exercise as used for the day
//         // Replace bodypart with the exercise and add sets
//         day.bodyparts[i] = {
//           ...matchingExercise,
//           isCompleted: false,
//           sets: Array.from({ length: matchingExercise.defaultSets }, (_, index) => ({
//             setNumber: index + 1,
//             weight: '',
//             reps: matchingExercise.defaultReps,
//             isCompleted: false
//           }))
//         };
//       }
//     }
//   }

//   return newPlan;
// }