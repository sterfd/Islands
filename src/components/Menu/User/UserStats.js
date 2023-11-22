import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export default function UserStats({ isOpen, displayName, gameData }) {
    const [userStats, setUserStats] = useState({});

    // user details component show number of games solved of each type, maybe cute tiles of solved puzzles with times
    // sign out button

    useEffect(() => {
        const stats = gameData.reduce((accumulator, game) => {
            const { id, solve_time_secs, size } = game;
            if (!accumulator[size]) {
                accumulator[size] = {
                    solveCount: 0,
                    totalTime: 0,
                    averageTime: 0,
                };
            }
            accumulator[size].solveCount++;
            accumulator[size].totalTime += solve_time_secs;
            return accumulator;
        }, {});

        for (const size in stats) {
            stats[size].averageTime = stats[size].totalTime / stats[size].solveCount;
        }
        setUserStats(stats);
        console.log(stats);
    }, [gameData]);

    if (!isOpen) {
        return null;
    }

    async function userSignOut() {
        try {
            const response = await signOut(auth);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='log-in-page'>
            <h1>Hello {displayName}!</h1>
            <h1>You have solved {gameData.length} games</h1>
            <div className='sign-out-button-container'>
                <button className='main signout' onClick={userSignOut}>Sign Out</button>
            </div>
            <div className='main-button-container'>
                <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
                </Link>
            </div>
        </div>
    );
}