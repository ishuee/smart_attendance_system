import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceReport = ({ scheduleId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (scheduleId) {
      fetchReports();
    }
  }, [scheduleId]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/attendance/report?schedule_id=${scheduleId}`
      );

      setReports(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load attendance report');
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Attendance Report</h2>

      {loading && <p>Loading reports...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && reports.length === 0 && (
        <p>No attendance records found.</p>
      )}

      {reports.length > 0 && (
        <table
          border="1"
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px',
            textAlign: 'center'
          }}
        >
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Day</th>
              <th>Time</th>
              <th>Status</th>
              <th>Method</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.student_name}</td>
                <td>{report.subject}</td>
                <td>{report.day}</td>
                <td>
                  {report.start_time} - {report.end_time}
                </td>
                <td>{report.status}</td>
                <td>{report.method}</td>
                <td>
                  {new Date(report.marked_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceReport;