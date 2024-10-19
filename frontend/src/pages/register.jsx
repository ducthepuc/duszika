import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import '../login-register.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: ''
});

  const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await fetch('http://localhost:5000/api/user_make:def', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
  };
  return (
    <>
      <div id="branding">
        <img src="https://s3-alpha.figma.com/hub/file/4093188630/561dfe3e-e5f8-415c-9b26-fbdf94897722-cover.png" alt="branding" />
      </div>
      <h1>Register</h1>
      <div id="register-fieldset">
        <div id="register-background">
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label> <br />
            <input type="text" id="username" defaultValue={formData.name}
                   onChange={handleChange} name="username" required placeholder="/:"></input> <br />
            <label htmlFor="email">Enter your email address:</label> <br />
            <input type="email" id="email" value={formData.email}  onChange={handleChange}name="email" required placeholder="/:" /> <br />
            <label htmlFor="password">Password:</label> <br />
            <input type="password" id="password" value={formData.password}  onChange={handleChange} name="password" required placeholder="/:" /> <br />
            <input type="password" id="confirm_password" value={formData.confirm_password} onChange={handleChange} name="confirm_password" required placeholder="repeat /:" /> <br />
            <button type="submit" id="register-button">Create➢</button> <br />
          </form>
          <button id="discord-auth-button">Create dc</button>
          <p>Already have an account? <Link to="/login">Login!</Link></p>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;