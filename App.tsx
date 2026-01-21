
import React, { useState, useEffect, useRef } from 'react';
import Overview from './pages/Overview';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Hidden Trigger: 7x "9" in 5 seconds
  const keySequenceRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '9') {
        const now = Date.now();
        const diff = now - keySequenceRef.current.lastTime;
        
        if (diff < 5000) {
          keySequenceRef.current.count += 1;
        } else {
          keySequenceRef.current.count = 1;
        }
        
        keySequenceRef.current.lastTime = now;

        if (keySequenceRef.current.count === 7) {
          setIsAdminMode(true);
          keySequenceRef.current.count = 0;
        }
      } else {
        keySequenceRef.current.count = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    const session = sessionStorage.getItem('admin_session');
    if (session) setIsLoggedIn(true);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_session');
    setIsLoggedIn(false);
    setIsAdminMode(false);
  };

  if (isAdminMode && !isLoggedIn) {
    return (
      <AdminLogin 
        onSuccess={() => setIsLoggedIn(true)} 
        onCancel={() => setIsAdminMode(false)} 
      />
    );
  }

  if (isAdminMode && isLoggedIn) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <Overview />;
};

export default App;
