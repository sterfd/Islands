const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const server = express();

const db = require('./dbConfig');

server.use(cors());
server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
    res.send('Welcome to the islands app server!')
});


server.get('/games/:boardsize', async (req, res) => {
    // GET a random game with boardsize nxn
    try {
        const games = await db.select('*').where({ size: req.params.boardsize }).from('games');
        const selectedGame = Math.floor(Math.random() * (Object.keys(games).length));
        res.json(games[selectedGame]);
    } catch (err) {
        console.log(err);
    }
});


server.post('/game_metrics', (req, res) => {
    // POST game stats
});



server.post('/user_metrics', (req, res) => {
    // POST user info
});



module.exports = server;