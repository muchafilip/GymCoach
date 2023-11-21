export interface ExerciseSet {
    setNumber: number;
    targetReps: number;
    weight: string; // Assuming weight is a string to include units like 'kg' or 'lbs'
    repsCompleted: number | null;
    completed: boolean;
}

export interface Exercise {
    name: string;
    description: string;
    sets: ExerciseSet[];
}

export interface WorkoutDay {
    name: string;
    exercises: Exercise[];
}

export interface WorkoutPlan {
    id: string;
    title: string;
    workoutDays: WorkoutDay[];
}

export interface ExerciseCategory {
    availableEquipment: string;
    targetBodyPart: string;
    suggestedExcercises: Exercise[];
}