import React from 'react';
import '../css/board.css';

function Game() {
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('../islands.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to islands database.');
    });

    db.serialize(() => {
        db.each('SELECT id as id, board as board, solution as solution FROM games', (err, row) => {
            if (err) {
                console.error(err.message);
            }
            console.log(row.id + '\t' + row.name);
        });
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed database connection.');
    })

    return (
        <div className='game'>
            <div className='game-board'>
                <button>'hello'</button>
            </div>
        </div >
    );
}

export { Game };