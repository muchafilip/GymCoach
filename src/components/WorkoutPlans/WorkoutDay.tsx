import React, { useEffect, useState } from 'react';
import { Exercise as ExerciseType } from '../../types';
import { WorkoutDay as WorkoutDayType } from '../../types';

import ExerciseComponent from '../../components/WorkoutPlans/Exercise';
import { fetchExercisesFromFirstDay } from '../../firebase/firebaseActions';


interface WorkoutDayProps {
    workoutDay: WorkoutDayType;
}

const WorkoutDay: React.FC<WorkoutDayProps> = ({ workoutDay }) => {
    return (
        <div>
            <h2>{workoutDay.name}</h2>
            {workoutDay.exercises.map((exercise, index) => (
                <ExerciseComponent key={index} exercise={exercise} />
            ))}
        </div>
    );
};

export default WorkoutDay;
