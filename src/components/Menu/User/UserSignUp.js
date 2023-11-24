import React, { useState } from 'react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import axios from 'axios';

export default function SignUp({ isSignUpOpen, onSignIn }) {
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const errorMapping = { 'auth/invalid-login-credentials': 'Invalid login credentials', "auth/credential-already-in-use": 'Credential already in use', "auth/email-already-in-use": "This email is being used for another account", "auth/internal-error": "Internal Error", "auth/invalid-email": "Invalid Email", "auth/wrong-password": "Wrong Password", "auth/missing-app-credential": "Missing App Credential", "auth/null-user": "Null User", "auth/rejected-credential": "Rejected Credential", "auth/too-many-requests": "Too many attempted, try again later", "auth/user-not-found": "User not found", "auth/weak-password": "Password is too weak" };


    if (!isSignUpOpen) {
        return null;
    }

    async function signUp(event) {
        event.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, newEmail, newPassword);
            await updateProfile(userCredential.user, { displayName: newUsername });
            const postData = { "user_id": userCredential.user.uid, "display_name": userCredential.user.displayName }
            axios.post('http://localhost:8888/users', postData)
                .then(response => {
                    onSignIn(userCredential.user.displayName);
                })
                .catch(error => {
                    console.log(error);
                });
        } catch (error) {
            if (error.code in errorMapping) {
                setErrorMessage(errorMapping[error.code]);
            }
            console.log(error);
        };
    }

    return (
        <div>
            <div className='sign-in-container'>
                <div className='error-messages'>{errorMessage}</div>
                <form id='sign-up-tab' onSubmit={signUp}>
                    <div className='user-form'>
                        <input id='sign-up-display-name' type='text' placeholder='Display name' value={newUsername} onChange={(event) => setNewUsername(event.target.value)}></input>
                    </div>
                    <div className='user-form'>
                        <input id='sign-up-email' type='email' placeholder='Email' value={newEmail} onChange={(event) => setNewEmail(event.target.value)}></input>
                    </div>
                    <div className='user-form'>
                        <input id='sign-up-password' type='password' placeholder='Password' value={newPassword} onChange={(event) => setNewPassword(event.target.value)}></input>
                    </div>
                    <button type='submit' className='main about'>Sign Up</button>
                </form>
            </div >
        </div >
    );
}