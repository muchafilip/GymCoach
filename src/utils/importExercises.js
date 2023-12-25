const admin = require('firebase-admin');
const serviceAccount = require('/Users/fm/Dev/firebaseServiseAccount/appConfig.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const barbellExercises = [
    // Legs
    { name: 'Barbell Bulgarian Split Squat', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Box Squat', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Step-Up', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Hack Squat Jump', primaryTarget: 'quads', secondaryTargets: ['glutes', 'hamstrings'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Walking Lunge', primaryTarget: 'quads', secondaryTargets: ['glutes', 'hamstrings'], defaultSets: 3, defaultReps: 10 },

    // Chest
    { name: 'Barbell Pullover', primaryTarget: 'chest', secondaryTargets: ['back'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Incline Press', primaryTarget: 'chest', secondaryTargets: ['shoulders'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Floor Press', primaryTarget: 'chest', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Bench Press', primaryTarget: 'chest', secondaryTargets: ['shoulders', 'triceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Close-grip Bench Press', primaryTarget: 'chest', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 10 },

    // Back
    { name: 'Barbell Bent-over Row', primaryTarget: 'back', secondaryTargets: ['biceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell T-Bar Row', primaryTarget: 'back', secondaryTargets: ['biceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Meadows Row', primaryTarget: 'back', secondaryTargets: ['traps', 'rear delts'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Snatch Grip High Pull', primaryTarget: 'back', secondaryTargets: ['traps', 'shoulders'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Pendlay Row', primaryTarget: 'back', secondaryTargets: ['biceps'], defaultSets: 3, defaultReps: 10 },

    // Shoulders
    { name: 'Barbell Standing Overhead Press', primaryTarget: 'shoulders', secondaryTargets: [], defaultSets: 3, defaultReps: 12 },
    { name: 'Barbell Face Pull', primaryTarget: 'shoulders', secondaryTargets: ['traps', 'rear delts'], defaultSets: 3, defaultReps: 12 },
    { name: 'Barbell Push Press', primaryTarget: 'shoulders', secondaryTargets: ['triceps', 'upper chest'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Sitting Overhead Press', primaryTarget: 'shoulders', secondaryTargets: ['rotator cuffs', 'traps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Z Press', primaryTarget: 'shoulders', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 10 },

    // Triceps
    { name: 'Barbell Skull Crushers', primaryTarget: 'triceps', secondaryTargets: ['chest'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Tricep Extension', primaryTarget: 'triceps', secondaryTargets: ['shoulders'], defaultSets: 3, defaultReps: 10 },

    // Biceps
    { name: 'Barbell Preacher Curl', primaryTarget: 'biceps', secondaryTargets: ['forearms'], defaultSets: 3, defaultReps: 10 },
    { name: 'Barbell Spider Curl', primaryTarget: 'biceps', secondaryTargets: ['forearms'], defaultSets: 3, defaultReps: 10 },

    // Core
    { name: 'Barbell Russian Twist', primaryTarget: 'abs', secondaryTargets: ['obliques'], defaultSets: 3, defaultReps: 12 },
    { name: 'Barbell Landmine Twist', primaryTarget: 'abs', secondaryTargets: ['obliques'], defaultSets: 3, defaultReps: 12 },
];
const dumbbellExercises = [
    // Legs
    { name: 'Dumbbell Goblet Squat', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Lunges', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Bulgarian Split Squat', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Step-Ups', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Deadlift', primaryTarget: 'hamstrings', secondaryTargets: ['lower back', 'glutes'], defaultSets: 3, defaultReps: 10 },

    // Chest
    { name: 'Dumbbell Bench Press', primaryTarget: 'chest', secondaryTargets: ['shoulders', 'triceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Flyes', primaryTarget: 'chest', secondaryTargets: ['shoulders'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Incline Press', primaryTarget: 'chest', secondaryTargets: ['shoulders', 'triceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Decline Press', primaryTarget: 'chest', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Pullover', primaryTarget: 'chest', secondaryTargets: ['back'], defaultSets: 3, defaultReps: 10 },

    // Shoulders
    { name: 'Dumbbell Shoulder Press', primaryTarget: 'shoulders', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Lateral Raise', primaryTarget: 'shoulders', secondaryTargets: ['traps'], defaultSets: 3, defaultReps: 12 },
    { name: 'Dumbbell Front Raise', primaryTarget: 'shoulders', secondaryTargets: ['traps'], defaultSets: 3, defaultReps: 12 },
    { name: 'Dumbbell Shrugs', primaryTarget: 'traps', secondaryTargets: [], defaultSets: 3, defaultReps: 12 },

    // Back
    { name: 'Dumbbell Bent Over Rows', primaryTarget: 'back', secondaryTargets: ['biceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Deadlift Rows', primaryTarget: 'back', secondaryTargets: ['biceps', 'lower back'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Single-Arm Rows', primaryTarget: 'back', secondaryTargets: ['biceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Face Pulls', primaryTarget: 'back', secondaryTargets: ['rear delts'], defaultSets: 3, defaultReps: 12 },
    { name: 'Dumbbell Renegade Rows', primaryTarget: 'back', secondaryTargets: ['core'], defaultSets: 3, defaultReps: 10 },

    // Triceps
    { name: 'Dumbbell Tricep Extensions', primaryTarget: 'triceps', secondaryTargets: ['shoulders'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Skull Crushers', primaryTarget: 'triceps', secondaryTargets: ['chest'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Kickbacks', primaryTarget: 'triceps', secondaryTargets: [], defaultSets: 3, defaultReps: 10 },

    // Biceps
    { name: 'Dumbbell Bicep Curls', primaryTarget: 'biceps', secondaryTargets: ['forearms'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dumbbell Hammer Curls', primaryTarget: 'biceps', secondaryTargets: ['forearms'], defaultSets: 3, defaultReps: 10 },

    // Core
    { name: 'Dumbbell Russian Twists', primaryTarget: 'abs', secondaryTargets: ['obliques'], defaultSets: 3, defaultReps: 12 },
    { name: 'Dumbbell Woodchoppers', primaryTarget: 'abs', secondaryTargets: ['obliques'], defaultSets: 3, defaultReps: 10 },
];
const kettlebellExercises = [
    // Legs
    { name: 'Kettlebell Goblet Squat', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
    { name: 'Kettlebell Lunges', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
    { name: 'Kettlebell Bulgarian Split Squat', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
    { name: 'Kettlebell Step-Ups', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
    { name: 'Kettlebell Sumo Deadlift', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
    { name: 'Kettlebell Swing', primaryTarget: 'hamstrings', secondaryTargets: ['glutes', 'lower back'], defaultSets: 3, defaultReps: 15 },

    // Chest
    { name: 'Kettlebell Floor Press', primaryTarget: 'chest', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Kettlebell Push-Ups', primaryTarget: 'chest', secondaryTargets: ['shoulders', 'triceps'], defaultSets: 3, defaultReps: 12 },
    { name: 'Kettlebell Flyes', primaryTarget: 'chest', secondaryTargets: ['shoulders'], defaultSets: 3, defaultReps: 10 },
    { name: 'Kettlebell Turkish Get-Up', primaryTarget: 'chest', secondaryTargets: ['shoulders', 'triceps'], defaultSets: 3, defaultReps: 6 },

    // Shoulders
    { name: 'Kettlebell Military Press', primaryTarget: 'shoulders', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Kettlebell Lateral Raise', primaryTarget: 'shoulders', secondaryTargets: ['traps'], defaultSets: 3, defaultReps: 12 },
    { name: 'Kettlebell Upright Rows', primaryTarget: 'shoulders', secondaryTargets: ['traps', 'biceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Kettlebell Bottoms-Up Press', primaryTarget: 'shoulders', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 8 },

    // Triceps
    { name: 'Kettlebell Tricep Extensions', primaryTarget: 'triceps', secondaryTargets: ['shoulders'], defaultSets: 3, defaultReps: 10 },
    { name: 'Kettlebell Skull Crushers', primaryTarget: 'triceps', secondaryTargets: ['chest', 'shoulders'], defaultSets: 3, defaultReps: 10 },
    { name: 'Kettlebell Close Grip Push-Ups', primaryTarget: 'triceps', secondaryTargets: ['chest', 'shoulders'], defaultSets: 3, defaultReps: 12 },

    // Back
    { name: 'Kettlebell Rows', primaryTarget: 'back', secondaryTargets: ['biceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Kettlebell Deadlift', primaryTarget: 'back', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },
    { name: 'Kettlebell Bent Over Rows', primaryTarget: 'back', secondaryTargets: ['biceps'], defaultSets: 3, defaultReps: 10 },

    // Abs
    { name: 'Kettlebell Russian Twists', primaryTarget: 'abs', secondaryTargets: ['obliques'], defaultSets: 3, defaultReps: 12 },
    { name: 'Kettlebell Windmills', primaryTarget: 'abs', secondaryTargets: ['obliques'], defaultSets: 3, defaultReps: 8 },
    { name: 'Kettlebell Planks', primaryTarget: 'abs', secondaryTargets: ['core'], defaultSets: 3, defaultReps: 30 },
    { name: 'Kettlebell Sit-Ups', primaryTarget: 'abs', secondaryTargets: ['hip flexors'], defaultSets: 3, defaultReps: 15 },
];
const bodyweightExercises = [
    // Legs
    { name: 'Bodyweight Squats', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 12 },
    { name: 'Lunges', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 12 },
    { name: 'Pistol Squats', primaryTarget: 'quads', secondaryTargets: ['hamstrings', 'glutes'], defaultSets: 3, defaultReps: 10 },

    // Chest
    { name: 'Push-Ups', primaryTarget: 'chest', secondaryTargets: ['shoulders', 'triceps'], defaultSets: 3, defaultReps: 12 },
    { name: 'Wide Grip Push-Ups', primaryTarget: 'chest', secondaryTargets: ['shoulders', 'triceps'], defaultSets: 3, defaultReps: 12 },
    { name: 'Diamond Push-Ups', primaryTarget: 'chest', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 12 },

    // Shoulders
    { name: 'Pike Push-Ups', primaryTarget: 'shoulders', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 12 },
    { name: 'Handstand Push-Ups', primaryTarget: 'shoulders', secondaryTargets: ['triceps'], defaultSets: 3, defaultReps: 10 },
    { name: 'Dips', primaryTarget: 'shoulders', secondaryTargets: ['chest', 'triceps'], defaultSets: 3, defaultReps: 12 },

    // Triceps
    { name: 'Tricep Dips', primaryTarget: 'triceps', secondaryTargets: ['chest', 'shoulders'], defaultSets: 3, defaultReps: 12 },
    { name: 'Bench Dips', primaryTarget: 'triceps', secondaryTargets: ['chest', 'shoulders'], defaultSets: 3, defaultReps: 12 },
    { name: 'Close Grip Push-Ups', primaryTarget: 'triceps', secondaryTargets: ['chest', 'shoulders'], defaultSets: 3, defaultReps: 12 },

    // Abs
    { name: 'Crunches', primaryTarget: 'abs', secondaryTargets: ['obliques'], defaultSets: 3, defaultReps: 15 },
    { name: 'Leg Raises', primaryTarget: 'abs', secondaryTargets: ['hip flexors'], defaultSets: 3, defaultReps: 12 },
    { name: 'Planks', primaryTarget: 'abs', secondaryTargets: ['core'], defaultSets: 3, defaultReps: 30 },
];

async function uploadExercises(collectionName, exercises) {
    const collectionRef = db.collection(collectionName);

    const promises = exercises.map(exercise => {
        return collectionRef.add(exercise)
            .then(docRef => console.log(`Document written with ID: ${docRef.id}`))
            .catch(error => console.error('Error adding document: ', error));
    });

    await Promise.all(promises);
    console.log('All exercises have been uploaded.');
}

uploadExercises('bodyweightExercises', bodyweightExercises).catch(console.error);




