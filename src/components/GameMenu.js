import React from 'react';
import { Link } from 'react-router-dom';
import home from '../images/home-button.png';
import restart from '../images/restart-button.png';
import undoButton from '../images/undo-button.png';
import checkButton from '../images/check-button.png';
import rules from '../images/rules-button.png';

export function GameMenu({ onRestartGame, onJumpTo, currentMove, toggleRules }) {
    return (
        <div className='game-menu'>
            <Link style={{ textDecoration: 'none' }} to='/'>
                <button className='bar'>
                    <img className='home-img' src={home} alt=''></img>
                </button>
            </Link>
            <button className='bar' onClick={() => onRestartGame()}>
                <img className='restart-img' src={restart} alt=''></img>
            </button>
            <button className='bar' onClick={() => onJumpTo(currentMove - 1)}>
                <img className='undo-img' src={undoButton} alt=''></img>
            </button>
            <button className='bar'>
                <img className='check-img' src={checkButton} alt=''></img>
            </button>
            <button className='bar' onClick={() => toggleRules()}>
                <img className='rules-img' src={rules} alt=''></img>
            </button>
        </div>
    )

}