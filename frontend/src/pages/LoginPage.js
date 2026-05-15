import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({
  setIsLoggedIn,
  setStudentId,
  setRole
}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          email,
          password
        }
      );

      setIsError(false);
      setMessage('Login successful');

      setStudentId(response.data.user.id);
      setRole(response.data.user.role);
      setIsLoggedIn(true);

    } catch (error) {

      setIsError(true);

      setMessage(
        error.response?.data?.message ||
        'Login failed'
      );
    }
  };

  return (

    <div className="simple-login-page">

      <div className="simple-login-box">

        <h2>
          Smart Attendance System
        </h2>

        <p className="login-note">
          Please enter your registered email and password to continue.
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        {message && (

          <p
            className={
              isError
                ? 'login-error'
                : 'login-success'
            }
          >

            {message}

          </p>
        )}

      </div>

    </div>
  );
};

export default LoginPage;