const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.generateNewWorkoutDay = functions.firestore
    .document('users/{userId}')
    .onUpdate(async (change, context) => {
        const previousData = change.before.data();
        const newData = change.after.data();

        // Trigger only when previousCurrentDayId is updated
        if (!newData.previousCurrentDayId || newData.previousCurrentDayId === previousData.previousCurrentDayId) {
            functions.logger.log('No change in previousCurrentDayId or no previousCurrentDayId set.');
            return null;
        }

        const completedWorkoutDayRef = admin.firestore().collection(`workoutPlans/${newData.subscribedWorkoutPlanId}/workoutDays`).doc(newData.previousCurrentDayId);
        const completedWorkoutDaySnapshot = await completedWorkoutDayRef.get();

        if (!completedWorkoutDaySnapshot.exists) {
            functions.logger.log(`Completed workout day not found: ID ${newData.previousCurrentDayId}`);
            return null;
        }

        const completedWorkoutDay = completedWorkoutDaySnapshot.data();
        functions.logger.log(`Completed Workout Day: ${JSON.stringify(completedWorkoutDay)}`);

        // Fetch exercises from the subcollection
        const exercisesSnapshot = await completedWorkoutDayRef.collection('exercises').get();
        const exercisesData = await Promise.all(exercisesSnapshot.docs.map(async (exerciseDoc) => {
            const exerciseData = exerciseDoc.data();
            const setsSnapshot = await exerciseDoc.ref.collection('sets').get();
            const setsData = setsSnapshot.docs.map(setDoc => setDoc.data()).map(set => ({
                ...set,
                targetReps: set.targetReps === set.repsCompleted ? set.targetReps + 1 : set.targetReps,
                repsCompleted: null,
                completed: false
            }));
            return {
                ...exerciseData,
                sets: setsData
            };
        }));

        // Generate new workout day name
        const workoutDaysCollectionRef = admin.firestore().collection(`workoutPlans/${newData.subscribedWorkoutPlanId}/workoutDays`);
        const allDaysSnapshot = await workoutDaysCollectionRef.get();
        const newDayNumber = allDaysSnapshot.docs.length + 1;
        const newWorkoutDayName = `Day ${newDayNumber} - ${completedWorkoutDay.name.split(' - ')[1]}`;

        // Create new workout day
        const newWorkoutDayRef = await workoutDaysCollectionRef.add({
            name: newWorkoutDayName,
            isCompleted: false
        });

        // Add exercises to the new day
        for (const exercise of exercisesData) {
            const exerciseRef = await newWorkoutDayRef.collection('exercises').add({
                name: exercise.name,
                description: exercise.description,
                isCompleted: false
            });

            // Add sets to the exercise
            for (const set of exercise.sets) {
                await exerciseRef.collection('sets').add(set);
            }
        }

        functions.logger.log(`New workout day created: ${newWorkoutDayName}, ID: ${newWorkoutDayRef.id}`);
        return null;
    });
