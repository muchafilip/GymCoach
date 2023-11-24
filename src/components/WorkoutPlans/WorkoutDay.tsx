import React, { useEffect, useState } from 'react';
import { Exercise as ExerciseType } from '../../types';
import { WorkoutDay as WorkoutDayType } from '../../types';

import ExerciseComponent from '../../components/WorkoutPlans/Exercise';
import { fetchExercisesFromFirstDay } from '../../firebase/firebaseActions';


interface WorkoutDayProps {
    workoutDay: WorkoutDayType;
    workoutPlanId: string; // Add this
    dayIndex: number;      // Add this
}

const WorkoutDay: React.FC<WorkoutDayProps> = ({ workoutDay, workoutPlanId, dayIndex }) => {
    return (
        <div>
            <h2>{workoutDay.name}</h2>
            {workoutDay.exercises.map((exercise, exerciseIndex) => (
                <ExerciseComponent
                    key={exerciseIndex}
                    exercise={exercise}
                    workoutPlanId={workoutPlanId}
                    dayIndex={dayIndex}
                    exerciseIndex={exerciseIndex} // Pass the index of the exercise
                />
            ))}
        </div>
    );
};

export default WorkoutDay;