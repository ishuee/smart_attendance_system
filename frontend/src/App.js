import React, { useState } from 'react';

import './App.css';

import LoginPage from './pages/LoginPage';
import TeacherPage from './pages/TeacherPage';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [role, setRole] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="app-container">
        <LoginPage
          setIsLoggedIn={setIsLoggedIn}
          setStudentId={setStudentId}
          setRole={setRole}
        />
      </div>
    );
  }

  if (role === 'teacher') {
    return <TeacherPage />;
  }

  if (role === 'student') {
    return <StudentDashboard studentId={studentId} />;
  }

  return <div>Invalid role</div>;
}

export default App;