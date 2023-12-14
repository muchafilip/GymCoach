import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/config'; // Update the path to your firebase config
//import WorkoutPlanPage from './components/WorkoutPlans/screens/WorkoutPlanPage';
import Login from './components/User/Login';
import Register from './components/User/Register';
import LogoutButton from './components/User/LogOutButton'; // Import the LogoutButton component
import HomePage from './components/HomePage';
import WorkoutPlanGenerator from './components/WorkoutPlanGenerator';
import CurrentWorkout from './components/V2/CurrentWorkout'; // Adjust the import path as necessary
import MyWorkoutPlansComponent from './components/V2/MyWorkoutPlansComponent';
import SubscribedWorkoutInfo from './components/V2/SubscribedWorkoutInfo';
import WorkoutPlanDetails from './components/V2/WorkoutPlanDetails';
import WorkoutDayDetailsComponent from './components/V2/WorkoutDayDetailsComponent';
import Test from './components/TestComponent';


const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (

    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        {currentUser ? (
          <>
            | <Link to="/generate-workout-plan">Generate Workout Plan</Link>
            | <Link to="/current-workout-day">Current Workout</Link>
            | <Link to="/my-workout-plans">My Workout plans</Link>
            | <Link to="/test">Test</Link>


            | <LogoutButton />
          </>
        ) : (
          <>
            | <Link to="/login">Login</Link>
            | <Link to="/register">Register</Link>
          </>
        )}

      </nav>



      <SubscribedWorkoutInfo currentUser={currentUser} />

      <Routes>
        <Route path="/" element={currentUser ? <HomePage currentUser={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/user-workout-plans" />} />
        <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/user-workout-plans" />} />
        {/* <Route path="/workouts/:workoutPlanId" element={<WorkoutPlanPage />} /> */}
        <Route path="/generate-workout-plan" element={currentUser ? <WorkoutPlanGenerator currentUser={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/current-workout-day" element={currentUser ? <CurrentWorkout currentUser={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/my-workout-plans" element={currentUser ? <MyWorkoutPlansComponent currentUser={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/test" element={currentUser ? <Test currentUser={currentUser} /> : <Navigate to="/login" />} />

        <Route path="/workout-plans/:planId" element={<WorkoutPlanDetails />} />
        <Route path="/workout-plans/:planId/days/:dayId" element={<WorkoutDayDetailsComponent />} />




      </Routes>
    </BrowserRouter>

  );
};

export default App;
