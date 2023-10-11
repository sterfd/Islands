import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Tutorial.css';
import { Tutorial2 } from './Tutorial2';
import { Tutorial3 } from './Tutorial3';
import { Tutorial4 } from './Tutorial4';
import { TutSquare } from './TutSquare';


function Tutorial1({ isVisible, toggleIndex }) {
    const squareList = [[[-2, -3, -2], [-2, 1, -2], [-2, -2, -2]],
    [[-2, -4, -2], [-2, 1, -2], [-2, -2, -2]],
    [[-2, 0, -2], [-2, 1, -3], [-2, -2, -2]],
    [[-2, 0, -2], [-2, 1, 0], [-2, -3, -2]],
    [[-2, 0, -2], [-2, 1, 0], [-2, -4, -2]],
    [[-2, 0, -2], [-3, 1, 0], [-2, 0, -2]],
    [[-2, 0, -2], [-4, 1, 0], [-2, 0, -2]],
    [[-2, 0, -2], [0, 1, 0], [-2, 0, -2]]];
    const commandList = ['Click on the empty square', 'Click on it again', 'Right click the empty square', 'Surround the island with water'];
    const [step, setStep] = useState(0);
    const [squares, setSquares] = useState(squareList[step]);

    function textAnimation() {
        const command = document.getElementById('command');
        command.className = 'fadeout';
        setTimeout(() => {
            command.className = 'fade1'
            command.textContent = commandList[step + 1];
        }, 1000);
    }

    function nextAnimation() {
        const command = document.getElementById('command');
        const i1 = document.getElementById('i1');
        const i2 = document.getElementById('i2');
        i1.className = 'fadeout'
        i2.className = 'fadeout'
        command.className = 'fadeout'
        setTimeout(() => {
            i1.className = 'fade1';
            i2.className = 'fade1';
            command.className = 'fade2'
            i1.textContent = 'The numbered square tells you the area of the island it is a part of';
            i2.innerHTML = '<br>';
            command.textContent = commandList[step + 1];
        }, 1000);
    }

    function handleClick(event, rowIndex, colIndex) {
        event.preventDefault();
        if (step === 0 && event.button === 0 && rowIndex === 0 & colIndex === 1) {
            setSquares(squareList[step + 1]);
            setStep(1);
            textAnimation();
        } else if (step === 1 && event.button === 0 && rowIndex === 0 & colIndex === 1) {
            setSquares(squareList[step + 1]);
            setStep(2);
            textAnimation();
        } else if (step === 2 && event.button === 2 && rowIndex === 1 & colIndex === 2) {
            setSquares(squareList[step + 1]);
            setStep(3);
            nextAnimation();
        } else if (step === 3 && event.button === 0 && rowIndex === 2 & colIndex === 1 && squares[2][1] === -3) {
            setSquares(squareList[4])
        } else if ((step === 3 && event.button === 0 && rowIndex === 2 & colIndex === 1 && squares[2][1] === -4) ||
            ((step === 3 && event.button === 2 && rowIndex === 2 & colIndex === 1 && squares[2][1] === -3))) {
            setSquares(squareList[5]);
            setStep(4);
        } else if (step === 4 && event.button === 0 && rowIndex === 1 & colIndex === 0 && squares[1][0] === -3) {
            setSquares(squareList[6])
        } else if ((step === 4 && event.button === 0 && rowIndex === 1 & colIndex === 0 && squares[1][0] === -4) ||
            ((step === 4 && event.button === 2 && rowIndex === 1 & colIndex === 0 && squares[1][0] === -3))) {
            setSquares(squareList[7]);
            const command = document.getElementById('command');
            command.className = 'fadeout';
            setTimeout(() => {
                command.className = 'fade1'
                command.textContent = 'Nice!';
            }, 1000);
            setTimeout(() => {
                toggleIndex();
            }, 3500);
        }
    }

    return (isVisible === 0) ? (
        <div className='tut-exp'>
            <h1 className='fade1' id='i1'>You are given a grid of squares, with some containing numbers</h1>
            <h1 className='fade2' id='i2'>You are trying to find which squares are water and which are land</h1>
            <h1 className='fade3' id='command'>Click on the empty square</h1>
            <div className='tut-board fade3'>
                {squares.map((row, rowIndex) => (
                    <div className='tut-board-row' key={rowIndex}>
                        {row.map((value, colIndex) => (
                            <TutSquare key={colIndex} value={value} onSquareClick={(event) => handleClick(event, rowIndex, colIndex)} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    ) : null;
}


export default function Tutorial() {
    const [tutorialIndex, settutorialIndex] = useState(0);

    function toggleIndex() {
        const isLastSlide = tutorialIndex === 3;
        const newIndex = isLastSlide ? 0 : tutorialIndex + 1;
        settutorialIndex(newIndex);
    }

    return (
        <div>
            <h2 id='tut-header'>How to Play</h2>
            <div className='tut-area'>
                <Tutorial1 isVisible={tutorialIndex} toggleIndex={toggleIndex} />
                <Tutorial2 isVisible={tutorialIndex} toggleIndex={toggleIndex} />
                <Tutorial3 isVisible={tutorialIndex} toggleIndex={toggleIndex} />
                <Tutorial4 isVisible={tutorialIndex} toggleIndex={toggleIndex} />
            </div>
            <div className='tut-button-container'>
                <Link className='main tut-main' style={{ textDecoration: 'none' }} to='/'>Main Menu
                </Link>
            </div>
        </div>
    );

}