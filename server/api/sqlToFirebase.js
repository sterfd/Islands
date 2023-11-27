import React from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, set } from "firebase/database";
import axios from 'axios';


export default function About() {
    async function getNewGame(boardSize, userID) {
        const { data } = await axios.get('http://localhost:8888/allgames/');
        for (let i = 0; i < data.length; i++) {
            const gameID = JSON.parse(data[i].id);
            const starting = JSON.parse(data[i].board);
            const solution = JSON.parse(data[i].solution);
            writeGameData(gameID, boardSize, starting, solution);
        }
    }

    function writeGameData(gameId, gameSize, start, sol) {
        const db = getDatabase();

        set(ref(db, 'games/' + gameId), {
            size: gameId,
            board: start,
            solution: sol
        })
            .then(() => {
                console.log('saved', gameId);
            })
            .catch((error) => {
                console.log('err', error);
            });
    }


    return (
        <div className='sub-menu'>
            <p>This game is based on Nurikabe by the publisher Nikoli!</p>
            <p>A fun project made in React by sterfd.</p>
            <button onClick={() => getNewGame(5, null)}>Write All Game Data</button>
            <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
            </Link>
        </div>
    );

}