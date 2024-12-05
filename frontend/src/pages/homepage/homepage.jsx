import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import HeaderImage from '../assets/HomepageHeader.png';
import DefaultPfp from '../assets/default_pfp.jpg';

let courses = [];

const MOCK_USERS = [
    { id: 1, username: 'johndoe', name: 'John Doe' },
    { id: 2, username: 'janedoe', name: 'Jane Doe' }
];

const HomePage = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [username, setUsername] = useState('');
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        // Placeholder for fetching username
        setUsername('JohnDoe');

        // Fetch courses from the backend
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/courses');
            const courses = await response.json();
            setCourses(courses);
            setFilteredCourses(courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchInput(searchTerm);

        // Filter courses based on search input
        const filteredCourses = courses.filter(course =>
            course.title.toLowerCase().includes(searchTerm) ||
            course.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        setFilteredCourses(filteredCourses);

        // Filter users based on search input
        const filteredUsers = users.filter(user =>
            user.username.toLowerCase().includes(searchTerm) ||
            user.name.toLowerCase().includes(searchTerm)
        );
        setFilteredUsers(filteredUsers);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Centered Search Bar */}
            <div className="flex justify-center mb-8">
                <div className="relative w-full max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses, users..."
                            value={searchInput}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <AnimatePresence>
                        {searchInput && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                            >
                                {/* Courses Section */}
                                {filteredCourses.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600">
                                            Courses
                                        </div>
                                        {filteredCourses.map(course => (
                                            <motion.div
                                                key={course.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                <div>{course.title}</div>
                                                <div className="text-xs text-gray-500">
                                                    {course.tags.map(tag => `#${tag}`).join(' ')}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {/* Users Section */}
                                {filteredUsers.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600">
                                            Users
                                        </div>
                                        {filteredUsers.map(user => (
                                            <motion.div
                                                key={user.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                            >
                                                <div>
                                                    <div>{user.name}</div>
                                                    <div className="text-xs text-gray-500">@{user.username}</div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* User Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold">
                        Welcome, {username || 'Guest'}
                    </h3>
                </div>
                <img
                    src={DefaultPfp}
                    alt={'Profile'}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    onClick={() => navigate('/panel')}
                />
            </div>

            {/* Header Image */}
            <div className="mb-8">
                <img
                    src={HeaderImage}
                    alt="Header"
                    className="w-full rounded-lg shadow-md"
                />
            </div>
        </div>
    );
};

export default HomePage;