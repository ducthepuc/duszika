import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './src/pages/login/login.jsx';
import RegisterPage from './src/pages/register/register.jsx';
import Creator from './src/pages/creator/creator.jsx';
import CourseRenderer from './src/pages/viewer/viewer.jsx';
import HomePage from './src/pages/homepage/homepage.jsx';
import UserPanel from './src/pages/panel/panel.jsx';
import './app.scss';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('userToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AuthorizerPage() {
    if (localStorage.getItem("userToken")) {
        return <Navigate to="/homepage" replace />;
    }else
    {
        return <Navigate to="/login" replace />;
    }

}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthorizerPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/creator" element={<Creator />} />
        <Route path="/course" element={<CourseRenderer />} />
        <Route
          path="/homepage"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/panel"
          element={
            <ProtectedRoute>
              <UserPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/viewer/:courseTitle" element={<CourseRenderer />} />
      </Routes>
    </Router>
  );
}

export default App;