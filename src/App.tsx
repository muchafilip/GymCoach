import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ExerciseSuggestionComponent from './components/GenerateExercises';
import WorkoutPlanPage from './components/WorkoutPlans/screens/WorkoutPlanPage';

const App: React.FC = () => {


  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/generate-exercises">Generate Exercises</Link> | <Link to="/workout">workout</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Welcome to the Fitness Tracker</h1>} />
        <Route path="/generate-exercises" element={<ExerciseSuggestionComponent />} />

        <Route path="/workout" element={<WorkoutPlanPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
