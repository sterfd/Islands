import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';


export default function About() {
    const [gameData, setGameData] = useState([]);
    const [userStats, setUserStats] = useState({});

    useEffect(() => {
        async function getUser() {
            try {
                const auth = getAuth()
                const user = auth.currentUser;
                let authUser;
                if (user) {
                    authUser = user.uid;
                } else {
                    authUser = null;
                }
                const response = await axios.get('http://localhost:8888/users/' + authUser);
                setGameData(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        getUser();
    }, []);

    useEffect(() => {
        const stats = gameData.reduce((accumulator, game) => {
            const { id, solve_time_secs, size } = game;
            console.log(game);
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
            console.log('size', size);
            stats[size].averageTime = stats[size].totalTime / stats[size].solveCount;
        }
        console.log('stats', stats);
        setUserStats(stats);
        console.log('userstats', userStats);
    }, [gameData]);

    return (
        <div className='sub-menu'>
            <p>This game is based on Nurikabe by the publisher Nikoli!</p>
            <p>A fun project made in React by sterfd.</p>
            <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
            </Link>
        </div>
    );

}