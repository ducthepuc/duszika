import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import DefaultPfp from '../assets/default_pfp.jpg';
import { Input } from 'reactstrap';

const Card = ({ children, onClick }) => {
    return (
        <motion.div 
            style={{ backgroundColor: '#FF6B35', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}
            whileHover={{ scale: 1.05, backgroundColor: '#FF7F4F'}}
            whileTap={{ scale: 0.95, backgroundColor: 'rgb(240, 240, 240)' }}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

export const fetchUsername = async (navigate, setUsername, setIsLoading, setPfp) => {
    const user_token = localStorage.getItem("userToken");

    if (!user_token) {
        navigate('/login');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': user_token
            }
        });

        const responseData = await response.text();

        if (!response.ok) {
            throw new Error(`Failed to fetch user details: ${responseData}`);
        }

        const userData = JSON.parse(responseData);
        setUsername(userData.username);
        setPfp(userData.profilePicture);
        setIsLoading(false);

    } catch (error) {
        console.error("Error:", error);
        localStorage.removeItem("userToken");
        navigate('/login');
    }
};

const HomePage = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [filteredCards, setFilteredCards] = useState([]);
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [profilePicture, setPfp] = useState(DefaultPfp);

    const logout = () => {
        localStorage.removeItem("userToken");
        setUsername('');
        setIsLoading(true);
        navigate('/login');
    };

    const getCourseNames = async () => {
        try {
            const response = await fetch('/api/get_course_names');
            if (response.ok) {
                const data = await response.json();
                const courseNames = data.course_names;
                const courses = courseNames.map((courseName, index) => ({
                    id: index + 1,
                    title: courseName
                }));
                setCourses(courses);
            } else {
                console.error('Failed to fetch course names:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching course names:', error);
        }
    };

    useEffect(() => {
        getCourseNames();
    }, []);

    useEffect(() => {
        const filtered = courses.filter((card) => 
            card.title.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredCards(filtered);
    }, [searchInput, courses]);

    useEffect(() => {
        fetchUsername(navigate, setUsername, setIsLoading, setPfp);
    }, [navigate]);

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    };

    const handleCourseClick = (courseTitle) => {
        navigate(`/viewer/${courseTitle}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            {/* Header Section */}
            <header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                    <h3>Welcome, {username || 'Guest'}</h3>
                    <div>
                        <img
                            src={profilePicture}
                            alt="Profile" 
                            style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
                            onClick={() => navigate('/panel')}
                        />
                        <br />
                        <button 
                            onClick={logout} 
                            style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Centered Search Bar */}
            <div style={{ margin: '20px 0' }}>
                <motion.input
                    type="text" 
                    placeholder="Search courses..."
                    value={searchInput} 
                    onChange={handleSearch}
                    style={{ color: 'rgb(240, 240, 240)', backgroundColor: '#333333',padding: '10px', width: '100%', maxWidth: '600px', margin: '0 auto', display: 'block', border: '1px solid #555' }}
                    whileHover={{ scale: 1.05, border: '1px solid #FF7F4F' }}
                />
            </div>

            {/* Action Button */}
            <div style={{ margin: '20px 0' }}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/creator')}
                    style={{ padding: '10px 20px', cursor: 'pointer' }}
                >
                    Create Course
                </motion.button>
            </div>

            {/* Course Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {filteredCards.map((card) => (
                    <Card key={card.id} onClick={() => handleCourseClick(card.title)}>
                        <div style={{ padding: '10px' }}>
                            <h4 style={{ color: 'black' }}>{card.title}</h4>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
