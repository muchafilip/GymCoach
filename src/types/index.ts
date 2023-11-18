export interface Set {
    weight: number;
    reps: number;
}

export interface Exercise {
    name: string;
    description: string;
    sets: Set[];
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