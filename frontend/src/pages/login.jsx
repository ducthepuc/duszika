import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../login-register.css';
import discordImage from '../assets/discord.png';

function Login() {
  // State hooks to manage form input and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // useNavigate hook for redirecting after successful login
  const history = useNavigate();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior

    setLoading(true);
    setError('');  // Reset any previous errors

    try {
      // Send the POST request to the backend API
      const response = await axios.post('http://localhost:5000/api/uauth:def', {
        email: email,
        password: password,
      });

      if (response.data.result) {
        // If login is successful, store the token and user data (optional)
        localStorage.setItem('userToken', response.data.data.token);  // Save token in localStorage
        // Redirect the user to another page (e.g., dashboard)
        history.push('/dashboard');
      } else {
        // If login fails, show the error message from the response
        setError(response.data.reason);
      }
    } catch (err) {
      // Handle unexpected errors (e.g., network issues)
      setError('Something went wrong, please try again.');
    } finally {
      setLoading(false);  // Set loading to false when the request completes
    }
  };

  return (
    <html>
      <body>
        <div id="fieldset-wrapper">
          <h1 id="title">Login</h1>
          <p>Don't have an account yet? <Link id="link" to="/register">Register!</Link></p> <br />
          <div id="login-fieldset">
            <form onSubmit={handleLogin}> /* Prevent the default form submission */
              <label htmlFor="email">E-mail</label> <br />
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}  /* Bind email input */
                placeholder="Enter your email"
              /> <br />
              <label htmlFor="password">Password</label> <br />
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}  /* Bind password input */
                placeholder="Enter your password"
              /> <br />
              {error && <p id="error-field">{error}</p>}
              <br />
              <button type="submit" id="login-button" disabled={loading}>
                {loading ? 'Logging in...' : 'LOGIN ➢'}
              </button>
            </form>
            <button id="discord-auth-button">
              <img src="../assets/discord.png" alt="Discord Icon" width="200" height="50" />
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

export default Login;