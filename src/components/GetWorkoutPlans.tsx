import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { WorkoutPlan as WorkoutPlanType } from '../types';
import '../WorkoutPlan.css'; // Import the CSS file

const WorkoutPlans: React.FC = () => {
    const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlanType[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, 'workoutPlans'), (querySnapshot) => {
            const plans: WorkoutPlanType[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }) as WorkoutPlanType);
            setWorkoutPlans(plans);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="workout-plans-container">
            <h2 className="workout-plans-title">Workout Plans</h2>
            {workoutPlans.map(plan => (
                <div key={plan.id} className="workout-plan">
                    <h3 className="plan-title">{plan.title}</h3>
                    {plan.workoutDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="workout-day">
                            <h4 className="day-name">{day.name}</h4>
                            {day.exercises.map((exercise, exerciseIndex) => (
                                <div key={exerciseIndex} className="exercise">
                                    <strong className="exercise-name">{exercise.name}</strong>
                                    <p className="exercise-description">{exercise.description}</p>
                                    <ul className="exercise-sets">
                                        {exercise.sets.map((set, setIndex) => (
                                            <li key={setIndex} className="set-details">
                                                {set.reps} reps at {set.weight} lbs
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default WorkoutPlans;
