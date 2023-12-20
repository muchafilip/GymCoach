// components/HomePage.tsx
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
};

type WorkoutPlan = {
  name: string;
  daysPerWeek: number;
  days: {
    name: string;
    bodyparts: string[] | Exercise[];
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

async function fetchUserEquipment(userId: string): Promise<string[]> {
  return ['barbell'];
}

async function generateWorkoutPlan(userId: string, planTemplate: WorkoutPlan): Promise<WorkoutPlan> {
  const equipment = await fetchUserEquipment(userId);
  const exercises = await fetchExercisesForEquipment(equipment);

  // Clone the planTemplate to avoid mutating the original
  let newPlan = JSON.parse(JSON.stringify(planTemplate));

  for (let day of newPlan.days) {
    let usedExercises: Set<string> = new Set(); // Track used exercises for the day
    day.isCompleted = false;
    for (let i = 0; i < day.bodyparts.length; i++) {
      const bodypart = day.bodyparts[i];
      // Find a matching exercise for the bodypart that hasn't been used yet
      const matchingExercise = exercises.find(exercise =>
        (exercise.primaryTarget === bodypart || exercise.secondaryTargets.includes(bodypart)) &&
        !usedExercises.has(exercise.name)
      );

      if (matchingExercise) {
        usedExercises.add(matchingExercise.name); // Mark this exercise as used for the day
        // Replace bodypart with the exercise and add sets
        day.bodyparts[i] = {
          ...matchingExercise,
          isCompleted: false,
          sets: Array.from({ length: matchingExercise.defaultSets }, (_, index) => ({
            setNumber: index + 1,
            weight: '',
            reps: matchingExercise.defaultReps,
            isCompleted: false
          }))
        };
      }
    }
  }

  return newPlan;
}

interface MyProps {
  currentUser: User | null;
}

const Test: React.FC<MyProps> = ({ currentUser }) => {

  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].name);

  async function saveWorkoutPlanToFirestore(plan: WorkoutPlan, currentDate: Date) {
    try {
      const batch = writeBatch(firestore);
      const uid = currentUser?.uid
      // Create a reference for a new workout plan document with userId
      const workoutPlanDocRef = doc(collection(firestore, 'workoutPlans'));
      batch.set(workoutPlanDocRef, {
        title: plan.name,
        userId: uid,
        dateCreated: currentDate,
        daysPerWeek: plan.daysPerWeek
      });

      plan.days.forEach((day, dayIndex) => {
        console.log("Day object:", day);

        const dayName = `Day ${dayIndex + 1} - ${day.name}`;
        const dayDocRef = doc(collection(firestore, `workoutPlans/${workoutPlanDocRef.id}/workoutDays`));

        batch.set(dayDocRef, { name: dayName, isCompleted: false });

        day.bodyparts.forEach((exercise: any) => {
          console.log("Exercise object:", exercise);

          const exerciseDocRef = doc(collection(firestore, `workoutPlans/${workoutPlanDocRef.id}/workoutDays/${dayDocRef.id}/exercises`));
          batch.set(exerciseDocRef, {
            name: exercise.name,
            primaryTarget: exercise.primaryTarget,
            secondaryTargets: exercise.secondaryTargets,
            defaultSets: exercise.defaultSets,
            defaultReps: exercise.defaultReps
          });

          exercise.sets.forEach((set: any) => {
            console.log('set object', set)
            const setDocRef = doc(collection(firestore, `workoutPlans/${workoutPlanDocRef.id}/workoutDays/${dayDocRef.id}/exercises/${exerciseDocRef.id}/sets`));
            batch.set(setDocRef, {
              setNumber: set.setNumber,
              weight: set.weight,
              targetReps: set.reps,
              isCompleted: set.isCompleted
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
    const customizedPlan = await generateWorkoutPlan(currentUser.uid, template);
    setWorkoutPlan(customizedPlan);
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


  const renderTable = () => {
    if (!workoutPlan) {
      return null;
    }

    const maxExercises = Math.max(...workoutPlan.days.map(day => day.bodyparts.length));

    const rows = [];
    for (let i = 0; i < maxExercises; i++) {
      const row = workoutPlan.days.map(day => {
        const bodypart = day.bodyparts[i];
        let exerciseContent;

        if (typeof bodypart === 'string') {
          // If bodypart is a string, display it as is
          exerciseContent = bodypart;
        } else {
          // If bodypart is an Exercise object, display primaryTarget and name
          exerciseContent = `${bodypart.primaryTarget} - ${bodypart.name}`;
        }

        return <td key={day.name + i}>{exerciseContent}</td>;
      });
      rows.push(<tr key={'row' + i}>{row}</tr>);
    }

    return (
      <table>
        <thead>
          <tr>
            {workoutPlan.days.map(day => <th key={day.name}>{day.name}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
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



