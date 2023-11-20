import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';


export default function About() {
    async function getUser() {
        try {
            const auth = getAuth()
            const user = auth.currentUser;
            let authUser;
            if (user) {
                authUser = user.uid;
            } else {
                authUser = null;
            }
            console.log(authUser)
            const response = await axios.get('http://localhost:8888/users/' + authUser);
            if (response) {
                console.log('response', response.data);
                // const { uid, dp } = response.data[0];
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className='sub-menu'>
            <p>This game is based on Nurikabe by the publisher Nikoli!</p>
            <p>A fun project made in React by sterfd.</p>
            <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
            </Link>
        </div>
    );

}