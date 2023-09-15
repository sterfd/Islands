import React from 'react';
import { Link } from 'react-router-dom';
import home from '../images/home-button.png';
import restart from '../images/restart-button.png';
import undoButton from '../images/undo-button.png';
import checkButton from '../images/check-button.png';
import rules from '../images/rules-button.png';

export function GameMenu({ onRestartGame, onJumpTo, currentMove }) {
    return (
        <div className='game-menu'>
            <Link style={{ textDecoration: 'none' }} to='/'>
                <button className='bar'>
                    <img className='home' src={home} alt=''></img>
                </button>
            </Link>
            <button className='bar' onClick={() => onRestartGame()}>
                <img className='restart' src={restart} alt=''></img>
            </button>
            <button className='bar' onClick={() => onJumpTo(currentMove - 1)}>
                <img className='undo' src={undoButton} alt=''></img>
            </button>
            <button className='bar'>
                <img className='check' src={checkButton} alt=''></img>
            </button>
            <button className='bar'>
                <img className='rules' src={rules} alt=''></img>
            </button>
        </div>
    )

}