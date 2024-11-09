import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DataFetcher from './components/DataFetcher';
import Login from './pages/login';
import RegisterPage from './pages/register';
import Creator from './pages/creator';
import CourseRenderer from "./pages/viewer.jsx";

function AppContent() {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate('/login');
  };
    const navigateToCreator = () => {
        navigate('/creator');
    };

  return (
    <div className="App">
      <h1>FlareHub is under construction</h1>
      <a href="https://github.com/ducthepuc/PyFlare" target="_blank" rel="noopener noreferrer">Read more here</a>
      <button onClick={navigateToLogin} id="panel-button">My panel</button>
      <button onClick={navigateToCreator} id="login-button">Create</button>
      <DataFetcher />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/creator" element={<Creator />} />
        <Route path="/course" element={<CourseRenderer />} />
      </Routes>
    </Router>
  );
}

export default App;
