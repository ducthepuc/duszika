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
    <body>
      <div id="fieldset-wrapper">
        <h1 id="title">Register</h1>
        <p>Already have an account? <Link id="link" to="/login">Login!</Link></p> <br />
        <div id="register-fieldset">
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">username</label> <br />
            <input type="text" id="username" defaultValue={formData.name}
                    onChange={handleChange} name="username" required placeholder="/:"></input> <br />
            <label htmlFor="email">e-mail</label> <br />
            <input type="email" id="email" value={formData.email}  onChange={handleChange}name="email" required placeholder="/:" /> <br />
            <label htmlFor="password">password</label> <br />
            <input type="password" id="password" value={formData.password}  onChange={handleChange} name="password" required placeholder="/:" /> <br />
            <input type="password" id="confirm_password" value={formData.confirm_password} onChange={handleChange} name="confirm_password" required placeholder="repeat /:" /> <br />
            <button type="submit" id="register-button">CREATE➢</button>
          </form>
          <button id="discord-auth-button"><img src='../assets/discord.png' alt="Discord Icon"  width="200" height="50"/></button>
        </div>
      </div>
    </body>
  );
}

export default RegisterPage;