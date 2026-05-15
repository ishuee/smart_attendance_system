import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManualAttendance = ({ scheduleId }) => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/students`
      );

      setStudents(response.data);

      const initialData = {};

      response.data.forEach((student) => {
        initialData[student.id] = 'not_considered';
      });

      setAttendanceData(initialData);
    } catch (error) {
      console.error(error);
      setMessage('Failed to load students');
    }
  };

  const handleCheckbox = (studentId, status) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: status
    });
  };

  const markAllPresent = () => {
    const updated = {};

    students.forEach((student) => {
      updated[student.id] = 'present';
    });

    setAttendanceData(updated);
  };

  const markAllAbsent = () => {
    const updated = {};

    students.forEach((student) => {
      updated[student.id] = 'absent';
    });

    setAttendanceData(updated);
  };

  const markAllNotConsidered = () => {
    const updated = {};

    students.forEach((student) => {
      updated[student.id] = 'not_considered';
    });

    setAttendanceData(updated);
  };

  const submitAttendance = async () => {
    if (!scheduleId) {
      setMessage('Please select a subject first');
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/attendance/manual`,
        {
          attendanceData,
          schedule_id: scheduleId
        }
      );

      setMessage('Attendance marked successfully');
    } catch (error) {
      console.error(error);
      setMessage('Attendance failed');
    }
  };

  return (
    <div
      style={{
        marginTop: '30px',
        padding: '30px',
        background: '#fff',
        borderRadius: '12px',
        width: '95%',
        margin: 'auto'
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}
      >
        Manual Attendance
      </h1>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}
      >
        <button onClick={markAllPresent}>
          Mark All Present
        </button>

        <button onClick={markAllAbsent}>
          Mark All Absent
        </button>

        <button onClick={markAllNotConsidered}>
          Mark All Not Considered
        </button>
      </div>

      <table
        border="1"
        cellPadding="15"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'center'
        }}
      >
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Email</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Not Considered</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>

              <td>{student.email}</td>

              <td>
                <input
                  type="checkbox"
                  checked={attendanceData[student.id] === 'present'}
                  onChange={() => handleCheckbox(student.id, 'present')}
                />
              </td>

              <td>
                <input
                  type="checkbox"
                  checked={attendanceData[student.id] === 'absent'}
                  onChange={() => handleCheckbox(student.id, 'absent')}
                />
              </td>

              <td>
                <input
                  type="checkbox"
                  checked={attendanceData[student.id] === 'not_considered'}
                  onChange={() =>
                    handleCheckbox(student.id, 'not_considered')
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={submitAttendance}
        style={{
          marginTop: '20px',
          padding: '10px 20px'
        }}
      >
        Submit Attendance
      </button>

      {message && (
        <h3
          style={{
            marginTop: '20px'
          }}
        >
          {message}
        </h3>
      )}
    </div>
  );
};

export default ManualAttendance;