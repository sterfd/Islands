import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function TutSquare({ value, onSquareClick }) {
    if (value === 0) {
        return <button
            className='water square' onClick={onSquareClick} onContextMenu={onSquareClick}></button>;
    } else if (value === -1) {
        return <button
            className='land square' onClick={onSquareClick} onContextMenu={onSquareClick}></button>;
    } else if (value === -2) {
        return <button
            className='tile square' onClick={onSquareClick} onContextMenu={onSquareClick}></button >;
    } else if (value === 5) {
        return <button
            className='glow-square' onClick={onSquareClick} onContextMenu={onSquareClick}></button >;
    } else {
        return <button
            className='land square' onClick={onSquareClick} onContextMenu={onSquareClick}>{value}</button>;
    }
}

function Slide({ isVisible, toggleSlide }) {
    function handleClick() {
        console.log('ok');
    }

    return (isVisible === 0) ? (
        <div className='tut-exp'>
            <p>You are given a grid of squares, with some containing numbers</p>
            <p>You are trying to find which squares are water and which are land</p>
            {/* [0] -> [-1,0] -> [-2,0] -> [-2,-2]             */}
            <p>Click on the empty square</p>
            <p>Click that square again</p>
            <p>Right click an empty square</p>
            <TutSquare value={5} onClick={handleClick}></TutSquare>
            <TutSquare value={-2} onClick={handleClick}></TutSquare>
            <button className='main' style={{ textDecoration: 'none' }} onClick={() => toggleSlide()}>
                Next Page
            </button>
            <div className='glow-square'></div>
        </div>
    ) : null;
}

function Slide2({ isVisible, toggleSlide }) {
    return (isVisible === 1) ? (
        <div className='tut-exp'>
            <p>These are the Rules 2</p>
            <p>The numbered square tells you the area of the island it is a part of</p>
            <p>Surround this island with water</p>
            <button className='main' style={{ textDecoration: 'none' }} onClick={() => toggleSlide()}>
                Next Page
            </button>
        </div>
    ) : null;
}

function Slide3({ isVisible, toggleSlide }) {

    return (isVisible === 2) ? (
        <div className='tut-exp'>
            <p>These are the Rules 3</p>
            <p>Each numbered square is a part of its own island</p>
            <p>Solve the following:</p>
            {/* Show 2 3s diagonally connected in a 2x8 grid     [0,3,0,0],[0,0,3,0]
    [[-2,3,0,-2], [-2,0,3,-2]] accepted but not [0,3,-2,0],[0,0,3,0] */}
            <button className='main' style={{ textDecoration: 'none' }} onClick={() => toggleSlide()}>
                Next Page
            </button>
        </div>
    ) : null;
}

function Slide4({ isVisible, toggleSlide }) {

    return (isVisible === 3) ? (
        <div className='tut-exp'>
            <p>These are the Rules 4</p>
            <p>The entire body of water must be connected</p>
            <p>Solve the following:</p>
            {/* [1,0,0],[0,0,0],[0,2,0] -> wrong: [1,0,0],[0,-2,0],[0,2,0] */}
            <button className='main' style={{ textDecoration: 'none' }} onClick={() => toggleSlide()}>
                Next Page
            </button>
        </div>
    ) : null;
}

function Slide5({ isVisible, toggleSlide }) {

    return (isVisible === 4) ? (
        <div className='tut-exp'>
            <p>These are the Rules 5</p>
            <p>No area of water can by 2x2 or larger in size</p>
            <p>Solve the following:</p>
            {/* show a 3 in the corner of a 3x3     [3,0,0],[0,0,0],[0,0,0] -> [3,-2,0],[0,-2,0],[0,0,0] */}
            <button className='main' style={{ textDecoration: 'none' }} onClick={() => toggleSlide()}>
                Next Page
            </button>
        </div>
    ) : null;
}

export default function Tutorial() {
    const [slideIndex, setSlideIndex] = useState(0);
    const clickTutorial = [[[-2, -2]], [[1, 1]]]
    const areaTutorial = [[[-2, -2, -2], [-2, 1, -2], [-2, -2, -2]], [[0, 0, 0], [0, 1, 0], [0, 0, 0]]];
    const disconnectedNumberTutorial = [[[-2, 3, -2, -2], [-2, -2, 3, -2]], [[-1, 3, 0, -1], [-1, 0, 3, -1]]];
    const waterConnectedTutorial = [[1, -2, -2], [-2, -2, 2], [[1, 0, -1], [0, 0, 2]]];
    const largeWaterTutorial = [[[2, -2, -2], [-2, -2, -2]], [[2, -1, -1], [0, 0, 0]]];

    function toggleSlide() {
        const isLastSlide = slideIndex === 4;
        const newIndex = isLastSlide ? 0 : slideIndex + 1;
        setSlideIndex(newIndex);
    }

    return (
        <div>
            <h2 id='tut-header'>How to Play</h2>
            <div className='tut-area'>
                <Slide isVisible={slideIndex} toggleSlide={toggleSlide} />
                <Slide2 isVisible={slideIndex} toggleSlide={toggleSlide} />
                <Slide3 isVisible={slideIndex} toggleSlide={toggleSlide} />
                <Slide4 isVisible={slideIndex} toggleSlide={toggleSlide} />
                <Slide5 isVisible={slideIndex} toggleSlide={toggleSlide} />
            </div>
            <div className='tut-main-container'>
                <Link className='main tut-main' style={{ textDecoration: 'none' }} to='/'>Main Menu
                </Link>
            </div>
        </div>
    );

}