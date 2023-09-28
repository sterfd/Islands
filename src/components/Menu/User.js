import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function User() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function signIn(event) {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
        } catch (error) {
            console.log(error);
        };
    }

    return (
        <div className='sub-menu'>
            <p>User Auth Page</p>
            <div className='sign-in-container'>
                <form onSubmit={signIn}>
                    <h1>Log In</h1>
                    <input type='email' placeholder='Enter your email' value={email} onChange={(event) => setEmail(event.target.value)}></input>
                    <input type='password' placeholder='Enter your password' value={password} onChange={(event) => setPassword(event.target.value)}></input>
                    <button type='submit'>Log In</button>
                </form>
            </div>

            <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
            </Link>
        </div>
    );

}