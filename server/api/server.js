const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
})

server.get('/', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query("select * from games;");
        client.release();
        res.send(result);
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

server.get('/games/:boardsize/:userID', async (req, res) => {
    try {
        const client = await pool.connect();
        const gameQuery = `SELECT * FROM games WHERE size = ${req.params.boardsize} AND games.id NOT IN (SELECT game_metrics.id FROM game_metrics WHERE game_metrics.user_id = '${req.params.userID}')`;
        const game = await client.query(gameQuery);
        client.release();
        const selectedGameIndex = Math.floor(Math.random() * game.rows.length);
        const selectedGame = game.rows[selectedGameIndex];
        res.status(200).json(selectedGame); // Sending the selected game as JSON

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error getting game.' })
    }
});

server.get('/allgames/:userID', async (req, res) => {
    try {
        const client = await pool.connect();
        const gameQuery = `SELECT * FROM games WHERE games.id NOT IN (SELECT game_metrics.id FROM game_metrics WHERE game_metrics.user_id = '${req.params.userID}')`;
        const game = await client.query(gameQuery);
        client.release();
        const selectedGame = game.rowCount;
        res.status(200).json(selectedGame); // Sending the selected game as JSON

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error getting game.' })
    }
});

server.get('/game_metrics/:id', async (req, res) => {
    // GET game metrics of puzzle with id
    try {
        const client = await pool.connect();
        const metricQuery = `SELECT * FROM game_metrics WHERE id = ${req.params.id}`;
        const metrics = await client.query(metricQuery);
        client.release();
        res.status(200).json(metrics);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error getting metrics.' })
    }
});

server.get('/computed_game_metrics/:id', async (req, res) => {
    // GET computed game metrics of puzzle with id
    try {
        const client = await pool.connect();
        const compMetricQuery = `SELECT * FROM computed_game_metrics WHERE id = ${req.params.id}`;
        const metrics = await client.query(compMetricQuery);
        client.release();
        res.status(200).json(metrics);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error getting metrics.' })
    }
});

server.post('/game_metrics', async (req, res) => {
    // POST game stats
    const { id, userID, solveTime, solveDate } = req.body;
    try {
        const client = await pool.connect();
        const postMetricQuery = `INSERT INTO game_metrics (id, user_id, solve_time_secs, solve_date_yymmdd) VALUES (${id}, '${userID}', ${solveTime}, ${solveDate})`;
        const metrics = await client.query(postMetricQuery);
        client.release();
        res.status(201).json(metrics);
    } catch (err) {
        res.status(500).json({ message: 'Error creating new game metric', error: err })
    }
});

server.put('/computed_game_metrics/:id', async (req, res) => {
    // PUT computed game stats (avg and number of solves) for puzzle with id'
    const { id, solveTotal, avgTime } = req.body;
    const gameID = req.params.id;
    try {
        const client = await pool.connect();
        const putMetricQuery = `UPDATE computed_game_metrics SET number_of_solves = ${solveTotal}, avg_time = ${avgTime} WHERE id = ${gameID}`;
        const metrics = await client.query(putMetricQuery);
        client.release();
        res.status(200).json(metrics);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error updating record.' });
    }
});

server.get('/users/:id', async (req, res) => {
    // GET user info and stats
    try {
        // const query = await db.select('game_metrics.solve_time_secs', 'games.size').where({ user_id: req.params.id }).from('game_metrics').join('games', { 'games.id': 'game_metrics.id' });
        // res.status(200).json(query);
        const client = await pool.connect();
        const userMetricQuery = `SELECT game_metrics.solve_time_secs, games.size FROM game_metrics JOIN games ON game_metrics.id = games.id WHERE user_id = '${req.params.id}'`;
        const metrics = await client.query(userMetricQuery);
        client.release();
        res.status(200).json(metrics);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error getting display name' });
    }
});



module.exports = server;