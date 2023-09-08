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
}); //get, post, put, delete - takes 2 args - first is endpoint (URL) and second is callback where you get request/response

server.get('/games/:boardsize', async (req, res) => {
    // GET all games
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

// can put a var in endpoint with '/games/:var' - id, etc, etc

module.exports = server;