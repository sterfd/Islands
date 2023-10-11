import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function SignUp({ isSignUpOpen }) {
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');

    if (!isSignUpOpen) {
        return null;
    }

    async function signUp(event) {
        event.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, newEmail, newPassword);
            updateProfile(auth.currentUser, { displayName: newUsername });
            console.log(userCredential);
        } catch (error) {
            console.log(error);
        };
        setNewEmail('');
        setNewPassword('');
        setNewUsername('');
    }
    return (
        <div>
            <div className='sign-up-container'>
                <div className='error-messages'></div>
                <form onSubmit={signUp}>
                    <div className='user-form'>
                        <input type='text' placeholder='Display name' value={newUsername} onChange={(event) => setNewUsername(event.target.value)}></input>
                    </div>
                    <div className='user-form'>
                        <input type='email' placeholder='Email' value={newEmail} onChange={(event) => setNewEmail(event.target.value)}></input>
                    </div>
                    <div className='user-form'>
                        <input type='password' placeholder='Password' value={newPassword} onChange={(event) => setNewPassword(event.target.value)}></input>
                    </div>
                    <button type='submit'>Sign Up</button>
                </form>
            </div >
        </div >
    );
}