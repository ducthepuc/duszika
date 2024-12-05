import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import DefaultPfp from '../assets/default_pfp.jpg';

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
                const response = await fetch('http://localhost:5000/api/get_user_by_token', {
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
                if (userData.result) {
                    const response2 = await fetch(`http://localhost:5000/api/users/${userData.id}`)
                    if (!response2.ok) {
                        throw new Error('Failed to fetch user details');
                    }

                    const profileData = await response2.json()

                    setUsername(profileData.name);
                    setBio(profileData.bio || '');

                    setProfilePicture(`http://localhost:5000/cdn/pfp/${userData.id}`)

                    setIsLoading(false);
                }else {
                    // Add code when user is failed to be loaded
                }


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
        formData.append('pfp', file);  // Changed from 'profilePicture' to 'pfp'

        try {
            const user_token = localStorage.getItem("userToken");
            const response = await fetch('http://localhost:5000/api/v1/upload_pfp', {  // Fixed URL
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
            console.log(result)

            if (result.result) {
                setProfilePicture(`http://localhost:5000/cdn/pfp/${response.uid}`);
                setIsEditing(prev => ({ ...prev, profilePicture: true }));
            } else {
                // Add stuff when it failed.
                setIsEditing(prev => ({ ...prev, profilePicture: false }));
            }


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
                body: JSON.stringify({ 'bio': bio })
            });

            if (!response.ok) {
                throw new Error('Failed to update bio');
            }

            setIsEditing(prev => ({ ...prev, bio: false }));
        } catch (error) {
            console.error("Error updating bio:", error);
            alert('Failed to update bio');
        }
    };

    if (isLoading) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div className="user-panel-container">
            <div className="profile-header">
                <div className="profile-picture-section">
                    <img
                        className="profile-picture"
                        src={profilePicture}
                        alt="Profile"

                        width={200}
                        height={200}
                    />
                    {isEditing.profilePicture ? (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureUpload}
                            className="profile-picture-upload"
                        />
                    ) : (
                        <button
                            className="edit-profile-picture-btn"
                            onClick={() => setIsEditing(prev => ({ ...prev, profilePicture: true }))}
                        >
                            Change Profile Picture
                        </button>
                    )}
                </div>

                <div className="user-info-section">
                    <h2 className="username">Welcome, {username}</h2>

                    <div className="bio-section">
                        {isEditing.bio ? (
                            <>
                                <textarea
                                    className="bio-textarea"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Enter your bio"
                                />
                                <div className="bio-action-buttons">
                                    <button
                                        className="save-bio-btn"
                                        onClick={handleBioUpdate}
                                    >
                                        Save Bio
                                    </button>
                                    <button
                                        className="cancel-bio-btn"
                                        onClick={() => setIsEditing(prev => ({ ...prev, bio: false }))}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="bio-text">{bio || 'No bio set'}</p>
                                <button
                                    className="edit-bio-btn"
                                    onClick={() => setIsEditing(prev => ({ ...prev, bio: true }))}
                                >
                                    Edit Bio
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPanel;