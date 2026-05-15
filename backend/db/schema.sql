CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  department VARCHAR(30),
  graduation_year SMALLINT,
  dob date,
  password TEXT NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(10) CHECK(role in('head','admin','student','teachear')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classes(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject VARCHAR(100) NOT NULL,
  department VARCHAR(30),
  graduation_year SMALLINT,
  teacher_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_name VARCHAR(20) UNIQUE NOT NULL,
  capacity INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schedule(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id),
  room_id UUID NOT NULL REFERENCES rooms(id),
  day VARCHAR(10) CHECK (
    day IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')
  ),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  CHECK (start_time < end_time),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id),
  schedule_id UUID NOT NULL REFERENCES schedule(id),
  status VARCHAR(10) CHECK (status IN ('present','absent')) NOT NULL,
  marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, schedule_id)
);

CREATE TABLE attendance_logs(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID,
  schedule_id UUID,
  ip_address TEXT,
  device_info TEXT,
  is_suspicious BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE class_students (

  id UUID PRIMARY KEY
  DEFAULT gen_random_uuid(),

  class_id UUID NOT NULL
  REFERENCES classes(id),

  student_id UUID NOT NULL
  REFERENCES users(id),

  created_at TIMESTAMP
  DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(class_id, student_id)
);