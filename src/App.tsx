import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/config'; // Update the path to your firebase config
import ExerciseSuggestionComponent from './components/GenerateExercises';
import WorkoutPlanPage from './components/WorkoutPlans/screens/WorkoutPlanPage';
import Login from './components/User/Login';
import Register from './components/User/Register';
import LogoutButton from './components/User/LogOutButton'; // Import the LogoutButton component
import HomePage from './components/HomePage';
import WorkoutPlanGenerator from './components/WorkoutPlanGenerator';

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
            | <Link to="/generate-exercises">Generate Exercises</Link>
            | <Link to="/workout">Workout</Link>
            | <Link to="/generate-workout-plan">Update Template AI</Link>
            | <LogoutButton />
          </>
        ) : (
          <>
            | <Link to="/login">Login</Link>
            | <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={currentUser ? <HomePage currentUser={currentUser} /> : <Navigate to="/login" />} />
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/workout" />} />
        <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/workout" />} />
        <Route path="/generate-exercises" element={currentUser ? <ExerciseSuggestionComponent /> : <Navigate to="/login" />} />
        <Route path="/workout" element={currentUser ? <WorkoutPlanPage /> : <Navigate to="/login" />} />
        <Route path="/generate-workout-plan" element={currentUser ? <WorkoutPlanGenerator currentUser={currentUser} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
