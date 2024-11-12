import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from "react-router-dom";
import DataFetcher from '../components/DataFetcher.jsx';
import Creator from '../creator/creator.jsx';
import CourseRenderer from "../viewer/viewer.jsx";
import {motion} from 'framer-motion';
import HeaderImage from '../assets/HomepageHeader.png';

function HomePage() {
    const navigate = useNavigate();
    const navigateToCreator = () => {
        navigate('/creator');
    };

    const navigateToCourse = () => {
        navigate('/course');
    }

    const logout = () => {
        localStorage.removeItem("userToken");
    }

    let token = localStorage.getItem("userToken");
    console.log(token);


    return (
        <div className="HomePage">
            <h3>Welcome, username</h3>
            <button onClick={logout}>Logout</button>
            <img src={HeaderImage}/>
            <input placeholder={'search on Flare'}></input>
            <motion.button
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                onClick={navigateToCreator}
                className="App__button App__button--create"
            >
                Create
            </motion.button>
            <br/>

            <motion.button
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                onClick={navigateToCourse}
                className="App__button App__button--course"
            >
                Course
            </motion.button>
            <br/>
        </div>
    )
}

export default HomePage;