import axios from 'axios';
// import Worker from "./CrunchyWorker.js";

export async function NewGame(boardSize) {
    const { data } = await axios.get('http://localhost:8888/games/' + String(boardSize));
    const gameID = JSON.parse(data.id);
    const starting = JSON.parse(data.board);
    const solution = JSON.parse(data.solution);

    const computedMetricWorker = new Worker(new URL('./CrunchyWorker.js', import.meta.url));
    computedMetricWorker.addEventListener('message', (event) => {
        const metrics = event.data;
        console.log('Received metrics form the worker:', metrics);
    });
    computedMetricWorker.postMessage(gameID);
    // computedMetricWorker.terminate();
    return { gameID, starting, solution };
}

