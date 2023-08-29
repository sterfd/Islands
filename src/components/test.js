import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';

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

async function NewGame() {
    const { data } = await axios.get('http://localhost:8888/games');
    console.log(data);
    const starting = JSON.parse(data.board);
    const solution = JSON.parse(data.solution);
    return { starting, solution };
}

function Game() {
    const [squares, setSquares] = useState([]);
    const [startingBoard, setStartingBoard] = useState([]);
    const [solutionBoard, setSolutionBoard] = useState([]);

    useEffect(() => {
        getNewGame();
    }, []);

    // if (startingBoard.length === 0 || solutionBoard.length === 0) {
    //     return <div>Loading...</div>;
    // }
    async function getNewGame() {
        const { starting, solution } = await NewGame();
        setStartingBoard(starting);
        setSolutionBoard(solution);
        setSquares(_.cloneDeep(starting));
    }

    function restartGame(startingBoard) {
        const startingCopy = _.cloneDeep(startingBoard);
        setSquares(startingCopy);
    }
    return (
        <div className='game'>
            <div className='game-board'>
                <Board squares={squares} />
            </div>
            <div className='game-menu'>
                <button className='menu restart' onClick={() => restartGame(startingBoard)}>Restart</button>
                <button className='menu new-game' onClick={() => getNewGame()}>New Game</button>
            </div>
        </div>
    );
}

export { Square, Board, NewGame, Game };