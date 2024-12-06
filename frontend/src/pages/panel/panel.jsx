import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import DefaultPfp from '../assets/default_pfp.jpg';
import styles from './panel.module.scss'
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
        formData.append('profilePicture', file);

        try {
            const user_token = localStorage.getItem("userToken");
            const response = await fetch('http://localhost:5000/api/upload_profile_picture', {
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
            const response = await fetch('http://localhost:5000/api/update_bio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user_token
                },
                body: JSON.stringify({ bio })
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
        <>
            <div className={styles.UserPanelContainer}>
                <div className={styles.PictureSection}>
                    <img
                        className={styles.ProfilePicture}
                        src={profilePicture}
                        alt="Profile"
                    />
                    {isEditing.profilePicture ? (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureUpload}
                            className={styles.PictureUpload}
                        />
                    ) : (
                        <button
                            className={styles.UploadPicture}
                            onClick={() => setIsEditing(prev => ({ ...prev, profilePicture: true }))}
                        >
                            Change Profile Picture
                        </button>
                    )}
                </div>

                <div className={styles.UserInfo}>
                    <h2 className={styles.Username}>Welcome, {username}!</h2>

                    <div className={styles.Bio}>
                        {isEditing.bio ? (
                            <>
                                <textarea
                                    className={styles.BioTextarea}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Enter your bio"
                                />
                                <div className={styles.BioButtons}>
                                    <button
                                        className={styles.BioSave}
                                        onClick={handleBioUpdate}
                                    >
                                        Save Bio
                                    </button>
                                    <button
                                        className={styles.BioCancel}
                                        onClick={() => setIsEditing(prev => ({ ...prev, bio: false }))}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className={styles.BioText}>{bio || 'No bio set'}</p>
                                <button
                                    className={styles.EditBio}
                                    onClick={() => setIsEditing(prev => ({ ...prev, bio: true }))}
                                >
                                    Edit Bio
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
        );
};

export default UserPanel;