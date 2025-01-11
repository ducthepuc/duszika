import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import DefaultPfp from '../assets/default_pfp.jpg';
import Card from '../../components/Card/Card';

const UserPanel = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(DefaultPfp);
    const [bio, setBio] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [userCourses, setUserCourses] = useState([]);
    const [stars, setStars] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
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

                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }

                const userData = await response.json();
                setUsername(userData.username);
                setBio(userData.bio || '');
                setProfilePicture(userData.profilePicture || DefaultPfp);

                // Fetch user courses using the user ID
                const coursesResponse = await fetch(`http://localhost:5000/api/user/${userData.id}/courses`, {
                    headers: {
                        'Authorization': user_token
                    }
                });

                if (coursesResponse.ok) {
                    const coursesData = await coursesResponse.json();
                    setUserCourses(coursesData.courses);
                } else {
                    console.error('Failed to fetch user courses:', coursesResponse.statusText);
                }

                // Fetch star count
                const starsResponse = await fetch(`http://localhost:5000/api/user/${userData.id}/stars`, {
                    headers: {
                        'Authorization': user_token
                    }
                });

                if (starsResponse.ok) {
                    const starsData = await starsResponse.json();
                    setStars(starsData.stars);
                } else {
                    console.error('Failed to fetch star count:', starsResponse.statusText);
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                localStorage.removeItem("userToken");
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{username}</h2>
            <p>{bio}</p>
            <img src={profilePicture} alt="Profile" />

            <h3>Stars: {stars}</h3>

            {/* User Courses */}
            <h3>My Courses</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {userCourses.length > 0 ? (
                    userCourses.map((course) => (
                        <Card 
                            key={course.id}
                            card={[course.id, course.title, course.creator, course.tags]}
                            onClick={() => navigate(`/viewer/${course.id}`)}
                            onEdit={() => navigate('/creator', { state: { course } })}
                            isCreator={true}
                        />
                    ))
                ) : (
                    <p>No courses created yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserPanel;
