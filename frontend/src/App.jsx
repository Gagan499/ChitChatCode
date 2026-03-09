import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import DashBoard from './pages/DashBoard';
import Loginform from './pages/Loginform';
import './global.css';

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="auth-splash">
        <div className="auth-spinner" />
        <p className="auth-splash-text">ChitChatCode</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      {isAuthenticated ? <DashBoard /> : <Loginform />}
    </div>
  );
}

export default App;