import React from 'react';
import { useState } from 'react';

const startingBoard = [
  [1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 3, 0, 0],
  [0, 3, 0, 1, 0],
  [0, 0, 0, 0, 0]
];

const solutionBoard = [
  [1, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [1, 0, 3, 0, 0],
  [1, 3, 0, 1, 0],
  [0, 0, 0, 0, 0]
];

function Square({ value, onSquareClick }) {
  if (value === 0) {
    return <button
      className='empty' onClick={onSquareClick}>{value}</button>;
  } else {
    return <button
      className='filled' onClick={onSquareClick}></button>;
  }
}

export default function Board() {
  const [squares, setSquares] = useState(Array(5).fill(0));

  function handleClick(i) {
    const nextSquares = [...squares];
    if (squares[i] === 0) {
      nextSquares[i] = 1;
    } else {
      nextSquares[i] = 0;
    }
    setSquares(nextSquares);
  }

  return (
    <div>
      <div className='board-row'>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
      </div>
    </div>
  )
}


