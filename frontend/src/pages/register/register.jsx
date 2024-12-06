import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../login/account.module.scss';
import { motion } from 'framer-motion';

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
      <h1 className={styles.title}>Register to Flare</h1>
      <p>Already have an account? <br/><Link className={styles.link} to="/login">Login!</Link></p> <br/>
      <div className={styles.mainFieldset}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">username</label> <br/>
          <motion.input className={styles.username}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.9}}
                        type="text"
                        id="username"
                        defaultValue={formData.name}
                        onChange={handleChange}
                        name="username"
                        required placeholder="/:"/>
          <br/>
          <label htmlFor="email">e-mail</label> <br/>
          <motion.input type="email"
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.9}}
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        name="email"
                        required placeholder="/:"/>
          <br/>
          <label htmlFor="password">password</label> <br/>
          <motion.input type="password"
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.9}}
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        name="password"
                        required placeholder="/:"/>
          <br/>
          <motion.input type="password"
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.9}}
                        id="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        name="confirm_password"
                        required placeholder="repeat /:"/>
          <br/>
          <br/>
          <motion.button type="submit"
                         whileHover={{scale: 1.02}}
                         whileTap={{scale: 0.9}}
                         className={styles.mainButton}>CREATE➢
          </motion.button>
        </form>
      </div>
    </>
  );
}

export default RegisterPage;
