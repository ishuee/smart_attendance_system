import React,
{
  useEffect,
  useState,
  useRef
}
from 'react';

import axios from 'axios';

import { Html5Qrcode }
from 'html5-qrcode';

const StudentScanner = ({
  studentId
}) => {

  const [message,
    setMessage] =
    useState('');

  const [status,
    setStatus] =
    useState('waiting');

  const [locationAllowed,
    setLocationAllowed] =
    useState(false);

  const [studentLatitude,
    setStudentLatitude] =
    useState(null);

  const [studentLongitude,
    setStudentLongitude] =
    useState(null);

  const scannerRef =
    useRef(null);

  useEffect(() => {

    navigator.geolocation
      .getCurrentPosition(

        (position) => {

          setStudentLatitude(
            position.coords.latitude
          );

          setStudentLongitude(
            position.coords.longitude
          );

          setLocationAllowed(true);

          setStatus('ready');
        },

        () => {

          setMessage(
            'Location permission denied'
          );

          setStatus('error');
        }
      );

  }, []);

  useEffect(() => {

    if (!locationAllowed)
      return;

    const html5QrCode =
      new Html5Qrcode('reader');

    scannerRef.current =
      html5QrCode;

    html5QrCode.start(

      {
        facingMode:
          'environment'
      },

      {
        fps: 10,

        qrbox: {
          width: 250,
          height: 250
        }
      },

      async (decodedText) => {

        try {

          setStatus(
            'processing'
          );

          await html5QrCode.stop();

          const qrData =
            JSON.parse(
              decodedText
            );

          navigator.geolocation
            .getCurrentPosition(

              async (
                position
              ) => {

                const student_latitude =
                  position.coords.latitude;

                const student_longitude =
                  position.coords.longitude;

                try {

                  const response =
                    await axios.post(

                      '${process.env.REACT_APP_API_URL}/attendance/mark',

                      {
                        student_id:
                          studentId,

                        schedule_id:
                          qrData.schedule_id,

                        qr_generated_at:
                          qrData.generated_at,

                        teacher_latitude:
                          qrData.teacher_latitude,

                        teacher_longitude:
                          qrData.teacher_longitude,

                        student_latitude,

                        student_longitude,

                        status:
                          'present'
                      }
                    );

                  setMessage(
                    response.data.message
                  );

                  setStatus(
                    'success'
                  );

                } catch (err) {

                  console.error(err);

                  setMessage(

                    err.response?.data?.message ||

                    'Attendance failed'
                  );

                  setStatus(
                    'error'
                  );
                }
              }
            );

        } catch (err) {

          console.error(err);

          setMessage(
            'Invalid QR code'
          );

          setStatus('error');
        }
      }
    );

    return () => {

      if (
        scannerRef.current
      ) {

        scannerRef.current
          .stop()
          .catch(console.error);
      }
    };

  }, [locationAllowed,
      studentId]);

  return (

    <div className="scanner-page">

      <div className="scanner-card">

        <h1>
          Smart Attendance
        </h1>

        <p className="scanner-subtitle">

          QR Based Attendance
          Verification

        </p>

        <div className="status-box">

          {

            status === 'waiting' && (

              <p>
                Waiting for location...
              </p>
            )
          }

          {

            status === 'ready' && (

              <p>
                Ready to scan QR
              </p>
            )
          }

          {

            status ===
            'processing' && (

              <p>
                Processing attendance...
              </p>
            )
          }

          {

            status ===
            'success' && (

              <p className="success-text">
                Attendance marked
                successfully
              </p>
            )
          }

          {

            status ===
            'error' && (

              <p className="error-text">
                Attendance failed
              </p>
            )
          }

        </div>

        {

          locationAllowed && (

            <div
              className="scanner-wrapper"
            >

              <div
                id="reader"
              ></div>

            </div>
          )
        }

        {

          message && (

            <div className="message-box">

              {message}

            </div>
          )
        }

        <div className="location-info">

          <p>
            Location Access:
            {

              locationAllowed
              ? ' Allowed'
              : ' Denied'
            }
          </p>

        </div>

      </div>

    </div>
  );
};

export default StudentScanner;