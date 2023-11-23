import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import UserAuth from './UserAuth';
import UserStats from './UserStats';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export default function User() {
    const [gameData, setGameData] = useState([]);
    const [username, setUsername] = useState(null);

    async function handleSignOut() {
        try {
            const response = await signOut(auth);
            console.log(response);
            setUsername(null);
        } catch (error) {
            console.log(error);
        }
    }
    // 

    function handleSignIn(displayName) {
        setUsername(displayName);
    }

    // if signed out - show log in or sign up page
    useEffect(() => {
        async function getUser() {
            try {
                const auth = getAuth()
                const user = auth.currentUser;
                if (user) {
                    setUsername(user.displayName);
                    const response = await axios.get('http://localhost:8888/users/' + user.uid);
                    setGameData(response.data);
                    console.log('displaying data for', user.displayName);
                    console.log(response.data);
                } else {
                    setUsername(null);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getUser();
    }, [username]);


    return (
        <div>
            <UserAuth needsAuth={username == null} onSignIn={handleSignIn} />
            <UserStats isOpen={username != null} displayName={username} gameData={gameData} onSignOut={handleSignOut} />
        </div>
    );

}