import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function About() {
    async function getRequest() {
        const response = await axios.get('http://localhost:8888/');
        console.log(response);
    }

    async function getAllGames() {
        const response = await axios.get('http://localhost:8888/allgames');
        console.log(response);
    }



    // const { Client } = require('pg');

    // const client = new Client({
    //     connectionString: process.env.REACT_APP_DATABASE_URL,
    //     ssl: {
    //         rejectUnauthorized: false
    //     }
    // });

    // client.connect();

    // client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    //     if (err) throw err;
    //     for (let row of res.rows) {
    //         console.log(JSON.stringify(row));
    //     }
    //     client.end();
    // });


    return (
        <div className='sub-menu'>
            <p>This game is based on Nurikabe by the publisher Nikoli!</p>
            <p>A fun project made in React by sterfd.</p>
            <button onClick={() => getRequest()}>Getallgames</button>
            <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
            </Link>
        </div>
    );

}