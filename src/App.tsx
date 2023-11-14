import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AddWorkout from './components/AddWorkout';
import WorkoutPlans from './components/GetWorkoutPlans';
import ExerciseSuggestionComponent from './components/GenerateExercises';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/add-workout">Add Workout</Link> | <Link to="/workout-plans">Workout Plans</Link> | <Link to="/generate-exercises">Generate Exercises</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Welcome to the Fitness Tracker</h1>} />
        <Route path="/add-workout" element={<AddWorkout />} />
        <Route path="/workout-plans" element={<WorkoutPlans />} />
        <Route path="/generate-exercises" element={<ExerciseSuggestionComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
