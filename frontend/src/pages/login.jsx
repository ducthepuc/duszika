import React from 'react';
import { Link } from 'react-router-dom';
import DataFetcher from '../components/DataFetcher';
import '../login-register.css';

function Login() {
  return (
    <body>
      <div id="fieldset-wrapper">
        <h1 id="title">Login</h1>
        <p>Don't have an account yet? <Link id="link" to="/register">Register!</Link></p> <br />
        <div id="login-fieldset">
            <form action="/api/uauth:def">
              <label htmlFor="email">e-mail</label> <br />
              <input type="email" id="email" name="email" required placeholder=':/' /> <br />
              <label htmlFor="password">password</label>   <br />
              <input type="password" id="password" name="password" required placeholder=':/' /> <br />
              <p  id='error-field'></p> <br />
              <button type="submit" id="login-button">LOGIN➢</button> 
            </form>
            <button id="discord-auth-button"><img src='../assets/discord.png' alt="Discord Icon"  width="200" height="50"/></button>
          </div>
        </div>
    </body>
  );
}

export default Login;
