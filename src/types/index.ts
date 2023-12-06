export interface UserType {
    email?: string;
    subscribedWorkoutPlanId?: string;
    currentWorkoutDayId?: string;
}

export interface ExerciseSet {
    id?: string;
    setNumber: number;
    targetReps: number;
    weight: string;
    repsCompleted: number | null;
    completed: boolean;
    isUserAdded?: boolean;
}

export interface Exercise {
    id: string;
    name: string;
    description: string;
    sets: ExerciseSet[];
    isCompleted?: boolean;
}

export interface WorkoutDay {
    id: string;
    name: string;
    exercises: Exercise[];
    isCompleted: boolean;
}

export interface WorkoutPlan {
    id?: string;
    title: string;
    workoutDays: WorkoutDay[];
    userId?: string;
    dateCreated: Date;
}




