import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import DefaultPfp from '../assets/default_pfp.jpg';
import {motion} from 'framer-motion';

const UserPanel = () => {
    const navigate = useNavigate();

    // State variables
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(DefaultPfp);
    const [bio, setBio] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState({
        bio: false,
        profilePicture: false
    });

    // Fetch user data on component mount
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
                console.log(userData)
                setUsername(userData.username);
                setBio(userData.bio || '');

                // Set profile picture. If user hasn't uploaded a profile picture, use DefaultPfp
                setProfilePicture(userData.profilePicture || DefaultPfp);

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                localStorage.removeItem("userToken");
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    // Handle profile picture upload
    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('pfp', file);

        try {
            const user_token = localStorage.getItem("userToken");
            const response = await fetch('http://localhost:5000/api/change_pfp', {
                method: 'POST',
                headers: {
                    'Authorization': user_token
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload profile picture');
            }

            const result = await response.json();
            setProfilePicture(result.profilePictureUrl || DefaultPfp);
            setIsEditing(prev => ({ ...prev, profilePicture: false }));
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            alert('Failed to upload profile picture');
        }
    };

    // Handle bio update
    const handleBioUpdate = async () => {
        try {
            const user_token = localStorage.getItem("userToken");
            const response = await fetch('http://localhost:5000/api/v1/configure', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user_token
                },
                body: JSON.stringify({"bio": bio })
            });

            if (!response.ok) {
                throw new Error('Failed to update bio');
            }

            setIsEditing(prev => ({ ...prev, bio: false }));
        } catch (error) {
            return;
        }
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img
                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                    src={profilePicture}
                    alt="Profile"
                />
                {isEditing.profilePicture ? (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        style={{ marginTop: '10px', backgroundColor: '#FF6B35' }}
                    />
                ) : (
                    <button
                        onClick={() => setIsEditing(prev => ({ ...prev, profilePicture: true }))}
                        style={{
                            marginTop: '10px',
                            padding: '8px 16px',
                            backgroundColor: '#FF6B35',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Change Profile Picture
                    </button>
                )}
            </div>

            <div style={{ width: '100%', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '10px' }}>Welcome, {username}!</h2>

                <div style={{ marginBottom: '20px' }}>
                    {isEditing.bio ? (
                        <>
                            <motion.textarea
                                style={{
                                    width: '75%',
                                    height: '250px',
                                    padding: '12px',
                                    marginBottom: '16px',
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    backgroundColor: '#333333',
                                    color: 'white',
                                    outline: 'none',
                                    resize: 'none',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    fontSize: '16px',
                                }}
                                whileHover={{
                                    backgroundColor: '#444444',
                                }}
                                whileFocus={{
                                    backgroundColor: '#555555',
                                    border: '1px solid #FF7F4F',
                                }}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Enter your bio"
                            />
                            <div>
                                <button
                                    onClick={handleBioUpdate}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginRight: '10px'
                                    }}
                                >
                                    Save Bio
                                </button>
                                <button
                                    onClick={() => setIsEditing(prev => ({ ...prev, bio: false }))}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p style={{ marginBottom: '10px', fontStyle: 'italic' }}>{bio || 'No bio set'}</p>
                            <button
                                onClick={() => setIsEditing(prev => ({ ...prev, bio: true }))}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#FF6B35',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Edit Bio
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserPanel;
