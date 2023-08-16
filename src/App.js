import React from 'react';
import { useState, useEffect } from 'react';
import _ from 'lodash';

function Square({ value, onSquareClick }) {
  if (value === 0) {
    return <button
      className='water square' onClick={onSquareClick} onContextMenu={onSquareClick}></button>;
  } else if (value === -1) {
    return <button
      className='land square' onClick={onSquareClick} onContextMenu={onSquareClick}></button>;
  } else if (value === -2) {
    return <button
      className='tile square' onClick={onSquareClick} onContextMenu={onSquareClick}></button >;
  } else {
    return <button
      className='land square' onClick={onSquareClick} onContextMenu={onSquareClick}>{value}</button>;
  }
}

function checkWinner(squares, solution) {
  const squaresString = JSON.stringify(squares);
  const solutionString = JSON.stringify(solution);
  if (squaresString === solutionString) {
    return true;
  } else {
    return false;
  }
}

function Board({ squares, onPlay, solution }) {
  const winning = checkWinner(squares, solution);
  let remaining;
  if (winning) {
    remaining = 'WINNER';
  }

  function handleClick(event, row, col) {
    event.preventDefault();
    if (winning) {
      return;
    }
    const nextSquares = [...squares];
    if (event.button === 0) {
      if (squares[row][col] === 0) {
        nextSquares[row][col] = -2;
      } else if (squares[row][col] === -1) {
        nextSquares[row][col] = 0;
      } else if (squares[row][col] === -2) {
        nextSquares[row][col] = -1;
      }
    } else if (event.button === 2) {
      if (squares[row][col] === 0) {
        nextSquares[row][col] = -1;
      } else if (squares[row][col] === -1) {
        nextSquares[row][col] = -2;
      } else if (squares[row][col] === -2) {
        nextSquares[row][col] = 0;
      }
    }
    onPlay(nextSquares);
  }

  return (
    <div className='board-area'>
      <div className='status'>{remaining}</div>
      <div>
        {squares.map((row, rowIndex) => (
          <div className='board-row' key={rowIndex}>
            {row.map((value, colIndex) => (
              <Square key={colIndex} value={value} onSquareClick={(event) => handleClick(event, rowIndex, colIndex)} />
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

export default function Game() {
  const [squares, setSquares] = useState([]);
  const [startingBoard, setStartingBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);

  useEffect(() => {
    getNewGame()
  }, []);

  function handlePlay(nextSquares) {
    setSquares(nextSquares);
  }

  function restartGame(startingBoard) {
    const startingCopy = _.cloneDeep(startingBoard);
    setSquares(startingCopy);
  }

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
        <Board squares={squares} onPlay={handlePlay} solution={solutionBoard} />
      </div>
      <div className='game-menu'>
        <button className='menu restart' onClick={() => restartGame(startingBoard)}>Restart</button>
        <button className='menu new-game' onClick={() => getNewGame()}>New Game</button>
      </div>
    </div>
  );
}