import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthDetails from './AuthDetails';
import SignIn from './UserSignIn';
import SignUp from './UserSignUp'
// import { escape } from 'lodash';

export default function User() {
    const [logInOpen, setLogInOpen] = useState(true);

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

    // if signed in - show number of games solved of each type, maybe cute tiles of solved puzzles with times
    // if signed out - show log in or sign up page

    return (
        <div className='log-in-page'>
            <div className='login-tab'>
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
    );

}