import React from 'react';
import { useState, useEffect } from 'react';

function Square({ value, onSquareClick }) {
  if (value === 0) {
    return <button
      className='water square' onClick={onSquareClick}></button>;
  } else if (value === -1) {
    return <button
      className='land square' onClick={onSquareClick}></button>;
  } else if (value === -2) {
    return <button
      className='tile square' onClick={onSquareClick}></button>;
  } else {
    return <button
      className='land square' onClick={onSquareClick}>{value}</button>;
  }
}


export default function Board() {
  const [startingBoard, setStartingBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [squares, setSquares] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('./games.json');
      const data = await response.json();
      const selectGameID = Math.floor(Math.random() * (data.games.length - 1));
      const firstGame = data.games[selectGameID];
      setStartingBoard(firstGame.board);
      setSolutionBoard(firstGame.solution);
      setSquares(firstGame.board);
    }
    fetchData();
  }, []);


  function calculateRemaining(squares) {
    let [solutionTotal, currentTotal] = [0, 0];
    for (let row = 0; row < solutionBoard.length; row++) {
      for (let col = 0; col < solutionBoard[0].length; col++) {
        if (solutionBoard[row][col] === 0) {
          solutionTotal++;
        }
        if (squares[row][col] === 0) {
          currentTotal++;
        }
      }
    }
    return solutionTotal - currentTotal;
  }

  function checkWinner(squares) {
    const squaresString = JSON.stringify(squares);
    const solutionString = JSON.stringify(solutionBoard);
    if (squaresString === solutionString) {
      return true;
    } else {
      return false;
    }
  }

  const winning = checkWinner(squares);
  let remaining;
  if (winning) {
    remaining = 'WINNER';
  } else {
    remaining = calculateRemaining(squares);
  }

  function handleClick(event, row, col) {
    event.preventDefault();
    if (winning) {
      return;
    }
    const nextSquares = [...squares];
    if (event.button === 0) {
      if (squares[row][col] === 0) {
        nextSquares[row][col] = -1;
      } else if (squares[row][col] === -1) {
        nextSquares[row][col] = -2;
      } else if (squares[row][col] === -2) {
        nextSquares[row][col] = 0;
      }
    } else if (event.button === 2) {
      if (squares[row][col] === 0) {
        nextSquares[row][col] = -2;
      } else if (squares[row][col] === -1) {
        nextSquares[row][col] = 0;
      } else if (squares[row][col] === -2) {
        nextSquares[row][col] = -1;
      }

    }

    setSquares(nextSquares);
  }



  return (
    <div className='board-area'>
      <div className='status'>{remaining}</div>
      <div>
        {squares.map((row, rowIndex) => (
          <div className='board-row' key={rowIndex}>
            {row.map((value, colIndex) => (
              <Square key={colIndex} value={value} onSquareClick={(event) => handleClick(event, rowIndex, colIndex)} onContextMenu={(event) => { event.preventDefault(); handleClick(event, rowIndex, colIndex) }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

}


