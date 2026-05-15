import React, { useEffect, useState } from 'react';
import axios from 'axios';

import ManualAttendance from './ManualAttendance';
import AttendanceReport from './AttendanceReport';

const TeacherPage = () => {
  const [qrImage, setQrImage] = useState('');
  const [message, setMessage] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [loadingQR, setLoadingQR] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('${process.env.REACT_APP_API_URL}/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error(error);
      setMessage('Could not load subjects');
    }
  };

  const generateQR = () => {
    if (!selectedSchedule) {
      setMessage('Please select a subject first');
      return;
    }

    setLoadingQR(true);
    setQrImage('');
    setMessage('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await axios.post('${process.env.REACT_APP_API_URL}/qr/generate', {
            schedule_id: selectedSchedule,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });

          setQrImage(response.data.qr);
          setMessage('QR generated successfully');
        } catch (error) {
          console.error(error);
          setMessage('QR generation failed');
        } finally {
          setLoadingQR(false);
        }
      },
      () => {
        setLoadingQR(false);
        setMessage('Location permission denied');
      }
    );
  };

  const selectedSubject =
    schedules.find((s) => s.id === selectedSchedule)?.subject || 'No subject selected';

  return (
    <div className="teacher-page">
      <div className="teacher-header">
        <div>
          <h1>Teacher Dashboard</h1>
          <p>Generate QR attendance, manage manual attendance, and view reports.</p>
        </div>

        <div className="teacher-badge">
          Active Session
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Class Selection</h2>
          <p>Select the subject before generating QR or marking attendance.</p>

          <select
            value={selectedSchedule}
            onChange={(e) => {
              setSelectedSchedule(e.target.value);
              setQrImage('');
              setMessage('');
            }}
            className="dashboard-select"
          >
            <option value="">Select Subject</option>

            {schedules.map((schedule) => (
              <option key={schedule.id} value={schedule.id}>
                {schedule.subject}
              </option>
            ))}
          </select>

          <div className="selected-subject">
            Current Subject: <strong>{selectedSubject}</strong>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>QR Attendance</h2>
          <p>Generate a location-based QR code for students to scan.</p>

          <button
            className="primary-action"
            onClick={generateQR}
            disabled={loadingQR}
          >
            {loadingQR ? 'Generating QR...' : 'Generate QR Code'}
          </button>

          {qrImage && (
            <div className="qr-preview">
              <img src={qrImage} alt="Attendance QR" />
              <p>Ask students to scan this QR code.</p>
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <h2>Attendance Actions</h2>
          <p>Use manual attendance as a fallback when QR scanning is not possible.</p>

          <button
            className="secondary-action"
            onClick={() => {
              setManualMode(!manualMode);
              setShowReports(false);
            }}
          >
            {manualMode ? 'Hide Manual Attendance' : 'Open Manual Attendance'}
          </button>

          <button
            className="report-action"
            onClick={() => {
              setShowReports(!showReports);
              setManualMode(false);
            }}
          >
            {showReports ? 'Hide Reports' : 'View Attendance Reports'}
          </button>
        </div>
      </div>

      {message && (
        <div className="dashboard-message">
          {message}
        </div>
      )}

      {manualMode && (
        <div className="full-section">
          <ManualAttendance scheduleId={selectedSchedule} />
        </div>
      )}

      {showReports && (
        <div className="full-section">
          <AttendanceReport />
        </div>
      )}
    </div>
  );
};

export default TeacherPage;