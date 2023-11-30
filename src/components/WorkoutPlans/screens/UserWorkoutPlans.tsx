// components/UserWorkoutPlans.tsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../../firebase/config';
import { Link } from 'react-router-dom';
import { User } from 'firebase/auth';

interface UserWorkoutPlansProps {
    currentUser: User;
}

const UserWorkoutPlans: React.FC<UserWorkoutPlansProps> = ({ currentUser }) => {
    const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);

    useEffect(() => {
        const fetchUserWorkoutPlans = async () => {
            if (!currentUser) return;

            const q = query(collection(firestore, "workoutPlans"), where("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWorkoutPlans(plans);
        };

        fetchUserWorkoutPlans();
    }, [currentUser]);

    return (
        <div>
            <h1>Your Workout Plans</h1>
            {workoutPlans.map(plan => (
                <Link key={plan.id} to={`/workouts/${plan.id}`}>
                    <div>
                        <h3>{plan.title}</h3>
                        {/* Add more plan details if necessary */}
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default UserWorkoutPlans;
