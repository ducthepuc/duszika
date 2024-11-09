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
    const navigateToCourse = () =>  {
        navigate('/course')
    }


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
          <motion.button whileHover={{scale: 1.1}}
                         whileTap={{scale: 0.9}}
                         onClick={navigateToCreator} id="login-button">Create
          </motion.button>
          <motion.button whileHover={{scale: 1.1}}
                         whileTap={{scale: 0.9}}
                         onClick={navigateToCourse} id="login-button">Course
          </motion.button>
          <DataFetcher/>
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
          </Routes>
        </Router>
      </>
  );
}

export default App;
