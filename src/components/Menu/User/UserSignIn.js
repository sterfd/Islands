import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignIn({ isSignInOpen }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!isSignInOpen) {
        return null;
    }

    async function signIn(event) {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
        } catch (error) {
            console.log(error);
        };
        setEmail('');
        setPassword('');
    }


    return (
        <div>
            <div className='sign-in-container'>
                <div className='error-messages'>oh no</div>
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