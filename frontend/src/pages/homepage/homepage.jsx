import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import HeaderImage from '../assets/HomepageHeader.png';
import DefaultPfp from '../assets/default_pfp.jpg'

const Card = ({ children }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {children}
        </div>
    );
};

const Badge = ({ children }) => {
    return (
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {children}
        </span>
    );
};

export const fetchUsername = async (navigate, setUsername, setIsLoading) => {
    const user_token = localStorage.getItem("userToken");
    console.log("Token from localStorage:", user_token); // Debug log

    if (!user_token) {
        navigate('/login');
        return;
    }

    try {
        console.log("Sending request with token...");
        const response = await fetch('http://localhost:5000/api/get_user_by_token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': user_token
            }
        });

        console.log("Response status:", response.status); // Debug log

        const responseData = await response.text();
        console.log("Raw response:", responseData); // Debug log

        if (!response.ok) {
            throw new Error(`Failed to fetch user details: ${responseData}`);
        }

        const userData = JSON.parse(responseData);
        console.log("Parsed user data:", userData); // Debug log

        setUsername(userData.username);
        setIsLoading(false);
    } catch (error) {
        console.error("Detailed error:", error); // More detailed error logging
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

    const sampleCards = [
        { id: 1, title: "Introduction to React", description: "Learn the basics of React development", tags: ["react", "javascript", "frontend"], image: "/api/placeholder/300/200" },
        { id: 2, title: "Advanced CSS Techniques", description: "Master modern CSS and animations", tags: ["css", "web", "design"], image: "/api/placeholder/300/200" },
        { id: 3, title: "Node.js Fundamentals", description: "Server-side JavaScript development", tags: ["nodejs", "backend", "javascript"], image: "/api/placeholder/300/200" }
    ];

    useEffect(() => {
        setFilteredCards(sampleCards);
    }, []);

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchInput(searchTerm);

        const filtered = sampleCards.filter(card => {
            const searchString = [card.title, card.description, ...card.tags].join(' ').toLowerCase();
            return searchString.includes(searchTerm);
        });

        setFilteredCards(filtered);
    };

    useEffect(() => {
        fetchUsername(navigate, setUsername, setIsLoading);
    }, [navigate]);

    return (
        <div className="">
            <div className="">
                <h3 className="">
                    Welcome, {username || 'Guest'}
                </h3>
                <img src={DefaultPfp} alt={'pfp'} onClick={() => navigate('/panel')}/>
                <button
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }}
                    className=""
                >
                    Logout
                </button>
            </div>

            <div className="mb-8">
                <img
                    src={HeaderImage}
                    alt="Header"
                    className=""
                />
            </div>

            <div className="relative mb-8">
                <input
                    type="text"
                    placeholder="Search courses, tags, or descriptions..."
                    value={searchInput}
                    onChange={handleSearch}
                    className=""
                />
            </div>

            <div className="flex gap-4 mb-8">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/creator')}
                    className=""
                >
                    Create
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/course')}
                    className=""
                >
                    Course
                </motion.button>
            </div>

            {/* Cards Grid */}
            <div className="">
                {filteredCards.map((card) => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Card>
                            <img
                                src={card.image}
                                alt={card.title}
                                className=""
                            />
                            <div className="p-4">
                                <h4 className="">{card.title}</h4>
                                <p className="">{card.description}</p>
                                <div className="">
                                    {card.tags.map((tag, index) => (
                                        <Badge key={index}>
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;