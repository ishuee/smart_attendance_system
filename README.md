# Smart Attendance Management System

A full-stack attendance management system built using React.js, Node.js, Express.js, and PostgreSQL.
The project was built to reduce proxy attendance and simplify classroom attendance management using dynamic QR codes and geolocation verification.
This project was built as a practical approach to understanding full-stack development, authentication workflows, database design, and real-time attendance validation systems.

---

## Features

- Dynamic QR code generation for each session
- QR expiry validation
- Geolocation-based attendance verification
- Student and teacher dashboards
- Subject-wise attendance validation
- Duplicate attendance prevention
- Manual attendance marking
- Attendance reports
- Attendance logging for suspicious activity

---

## Tech Stack

Frontend:
- React.js
- HTML/CSS
- Axios

Backend:
- Node.js
- Express.js

Database:
- PostgreSQL

Other:
- html5-qrcode
- Browser Geolocation API

---

## How it Works

1. Teacher selects a subject/session
2. System generates a dynamic QR code
3. Student scans the QR code
4. Student location is verified
5. Attendance is marked only if:
   - QR is valid
   - Student belongs to the subject
   - Student is within allowed range
   - Attendance was not already marked

---

## Project Structure

```text
frontend/
backend/
```

The frontend handles UI, QR scanning, and dashboards.

The backend handles:
- authentication
- QR validation
- geolocation checks
- attendance logic
- database operations

---

## Environment Variables

Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:5000
```

Backend `.env`

```env
DATABASE_URL=your_postgresql_connection_string
PORT=5000
```

## Running Locally

Clone the repository:

```bash
git clone https://github.com/ishuee/smart_attendance_system.git
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Future Improvements

- Mobile application support
- Face verification for attendance
- Cloud deployment
- Analytics dashboard
- Better GPS accuracy validation
