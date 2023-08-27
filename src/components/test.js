import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import '../css/board.css';

function Square({ value }) {
    if (value === -2) {
        return <button
            className='tile square'></button >;
    } else {
        return <button
            className='land square' >{value}</button>;
    }
}

function Board({ squares, onPlay, solution }) {
    return (
        <div className='board-area'>
            <div>
                {squares.map((row, rowIndex) => (
                    <div className='board-row' key={rowIndex}>
                        {row.map((value, colIndex) => (
                            <Square key={colIndex} value={value} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

async function fetchData() {
    const response = await fetch('./games.json');
    const data = await response.json();
    return data;
}

async function NewGame() {
    const gameData = await fetchData();
    const selectedGameID = Math.floor(Math.random() * (gameData.games.length - 1));
    const selectedGame = gameData.games[selectedGameID];
    const starting = selectedGame.board;
    const solution = selectedGame.solution;
    const initialSquares = _.cloneDeep(starting);

    return { starting, solution, initialSquares };
}

function Game() {
    const [squares, setSquares] = useState([]);
    const [startingBoard, setStartingBoard] = useState([]);
    const [solutionBoard, setSolutionBoard] = useState([]);

    useEffect(() => {
        getNewGame()
    }, []);

    function getNewGame() {
        NewGame().then(({ starting, solution, initialSquares }) => {
            setStartingBoard(starting);
            setSolutionBoard(solution);
            setSquares(initialSquares);
        });
    }

    if (startingBoard.length === 0 || solutionBoard.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className='game'>
            <div className='game-board'>
                <Board squares={squares} />
            </div>
        </div>
    );
}

export { Square, Board, NewGame, Game };