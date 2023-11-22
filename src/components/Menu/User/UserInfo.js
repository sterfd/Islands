import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import UserAuth from './UserAuth';
import UserStats from './UserStats';

export default function User() {
    const [gameData, setGameData] = useState([]);
    const [username, setUsername] = useState(null);
    const [userIn, setUserIn] = useState(false);

    // if signed in - 
    // user details component show number of games solved of each type, maybe cute tiles of solved puzzles with times
    // sign out button
    // 

    // if signed out - show log in or sign up page
    useEffect(() => {
        async function getUser() {
            try {
                const auth = getAuth()
                const user = auth.currentUser;
                if (user) {
                    setUsername(user.displayName);
                    setUserIn(true);
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
    }, []);


    return (
        <div>
            <UserAuth needsAuth={username == null} />
            <UserStats isOpen={username != null} displayName={username} gameData={gameData} />
        </div>
    );

}