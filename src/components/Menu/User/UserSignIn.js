import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function SignIn({ isSignInOpen, onSignIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const errorMapping = { 'auth/invalid-login-credentials': 'Invalid login credentials', "auth/credential-already-in-use": 'Credential already in use', "auth/email-already-in-use": "This email is being used for another account", "auth/internal-error": "Internal Error", "auth/invalid-email": "Invalid Email", "auth/wrong-password": "Wrong Password", "auth/missing-app-credential": "Missing App Credential", "auth/null-user": "Null User", "auth/rejected-credential": "Rejected Credential", "auth/too-many-requests": "Too many attempted, try again later", "auth/user-not-found": "User not found", "auth/weak-password": "Password is too weak" };
    const auth = getAuth()

    if (!isSignInOpen) {
        return null;
    }

    async function signIn(event) {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            onSignIn(userCredential.user.displayName);
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
                <form id='sign-in-tab' onSubmit={signIn}>
                    <div className='user-form'>
                        <input id='sign-in-email' type='email' placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)}></input>
                    </div><div className='user-form'>
                        <input id='sign-in-password' type='password' placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)}></input>
                    </div>
                    <button type='submit' className='main rule'>Log In</button>
                </form>
            </div>
        </div>
    );
}