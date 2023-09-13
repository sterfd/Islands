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
        const selectedGame = Math.floor(Math.random() * (games.length));
        console.log(selectedGame, games[selectedGame].id);
        res.status(200).json(games[selectedGame]);
    } catch (err) {
        console.log(err);
    }
});

server.get('/game_metrics/:id', async (req, res) => {
    // GET the raw metrics of puzzle with id
    try {
        const metrics = await db.select('*').where({ id: req.params.id }).from('game_metrics');
        res.status(200).json(metrics);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error getting metrics.' })
    }
});

server.get('/computed_game_metrics/:id', async (req, res) => {
    // GET computed game metrics of puzzle with id
    try {
        const metrics = await db.select('*').where({ id: req.params.id }).from('computed_game_metrics');
        res.status(200).json(metrics);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error getting metrics.' })
    }
});

server.post('/game_metrics', async (req, res) => {
    // POST game stats
    const postData = req.body;
    try {
        const metrics = await db('game_metrics').insert(postData);
        res.status(201).json(postData);
    } catch (err) {
        res.status(500).json({ message: 'Error creating new game metric', error: err })
    }
});

server.put('/computed_game_metrics/:id', async (req, res) => {
    // PUT computed game stats (avg and number of solves) for puzzle with id'
    const putData = req.body;
    const gameID = req.params.id;
    try {
        console.log('updating computed metrics for ' + gameID);
        await db('computed_game_metrics').where({ id: req.params.id }).update(putData);
        res.status(200).json({ message: 'Record updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error updating record.' });
    }
});

server.post('/user_metrics', (req, res) => {
    // POST user info
});



module.exports = server;