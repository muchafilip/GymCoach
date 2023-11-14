import React from 'react';
import { addWorkoutPlan } from '../firebase/firebaseActions';
import { WorkoutPlan } from '../types'; // Import the WorkoutPlan type

const AddWorkout: React.FC = () => {
    // Sample workout plan data
    const sampleWorkoutPlan: WorkoutPlan = {
        id: '1', // This should be unique for each plan
        title: '1413 Plan',
        workoutDays: [
            {
                name: "day1",
                exercises: [{ name: "squat", description: "test", sets: [{ weight: 100, reps: 8 }, { weight: 100, reps: 8 }, { weight: 100, reps: 8 }] },
                { name: "bench press", description: "test", sets: [{ weight: 80, reps: 8 }, { weight: 90, reps: 8 }, { weight: 100, reps: 8 }] }
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
