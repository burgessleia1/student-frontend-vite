import React, { useState, useEffect } from 'react';
import './App.css';

interface User {
  _id: string;
  username: string;
  role: 'student' | 'instructor';
}

interface Instructor {
  _id: string;
  name: string;
}

interface Student {
  _id: string;
  name: string;
}

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [editInstructorName, setEditInstructorName] = useState('');

  // Login handler
  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });
      console.log(res.body)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  // Fetch students and instructors after login
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const studentRes = await fetch('http://localhost:3000/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const instructorRes = await fetch('http://localhost:3000/instructors', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!studentRes.ok) throw new Error(`HTTP error! status: ${studentRes.status}`);
        if (!instructorRes.ok) throw new Error(`HTTP error! status: ${instructorRes.status}`);

        const studentsData = await studentRes.json();
        const instructorsData = await instructorRes.json();

        setStudents(studentsData);
        setInstructors(instructorsData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  // Update instructor handler
  const handleUpdateInstructor = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/instructors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editInstructorName }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const updatedInstructor = await res.json();
      setInstructors((prev) =>
        prev.map((instr) => (instr._id === id ? updatedInstructor : instr))
      );
      setEditInstructorName('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <div className="login-container">
        <h1>Student & Instructor App</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>Welcome, {user?.username}</h1>

      <section>
        <h2>Students</h2>
        <ul>
          {students.map((stu) => (
            <li key={stu._id}>{stu.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Instructors</h2>
        <ul>
          {instructors.map((instr) => (
            <li key={instr._id} className="instructor-item">
              <input
                type="text"
                value={editInstructorName}
                onChange={(e) => setEditInstructorName(e.target.value)}
                placeholder={instr.name}
                className="edit-input"
              />
              <button
                onClick={() => handleUpdateInstructor(instr._id)}
                className="update-btn"
              >
                Update
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default App;