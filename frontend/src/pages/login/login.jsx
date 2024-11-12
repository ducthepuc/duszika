import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './login.module.scss'; // Importing the scoped styles

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/uauth:def', {
        email,
        password,
      });

      if (response.data.result) {
        localStorage.setItem('userToken', response.data.data.token);
        history('/homepage');
      } else {
        setError(response.data.reason);
      }
    } catch (err) {
      setError('Something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.fieldsetWrapper}> {/* Use scoped className */}
      <h1 className={styles.title}>Login</h1>
      <p>Don't have an account yet? <br /><Link className={styles.link} to="/register">Register!</Link></p> <br />
      <div className={styles.loginFieldset}>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">e-mail</label> <br />
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="/:"
          /> <br />
          <label htmlFor="password">password</label> <br />
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="/:"
          /> <br />
          {error && <p className={styles.errorField}>{error}</p>} {/* Use scoped className */}
          <br />
          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
        <button className={styles.discordAuthButton}>
          Login with Discord
        </button>
      </div>
    </div>
  );
}

export default Login;
