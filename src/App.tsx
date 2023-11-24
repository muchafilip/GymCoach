import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AddWorkout from './components/AddWorkout';
import ExerciseSuggestionComponent from './components/GenerateExercises';
import OneSetViewer from './components/GetFirstSet';
import WorkoutDay from './components/WorkoutPlans/WorkoutDay';
import WorkoutPlanViewer from './components/WorkoutPlans/WorkoutPlanViewer';



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
        <Link to="/">Home</Link> | <Link to="/add-workout">Add Workout</Link> | <Link to="/workout-plans">Workout Plans</Link> | <Link to="/generate-exercises">Generate Exercises</Link> | <Link to="/test-wd-component">WD Component</Link> | <Link to="/one-set-viewer">One Set Viewer</Link> | <Link to="/workout-plan">workout plan Viewer</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Welcome to the Fitness Tracker</h1>} />
        <Route path="/add-workout" element={<AddWorkout />} />
        <Route path="/generate-exercises" element={<ExerciseSuggestionComponent />} />
        {/* <Route path="/test-wd-component" element={<WorkoutDayComponent workoutDay={workoutDay} />} /> */}
        <Route path="/one-set-viewer" element={<OneSetViewer />} />
        {/* <Route path="/exercises-viewer" element={<WorkoutDay />} /> */}
        <Route path="/workout-plan" element={<WorkoutPlanViewer />} />


      </Routes>
    </BrowserRouter>
  );
};

export default App;
