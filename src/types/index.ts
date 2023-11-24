export interface ExerciseSet {
    id: string;
    setNumber: number;
    targetReps: number;
    weight: string; // Assuming weight is a string to include units like 'kg' or 'lbs'
    repsCompleted: number | null;
    completed: boolean;
}

export interface Exercise {
    id: string;
    name: string;
    description: string;
    sets: ExerciseSet[];
    completed?: boolean;
}

export interface WorkoutDay {
    id: string;
    name: string;
    exercises: Exercise[];
}

export interface WorkoutPlan {
    title: string;
    workoutDays: WorkoutDay[];
}
export interface FetchedWorkoutPlan extends WorkoutPlan {
    id: string;
}
export interface ExerciseCategory {
    availableEquipment: string;
    targetBodyPart: string;
    suggestedExcercises: Exercise[];
}
