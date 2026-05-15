import React,
{
  useState
}
from 'react';

import StudentScanner
from './StudentScanner';

import AttendanceReport
from './AttendanceReport';

const StudentDashboard = ({
  studentId
}) => {

  const [showScanner,
    setShowScanner] =
    useState(false);

  const [showReports,
    setShowReports] =
    useState(false);

  return (

    <div className="student-page">

      <div className="student-header">

        <div>

          <h1>
            Student Dashboard
          </h1>

          <p>
            Smart Attendance
            Management System
          </p>

        </div>

        <div className="student-badge">

          Active Student

        </div>

      </div>

      <div className="student-grid">

        <div className="student-card">

          <h2>
            Scan Attendance
          </h2>

          <p>
            Scan the classroom
            QR code to mark
            your attendance.
          </p>

          <button

            className="student-btn"

            onClick={() => {

              setShowScanner(
                !showScanner
              );

              setShowReports(
                false
              );
            }}
          >

            {

              showScanner
              ? 'Close Scanner'
              : 'Open Scanner'
            }

          </button>

        </div>

        <div className="student-card">

          <h2>
            Attendance History
          </h2>

          <p>
            View your attendance
            records and subject-wise
            attendance details.
          </p>

          <button

            className="student-report-btn"

            onClick={() => {

              setShowReports(
                !showReports
              );

              setShowScanner(
                false
              );
            }}
          >

            {

              showReports
              ? 'Hide Reports'
              : 'View Reports'
            }

          </button>

        </div>

        <div className="student-card">

          <h2>
            Attendance Status
          </h2>

          <div className="attendance-stats">

            <div>

              <h3>
                85%
              </h3>

              <p>
                Overall Attendance
              </p>

            </div>

            <div>

              <h3>
                5
              </h3>

              <p>
                Subjects
              </p>

            </div>

          </div>

        </div>

      </div>

      {

        showScanner && (

          <div className="student-section">

            <StudentScanner
              studentId={studentId}
            />

          </div>
        )
      }

      {

        showReports && (

          <div className="student-section">

            <AttendanceReport />

          </div>
        )
      }

    </div>
  );
};

export default StudentDashboard;