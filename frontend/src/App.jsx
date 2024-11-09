import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DataFetcher from './components/DataFetcher';
import Login from './pages/login';
import RegisterPage from './pages/register';
import Creator from './pages/creator';
import CourseRenderer from "./pages/viewer.jsx";
import GlobalStyles from "./components/styles/globalStyles.js";
import Header from './components/elements/header.jsx';
import AnimatedButton from './components/styles/button1Styled.js';
import AnimatedLink from "./components/styles/linkStyled.js";

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
      <Header />
      <AnimatedLink whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://github.com/ducthepuc/PyFlare" target="_blank" rel="noopener noreferrer">Read more here</AnimatedLink>
      <AnimatedButton whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={navigateToLogin} id="panel-button">My panel</AnimatedButton>
        <AnimatedButton whileHover={{ scale: 1.1}}
                        whileTap={{ scale: 0.9 }} onClick={navigateToCreator} id="login-button">Create</AnimatedButton>
      <DataFetcher />
    </div>
  );
}

function App() {
  return (
      <>
        <GlobalStyles />
        <Router>
          <Routes>
            <Route path="/" element={<AppContent />} />
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
