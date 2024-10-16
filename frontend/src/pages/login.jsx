import React from 'react';
import { Link } from 'react-router-dom';
import DataFetcher from '../components/DataFetcher';
import '../login-register.css';

function Login() {
  return (
    <>
      <div id="branding">
        <img src="https://s3-alpha.figma.com/hub/file/4093188630/561dfe3e-e5f8-415c-9b26-fbdf94897722-cover.png" alt="branding" />
      </div>
      <h1>Login</h1>
      <div id="login-fieldset">
        <div id="login-background">
          <label htmlFor="email">Enter your email address:</label> <br />
          <input type="email" id="email" name="email" required placeholder='E-mail' /> <br />
          <label htmlFor="password">Password:</label> <br />
          <input type="password" id="password" name="password" required placeholder='Password' /> <br />
          <button id="discord-auth-button">Login<img src="https://i1.wp.com/clipartcraft.com/images/discord-logo-transparent-white-9.png" alt="DC icon" id="discord-logo" /></button>
          <button type="submit" id="login-button">Login</button>
          <p>Don't have an account yet? <Link to="/register">Create one!</Link></p>
        </div>
      </div>
    </>
  );
}

export default Login;
