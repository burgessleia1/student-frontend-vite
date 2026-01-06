import React, { useEffect, useState } from 'react';

interface Student {
  _id: string;
  name: string;
  age: number;
  major: string;
  enrolled: boolean;
}

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number | ''>('');
  const [newMajor, setNewMajor] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState<number | ''>('');
  const [editMajor, setEditMajor] = useState('');

  const API_BASE: string = import.meta.env.VITE_API_BASE_URL;

  // Fetch all students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/students`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: Student[] = await res.json();
      setStudents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Create student
  const handleCreate = async () => {
    if (!newName.trim() || !newAge || !newMajor.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          age: Number(newAge),
          major: newMajor.trim(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setNewName('');
      setNewAge('');
      setNewMajor('');
      fetchStudents();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete student
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      fetchStudents();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Start editing
  const startEditing = (student: Student) => {
    setEditingId(student._id);
    setEditName(student.name);
    setEditAge(student.age);
    setEditMajor(student.major);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditAge('');
    setEditMajor('');
  };

  // Update student
  const handleUpdate = async (id: string) => {
    if (!editName.trim() || !editAge || !editMajor.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName.trim(),
          age: Number(editAge),
          major: editMajor.trim(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      cancelEditing();
      fetchStudents();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading students...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">Student Vite App</h1>

      {/* Create Student Form */}
      <div className="mb-6 p-4 bg-white rounded shadow flex flex-col md:flex-row md:space-x-4">
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="mb-2 md:mb-0 p-2 border rounded flex-1"
        />
        <input
          type="number"
          placeholder="Age"
          value={newAge}
          onChange={(e) => setNewAge(e.target.value === '' ? '' : Number(e.target.value))}
          className="mb-2 md:mb-0 p-2 border rounded flex-1"
        />
        <input
          type="text"
          placeholder="Major"
          value={newMajor}
          onChange={(e) => setNewMajor(e.target.value)}
          className="mb-2 md:mb-0 p-2 border rounded flex-1"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Student
        </button>
      </div>

      {/* Students List */}
      {students.filter((s) => s.name && s.major).length === 0 ? (
        <p className="text-center text-gray-700">No students found.</p>
      ) : (
        <ul className="space-y-4">
          {students
            .filter((s) => s.name && s.major) // FILTER EMPTY RECORDS HERE
            .map((student) => (
              <li
                key={student._id}
                className="p-4 bg-white rounded shadow flex justify-between items-center"
              >
                {editingId === student._id ? (
                  // Edit Mode
                  <div className="flex flex-col md:flex-row md:space-x-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mb-2 md:mb-0 p-2 border rounded flex-1"
                    />
                    <input
                      type="number"
                      value={editAge}
                      onChange={(e) =>
                        setEditAge(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      className="mb-2 md:mb-0 p-2 border rounded flex-1"
                    />
                    <input
                      type="text"
                      value={editMajor}
                      onChange={(e) => setEditMajor(e.target.value)}
                      className="mb-2 md:mb-0 p-2 border rounded flex-1"
                    />
                    <button
                      onClick={() => handleUpdate(student._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex-1">
                      <strong>{student.name}</strong> — {student.age} years old, Major:{' '}
                      {student.major} {student.enrolled ? '(Enrolled)' : '(Not Enrolled)'}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(student)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default App;



