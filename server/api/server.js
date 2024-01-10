const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');

const server = express();

// const db = require('./sqlite/dbConfig');

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
        const gameQuery = `SELECT * FROM games WHERE size = ${req.params.boardsize}`;
        const game = await client.query(gameQuery);
        client.release();
        const selectedGameIndex = Math.floor(Math.random() * game.rows.length);
        const selectedGame = game.rows[selectedGameIndex];

        res.status(200).json(selectedGame); // Sending the selected game as JSON

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error getting game.' })
    }

    // GET a random game with boardsize nxn
    // try {
    //     let query = db.select('*').where({ size: req.params.boardsize }).from('games');
    //     if (req.params.userID !== 'null') {
    //         query = query.whereNotExists(db.select(1).where({ user_id: req.params.userID }).whereRaw('"game_metrics"."id" = "games"."id"').from('game_metrics'));
    //     }
    //     const games = await query;
    //     const selectedGame = Math.floor(Math.random() * (games.length));
    //     console.log(games.length, req.params);
    //     res.status(200).json(games[selectedGame]);
    // } catch (err) {
    //     console.log(err);
    // }
});

server.get('/allgames/:userID', async (req, res) => {
    try {
        const client = await pool.connect();
        const gameQuery = `SELECT * FROM games WHERE games.id NOT IN (SELECT game_metrics.id FROM game_metrics WHERE game_metrics.user_id = "${req.params.userID}")`;
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
    // GET the raw metrics of puzzle with id
    try {
        const client = await pool.connect();
        const metricQuery = `SELECT * WHERE id = ${req.params.id} FROM game_metrics`;
        const metrics = await client.query(metricQuery);
        client.release();
        res.status(200).json(metrics);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error getting metrics.' })
    }

    // try {
    //     const metrics = await db.select('*').where({ id: req.params.id }).from('game_metrics');
    //     res.status(200).json(metrics);
    // } catch (err) {
    //     console.log(err);
    // }
});

server.get('/computed_game_metrics/:id', async (req, res) => {
    // GET computed game metrics of puzzle with id
    // GET the raw metrics of puzzle with id
    try {
        const client = await pool.connect();
        const compMetricQuery = `SELECT * WHERE id = ${req.params.id} FROM computed_game_metrics`;
        const metrics = await client.query(compMetricQuery);
        client.release();
        res.status(200).json(metrics);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error getting metrics.' })
    }

    // try {
    //     const metrics = await db.select('*').where({ id: req.params.id }).from('computed_game_metrics');
    //     res.status(200).json(metrics);
    // } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ message: 'Error getting metrics.' })
    // }
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
        await db('computed_game_metrics').where({ id: req.params.id }).update(putData);
        res.status(200).json({ message: 'Record updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error updating record.' });
    }
});

server.post('/users', async (req, res) => {
    // POST user info
    // new user, add user_id, display_name

    // INSERT STATEMENTS
    // try {
    //     const client = await pool.connect();
    //     const metricQuery = `SELECT * WHERE id = ${req.params.id} FROM game_metrics`;
    //     const metrics = await client.query(metricQuery);
    //     client.release();
    //     res.status(200).json(metrics);
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: 'Error getting metrics.' })
    // }

    const postData = req.body;
    try {
        const metrics = await db('users').insert(postData);
        res.status(201).json(postData);
    } catch (err) {
        res.status(500).json({ message: 'Error creating new user', error: err });
    }
    // user columns = user_id (text, NN, pk), display_name
});


server.get('/users/:id', async (req, res) => {
    // GET user info
    // JOIN STATEMENTS
    // try {
    //     const client = await pool.connect();
    //     const metricQuery = `select solve_time_secs, size where id = ${req.params.id} from game_metrics`;
    //     const metrics = await client.query(metricQuery);
    //     client.release();
    //     res.status(200).json(metrics);
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: 'Error getting metrics.' })
    // }


    // try {
    //     const query = await db.select('game_metrics.solve_time_secs', 'games.size').where({ user_id: req.params.id }).from('game_metrics').join('games', { 'games.id': 'game_metrics.id' });
    //     res.status(200).json(query);
    // } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ message: 'Error getting display name' });
    // }
});



module.exports = server;