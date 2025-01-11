import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './src/pages/homepage/homepage';
import LoginPage from './src/pages/login/login';
import RegisterPage from './src/pages/register/register';
import CreatorPage from './src/pages/creator/creator';
import ViewerPage from './src/pages/viewer/viewer';
import ProfilePage from './src/pages/profile/profile';
import PanelPage from './src/pages/panel/panel';
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
            <div className="App" style={{
                minHeight: '100vh',
                backgroundColor: '#1a1a1a',
                color: 'rgb(240, 240, 240)',
                fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/creator" element={<CreatorPage />} />
                    <Route path="/viewer/:courseTitle" element={<ViewerPage />} />
                    <Route path="/profile/:username" element={<ProfilePage />} />
                    <Route path="/panel" element={<PanelPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App; 