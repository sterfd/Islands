import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export default function UserStats({ isOpen, displayName, gameData, onSignOut }) {
    const [userStats, setUserStats] = useState({});

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

    function convertTime(seconds) {
        let timeMessage;
        if (seconds < 60) {
            timeMessage = Math.floor(seconds) + ' seconds';
        } else if (seconds < 3600) {
            timeMessage = Math.floor(seconds / 60) + ' minutes and ' + seconds % 60 + ' seconds';
        } else {
            timeMessage = Math.floor(seconds / 3600) + ' hours, ' + Math.floor(seconds / 60) + ' minutes and ' + seconds % 60 + ' seconds';
        }
        return timeMessage
    }

    return (
        <div className='log-in-page'>
            <h2>Hello {displayName}!</h2>
            <h1>You have solved {gameData.length} games in total!</h1>
            <div>
                {Object.entries(userStats).map(([size, data]) => (
                    <div className='stat-container'>
                        <button className='stats' key={size}>{size}</button>
                        <ul>
                            <h3>Games solved: {data.solveCount}</h3>
                            <h3>Average solve time: {convertTime(data.averageTime)}</h3>
                        </ul>
                    </div>
                ))}
            </div>

            <div className='sign-out-button-container'>
                <button className='main signout' onClick={onSignOut}>Sign Out</button>
            </div>
            <div className='main-button-container'>
                <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
                </Link>
            </div>
        </div>
    );
}