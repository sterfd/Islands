import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import axios from 'axios';
import UserAuth from './UserAuth';
import UserStats from './UserStats';
// import { signOut } from 'firebase/auth';
// import { auth } from '../../firebase';

export default function User() {
    const [gameData, setGameData] = useState([]);
    const [username, setUsername] = useState(null);
    const auth = getAuth()

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

    useEffect(() => {
        async function getUser() {
            try {
                const user = auth.currentUser;
                if (user) {
                    setUsername(user.displayName);
                    const response = await axios.get('https://sterfd-islands-7f98ffd68a4e.herokuapp.com/users/' + user.uid);
                    setGameData(response.data);
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
            <UserAuth needsAuth={username === null} onSignIn={handleSignIn} />
            <UserStats isOpen={username != null} displayName={username} gameData={gameData} onSignOut={handleSignOut} />
        </div>
    );

}