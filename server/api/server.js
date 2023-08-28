const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const server = express();

const db = require('./dbConfig');

server.use(cors());
server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
    res.send('Welcome to the Todo app server!')
}); //get, post, put, delete - takes 2 args - first is endpoint (URL) and second is callback where you get request/response

server.get('/games', async (req, res) => {
    // GET all todos
    try {
        const games = await db('games');
        res.json(games);
    } catch (err) {
        console.log(err);
    }
});

server.post('/todos', (req, res) => {
    // POST a todo
});

// can put a var in endpoint with '/todos/:var' - id, etc, etc

module.exports = server;