import React from 'react';
import { useState } from 'react';

const startingBoard = [
  [5, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 3, 1, 1],
  [1, 3, 1, 5, 1],
  [1, 1, 1, 1, 1]
];

const solutionBoard = [
  [5, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [1, 0, 3, 0, 0],
  [1, 3, 0, 5, 0],
  [0, 0, 0, 0, 0]
];

function Square({ value, onSquareClick }) {
  if (value === 0) {
    return <button
      className='filled' onClick={onSquareClick}></button>;
  } else if (value === 1) {
    return <button
      className='empty' onClick={onSquareClick}></button>;
  } else if (value === 5) {
    return <button
      className='empty' onClick={onSquareClick}>1</button>;
  } else {
    return <button
      className='empty' onClick={onSquareClick}>{value}</button>;
  }
}


export default function Board() {
  const [squares, setSquares] = useState(startingBoard);

  function handleClick(row, col) {
    const nextSquares = [...squares];
    if (squares[row][col] === 0) {
      nextSquares[row][col] = 1;
    } else if (squares[row][col] === 1) {
      nextSquares[row][col] = 0;
    }
    setSquares(nextSquares);
  }

  return (
    <div>
      {squares.map((row, rowIndex) => (
        <div className='board-row' key={rowIndex}>
          {row.map((value, colIndex) => (
            <Square key={colIndex} value={value} onSquareClick={() => handleClick(rowIndex, colIndex)} />
          ))}
        </div>
      ))}
    </div>
  );
}


