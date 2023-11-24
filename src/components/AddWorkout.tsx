import React from 'react';
import { addWorkoutPlan } from '../firebase/firebaseActions';
import { WorkoutPlan } from '../types'; // Import the WorkoutPlan type

const AddWorkout: React.FC = () => {
    // Sample workout plan data
    const sampleWorkoutPlan: WorkoutPlan = {
        title: '22222 Plan',
        workoutDays: [
            {
                name: "day1",
                exercises: [
                    { name: "squat", description: "test", sets: [{ setNumber: 1, weight: "100", targetReps: 8, repsCompleted: null, completed: false }, { setNumber: 2, weight: "100", targetReps: 8, repsCompleted: null, completed: false }] },
                    { name: "bench press", description: "test", sets: [{ setNumber: 1, weight: "100", targetReps: 8, repsCompleted: null, completed: false }] },
                    { name: "deadlift", description: "test", sets: [{ setNumber: 1, weight: "100", targetReps: 8, repsCompleted: null, completed: false }, { setNumber: 2, weight: "100", targetReps: 8, repsCompleted: null, completed: false }] },

                ]
            },
            {
                name: "day2",
                exercises: [
                    { name: "pullup", description: "test", sets: [{ setNumber: 1, weight: "100", targetReps: 8, repsCompleted: null, completed: false }, { setNumber: 2, weight: "100", targetReps: 8, repsCompleted: null, completed: false }] },
                    { name: "curl", description: "test", sets: [{ setNumber: 1, weight: "100", targetReps: 8, repsCompleted: null, completed: false }] },
                    { name: "pushup", description: "test", sets: [{ setNumber: 1, weight: "100", targetReps: 8, repsCompleted: null, completed: false }, { setNumber: 2, weight: "100", targetReps: 8, repsCompleted: null, completed: false }] },

                ]
            }
        ]
    };

    const handleAddWorkoutPlan = () => {
        addWorkoutPlan(sampleWorkoutPlan);
    };

    return (
        <div>
            <h1>Add New Workout Plan</h1>
            <button onClick={handleAddWorkoutPlan}>Add Workout Plan</button>
        </div>
    );
};

export default AddWorkout;
