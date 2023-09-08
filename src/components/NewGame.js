// import React from 'react';
import axios from 'axios';

export async function NewGame(boardSize) {
    const { data } = await axios.get('http://localhost:8888/games/' + String(boardSize));
    const starting = JSON.parse(data.board);
    const solution = JSON.parse(data.solution);
    return { starting, solution };
}