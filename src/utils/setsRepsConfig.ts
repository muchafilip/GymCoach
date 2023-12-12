// Define an interface for the exercise configuration
interface ExerciseConfig {
    numberOfSets: number;
    targetRepsPerSet: number;
}

// A dictionary for specific exercise configurations
const exerciseConfigs: Record<string, ExerciseConfig> = {
    'chest': { numberOfSets: 4, targetRepsPerSet: 10 },
    'back': { numberOfSets: 3, targetRepsPerSet: 12 },
};

const defaultConfig: ExerciseConfig = { numberOfSets: 3, targetRepsPerSet: 12 };

// Function to get the configuration for an exercise
export const getSetsRepsConfig = (exerciseName: string): ExerciseConfig => {
    return exerciseConfigs[exerciseName] || defaultConfig;
};