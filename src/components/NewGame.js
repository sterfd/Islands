import axios from 'axios';


export async function NewGame(boardSize, onNewGame, userID) {
    console.log(userID)
    const { data } = await axios.get('http://localhost:8888/games/' + String(boardSize) + '/' + userID);
    // const { data } = await axios.get('http://localhost:8888/games', getReqData);

    const gameID = JSON.parse(data.id);
    const starting = JSON.parse(data.board);
    const solution = JSON.parse(data.solution);


    const computedMetricWorker = new Worker(new URL('./CrunchyWorker.js', import.meta.url));
    computedMetricWorker.addEventListener('message', (event) => {
        const avgTime = event.data;
        computedMetricWorker.terminate();
        onNewGame(gameID, starting, solution, avgTime);
    });
    computedMetricWorker.postMessage(gameID);
}

