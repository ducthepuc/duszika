import React from 'react';
import { Link } from 'react-router-dom';
import '../login-register.css';

function RegisterPage() {
  return (
    <>
      <div id="branding">
        <img src="https://s3-alpha.figma.com/hub/file/4093188630/561dfe3e-e5f8-415c-9b26-fbdf94897722-cover.png" alt="branding" />
      </div>
      <h1>Register</h1>
      <div id="register-fieldset">
        <div id="register-background">
          <label htmlFor="username"></label> <br />
          <input type="name" id="username" name="username" required placeholder="/:"></input> <br />
          <label htmlFor="email">Enter your email address:</label> <br />
          <input type="email" id="email" name="email" required placeholder="/:" /> <br />
          <label htmlFor="password">Password:</label> <br />
          <input type="password" id="password" name="password" required placeholder="/:" /> <br />
          <input type="password" id="confirm-password" name="confirm-password" required placeholder="repeat /:" /> <br />
          <button id="discord-auth-button">Create<img src="https://i1.wp.com/clipartcraft.com/images/discord-logo-transparent-white-9.png" alt="DC icon" id="discord-logo" /></button>
          <button type="submit" id="register-button">Create➢</button> <br />
          <p>Already have an account? <Link to="/login">Login!</Link></p>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
