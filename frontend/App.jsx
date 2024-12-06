import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DataFetcher from './src/pages/components/DataFetcher.jsx';
import Login from './src/pages/login/login.jsx';
import RegisterPage from './src/pages/register/register.jsx';
import Creator from './src/pages/creator/creator.jsx';
import CourseRenderer from "./src/pages/viewer/viewer.jsx";
import HomePage from './src/pages/homepage/homepage.jsx'
import UserPanel from './src/pages/panel/panel.jsx'
import './app.scss'
import { motion } from 'framer-motion';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('userToken');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}

function AppContent() {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
      <div className="App">
        <header><h1>FlareHUB is under construction</h1></header>
        <motion.a whileHover={{scale: 1.1}}
                  whileTap={{scale: 0.95}}
                  href="https://github.com/ducthepuc/PyFlare" target="_blank" rel="noopener noreferrer">Read more here
        </motion.a>
        <motion.button whileHover={{scale: 1.1}}
                       whileTap={{scale: 0.9}}
                       onClick={navigateToLogin} id="panel-button">My panel
        </motion.button>
      </div>
  );
}

function App() {
  return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<AppContent/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/creator" element={<Creator />} />
            <Route path="/course" element={<CourseRenderer />} />
            <Route path="/homepage" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/panel" element={
              <ProtectedRoute>
                <UserPanel />
              </ProtectedRoute>
            } />
            <Route path="/viewer/:courseTitle" element={<CourseRenderer />} />
          </Routes>
        </Router>
      </>
  );
}

export default App;