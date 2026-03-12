import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import PatientDashboard from './components/PatientDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('userType');
    if (savedUser && savedUserType) {
      setCurrentUser(JSON.parse(savedUser));
      setUserType(savedUserType);
    }
  }, []);

  const handleLogin = (user, type) => {
    setCurrentUser(user);
    setUserType(type);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userType', type);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserType(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
  };

  return (
    <Provider store={store}>
      <div className="App">
        {!currentUser ? (
          <LoginPage onLogin={handleLogin} />
        ) : userType === 'admin' ? (
          <AdminDashboard user={currentUser} onLogout={handleLogout} />
        ) : (
          <PatientDashboard user={currentUser} onLogout={handleLogout} />
        )}
      </div>
    </Provider>
  );
}

export default App;
