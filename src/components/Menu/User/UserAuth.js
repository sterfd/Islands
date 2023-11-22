import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthDetails from './AuthDetails';
import SignIn from './UserSignIn';
import SignUp from './UserSignUp'

export default function User({ needsAuth }) {
    // NEED TO SEND USER TO USERSTATS PAGE WHEN SIGNED IN

    const [logInOpen, setLogInOpen] = useState(true);

    if (!needsAuth) {
        return null;
    }

    function changeTab(tab) {
        const loginTab = document.getElementById('login');
        const signUpTab = document.getElementById('signup');
        if (tab === 'logIn') {
            setLogInOpen(true);
            loginTab.classList.remove('inactive');
            signUpTab.classList.add('inactive');
        } else {
            setLogInOpen(false);
            loginTab.classList.add('inactive');
            signUpTab.classList.remove('inactive');
        }
    }


    return (
        <div>
            {needsAuth && (
                <div className='log-in-page'>
                    <div className='login-tab'>
                        <p> {needsAuth}</p>
                        <button className='user-tab' id='login' onClick={() => changeTab('logIn')}>Log In</button>
                        <div className='vertical-line'></div>
                        <button className='user-tab inactive' id='signup' onClick={() => changeTab('signUp')}>Sign Up</button>
                    </div>
                    <SignIn isSignInOpen={logInOpen} />
                    <SignUp isSignUpOpen={!logInOpen} />
                    <AuthDetails />
                    <div className='main-button-container'>
                        <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
                        </Link>
                    </div>
                </div >
            )};
        </div>
    );

}