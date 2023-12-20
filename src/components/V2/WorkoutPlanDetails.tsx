import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchData, fetchDocument } from './firebaseService';
import { WorkoutDay, WorkoutPlan } from '../../types';

const WorkoutPlanDetails = () => {
    const { planId } = useParams();
    const [workoutWeeks, setWorkoutWeeks] = useState<WorkoutDay[][]>([]);

    useEffect(() => {
        const fetchWorkoutDays = async () => {
            if (planId) {
                const days = await fetchData<WorkoutDay>(`workoutPlans/${planId}/workoutDays`);
                const sortedDays = days.sort((a, b) => {
                    const dayANumber = parseInt(a.name.match(/\d+/)?.[0] ?? '0');
                    const dayBNumber = parseInt(b.name.match(/\d+/)?.[0] ?? '0');
                    return dayANumber - dayBNumber;
                });
                // TODO change this to dynamic days, workoutPlan.daysPerWeek
                const fetchPlan = await fetchDocument<WorkoutPlan>(`workoutPlans/${planId}`);
                console.log(fetchPlan)
                const daysPerWeek = fetchPlan.daysPerWeek;
                const weeks = [];
                for (let i = 0; i < sortedDays.length; i += daysPerWeek) {
                    weeks.push(sortedDays.slice(i, i + daysPerWeek));
                }
                setWorkoutWeeks(weeks);
            }
        };

        fetchWorkoutDays();
    }, [planId]);

    return (
        <div>
            <h1>Workout Plan Details</h1>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${workoutWeeks.length}, 1fr)`, gap: '1rem' }}>
                {workoutWeeks.map((week, weekIndex) => (
                    <div key={weekIndex}>
                        <div style={{ textAlign: 'center' }}>
                            <strong>W{weekIndex + 1}</strong>
                        </div>
                        {week.map((day, dayIndex) => (
                            <Link key={day.id} to={`/workout-plans/${planId}/days/${day.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    background: day.isCompleted ? 'green' : 'red',
                                    color: 'white',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span>{`${day.name}`}</span>
                                    <span>{day.isCompleted ? 'Completed' : 'Not Completed'}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutPlanDetails;
