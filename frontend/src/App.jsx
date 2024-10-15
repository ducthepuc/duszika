import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DataFetcher from './components/DataFetcher';
import Login from './pages/login';
import RegisterPage from './pages/register';

function AppContent() {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="App">
      <h1>FlareHub is under construction</h1>
      <a href="https://github.com/ducthepuc/PyFlare" target="_blank" rel="noopener noreferrer">Read more here</a>
      <button onClick={navigateToLogin} id="panel-button">My panel</button>
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
      </Routes>
    </Router>
  );
}

export default App;
