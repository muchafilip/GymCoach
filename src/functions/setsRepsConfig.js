const admin = require('firebase-admin');
const serviceAccount = require('/Users/fm/Dev/firebaseServiseAccount/appConfig.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // other config if necessary
});

// Firebase Admin SDK initialization
const db = admin.firestore();

/**
 * Adds an array of exercises to a specified Firestore collection.
 * @param exercises Array of exercises.
 * @param collectionName Name of the Firestore collection to add to.
 */
async function addExercisesToFirestore(exercises, collectionName) {
    const batch = db.batch();

    exercises.forEach(exercise => {
        const docRef = db.collection(collectionName).doc();
        batch.set(docRef, exercise);
    });

    try {
        await batch.commit();
        console.log(`Exercises added to ${collectionName} in Firestore successfully!`);
    } catch (error) {
        console.error(`Error adding exercises to ${collectionName} in Firestore:`, error);
    }
}

// Example usage:
// Import your exercises arrays from separate files or define them here
const barbellExercises = [
    { name: "Barbell Bench Press", primaryTarget: "quads", secondaryTargets: ['hamstrings'], sets: 5, reps: 5 },
    { name: "Barbell Front Squat", primaryTarget: "quads", secondaryTargets: ['hamstrings'], sets: 6, reps: 6 },
    { name: "Barbell Zercher Squat", primaryTarget: "quads", secondaryTargets: ['hamstrings', 'abductors', 'biceps'], sets: 4, reps: 8 }
]
// const kettlebellExercises = [{name: "Kettlebell Swing", primaryTarget: "back", ...}, ...];
// ...

// Call the function for each equipment type
addExercisesToFirestore(barbellExercises, 'barbellExercises');
// addExercisesToFirestore(kettlebellExercises, 'kettlebellExercises');
// ...
