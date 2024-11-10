import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DataFetcher from './src/components/DataFetcher.jsx';
import Login from './src/pages/login/login.jsx';
import RegisterPage from './src/pages/register/register.jsx';
import Creator from './src/pages/creator/creator.jsx';
import CourseRenderer from "./src/pages/viewer/viewer.jsx";
import './app.scss'
import { motion } from 'framer-motion';

function AppContent() {
  const navigate = useNavigate();
  
  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToCreator = () => {
    navigate('/creator');
  };

  const navigateToCourse = () => {
    navigate('/course');
  };

  return (
    <div className="App">
      <header className="App__header">
        <h1>FlareHUB is under construction</h1>
      </header>

      <div className="App__buttons">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={navigateToLogin}
          className="App__button App__button--panel"
        >
          My panel
        </motion.button>
        <br />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={navigateToCreator}
          className="App__button App__button--create"
        >
          Create
        </motion.button>
        <br />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={navigateToCourse}
          className="App__button App__button--course"
        >
          Course
        </motion.button>
        <br />

        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          href="https://github.com/ducthepuc/PyFlare"
          target="_blank"
          rel="noopener noreferrer"
          className="App__link"
        >
          Read more here
        </motion.a>
      </div>
      
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
