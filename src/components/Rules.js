import React from 'react';

export function Rules({ isRulesOpen, toggleRules }) {
    return isRulesOpen ? (
        <div>
            <div className='overlay-background rules-container' />
            <div className='overlay-container'>
                <h2>Rules</h2>
                <p className='rules-text'>You are trying to determine which squares are land or water.</p>
                <p className='rules-text'>The numbers represent the area of the island that square is a part of.</p>
                <p className='rules-text'>Each numbered square is a part of its own island.</p>
                <p className='rules-text'>All blocks of water must be connected to each other.</p>
                <p className='rules-text'>No area of the water can by 2x2 or greater in size.</p>
                <div className='overlay-button-box'>
                    <button className='main playing' onClick={() => toggleRules()}>
                        Keep Playing
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}