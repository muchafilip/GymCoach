import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ExerciseSuggestionComponent from './components/GenerateExercises';
import WorkoutPlanPage from './components/WorkoutPlans/screens/WorkoutPlanPage';

const App: React.FC = () => {

  const workoutDay = {
    name: "day1",
    exercises: [{ name: "squat", description: "test", sets: [{ setNumber: 1, weight: "100", targetReps: 8, repsCompleted: null, completed: false }, { setNumber: 2, weight: "100", targetReps: 8, repsCompleted: null, completed: false }] },
    { name: "bench press", description: "test", sets: [{ setNumber: 1, weight: "100", targetReps: 8, repsCompleted: null, completed: false }] },
    { name: "deadlift", description: "test", sets: [{ setNumber: 1, weight: "100", targetReps: 8, repsCompleted: null, completed: false }] }
    ]
  }

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
