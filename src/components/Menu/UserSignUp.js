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
            await updateProfile(userCredential.user, { displayName: newUsername });
            console.log(userCredential);
            console.log(userCredential.user.uid);
            console.log(userCredential.user.displayName);
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
                <div className='error-messages'>uh oh</div>
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
                    <button type='submit' className='main create'>Create Account</button>
                </form>
            </div >
        </div >
    );
}