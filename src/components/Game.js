import React, { useState, useEffect } from 'react';
import _ from 'lodash'; // deep copying arrays
import { Board } from './Board';
import { NewGame } from './NewGame';

export function Game() {
    const [squares, setSquares] = useState([]);
    const [startingBoard, setStartingBoard] = useState([]);
    const [solutionBoard, setSolutionBoard] = useState([]);

    function handlePlay(nextSquares) {
        setSquares(nextSquares);
    }

    function restartGame(startingBoard) {
        const startingCopy = _.cloneDeep(startingBoard);
        setSquares(startingCopy);
    }

    async function getNewGame() {
        const { starting, solution } = await NewGame();
        setStartingBoard(starting);
        setSolutionBoard(solution);
        setSquares(_.cloneDeep(starting));
    }

    useEffect(() => {
        getNewGame()
    }, []);

    return (
        <div className='game'>
            <div className='game-board'>
                <Board squares={squares} onPlay={handlePlay} solution={solutionBoard} />
            </div>
            <div className='game-menu'>
                <button className='menu restart' onClick={() => restartGame(startingBoard)}>Restart</button>
                <button className='menu new-game' onClick={() => getNewGame()}>New Game</button>
            </div>
        </div>
    );
}
