import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/config';
import Login from './components/User/Login';
import Register from './components/User/Register';
import HomePage from './components/HomePage';
import WorkoutPlanGenerator from './components/WorkoutPlanGenerator';
import CurrentWorkout from './components/V2/CurrentWorkout';
import MyWorkoutPlansComponent from './components/V2/MyWorkoutPlansComponent';
import TestComponent from './components/TestComponent';
import Navbar from './components/navigation/Navbar';
import WorkoutPlanDetails from './components/V2/WorkoutPlanDetails';
import WorkoutDayDetailsComponent from './components/V2/WorkoutDayDetailsComponent';
import './App.css';


const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div className="main-content">
        {currentUser && <Navbar visible={navVisible} show={setNavVisible} />}
        <Routes>
          <Route path="/" element={currentUser ? <HomePage currentUser={currentUser} /> : <Login />} />
          <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/" />} />
          <Route path="/generate-workout-plan" element={<WorkoutPlanGenerator currentUser={currentUser} />} />
          <Route path="/current-workout-day" element={<CurrentWorkout currentUser={currentUser} />} />
          <Route path="/my-workout-plans" element={currentUser ? <MyWorkoutPlansComponent currentUser={currentUser} /> : <Login />} />
          <Route path="/test" element={<TestComponent currentUser={currentUser} />} />
          <Route path="/workout-plans/:planId" element={<WorkoutPlanDetails />} />
          <Route path="/workout-plans/:planId/days/:dayId" element={<WorkoutDayDetailsComponent />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
