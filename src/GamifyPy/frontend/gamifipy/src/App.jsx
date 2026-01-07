import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './view/home/home.jsx'
import Auth from './view/auth/auth.jsx'
import Register from './view/auth/register.jsx';
import Profile from './view/profile/profile.jsx';
import Levels from './view/levels/levels.jsx';
import LevelView from './view/LevelView/LevelView.jsx';
import ForgotPassword from './view/auth/ForgotPassword.jsx';
import GoogleCallback from './components/GoogleCallback.jsx';
import ProtectedRoute from './services/ProtectedRoute.jsx';
import { refreshAccessToken } from './services/refreshToken.jsx';
import './App.css'

function App() {
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/register' element={<Register />} />
            <Route path='/profile' element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path='/levels' element={
              <ProtectedRoute>
                <Levels />
              </ProtectedRoute>
            } />
            <Route path='/level/:levelId' element={
              <ProtectedRoute>
                <LevelView />
              </ProtectedRoute>
            } />
            <Route path='/auth/callback' element={<GoogleCallback />} />
            <Route path='/reset-password' element={<ForgotPassword />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
