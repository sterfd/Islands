import React from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, child, get, set } from "firebase/database";
import axios from 'axios';


export default function About() {


    async function getNewGame(userID) {
        const { data } = await axios.get('http://localhost:8888/allgames/');
        for (let i = 0; i < data.length; i++) {
            const gameID = JSON.parse(data[i].id);
            const starting = JSON.parse(data[i].board);
            const solution = JSON.parse(data[i].solution);
            const size = JSON.parse(data[i].board).length;
            writeAllGames(gameID, size, starting, solution);
        }
    }

    function writeAllGames(gameId, gameSize, start, sol) {
        const db = getDatabase();
        set(ref(db, 'games/' + gameId), {
            size: gameSize,
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

    function getAllGames() {
        const db = ref(getDatabase());
        get(child(db, 'games/')).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                Object.keys(data).forEach((gameId) => {
                    const gameData = data[gameId];
                    // console.log('Game ID:', gameId);
                    // console.log('Game Data:', gameData);
                    const { board, size, solution } = gameData;
                    // console.log('Board:', board);
                    // console.log('Size:', size);
                    // console.log('Solution:', solution);
                    if (size === 9) {
                        console.log(gameId)
                        //     for (let i = 0; i < 9; i++) {
                        //         console.log(board[i]);

                        //     }
                        // }
                        console.log(board);
                        console.log(board[0][0], board[8][8]);
                    }

                });
            } else {
                console.log("no data here");
            }
        }).catch((err) => {
            console.log(err);
        });
    }



    return (
        <div className='sub-menu'>
            <p>This game is based on Nurikabe by the publisher Nikoli!</p>
            <p>A fun project made in React by sterfd.</p>
            <button onClick={() => getAllGames()}>Read All Game Data</button>
            <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
            </Link>
        </div>
    );

}