import axios from 'axios';


export async function NewGame(boardSize, onNewGame, userID) {
    console.log('userID prop in new game', userID);
    let getUrl = 'https://sterfd-islands-7f98ffd68a4e.herokuapp.com/games/' + String(boardSize) + '/';
    if (userID !== null) {
        getUrl += userID;
    } else {
        getUrl += 0;
    }
    const { data } = await axios.get(getUrl);
    // const { data } = await axios.get('http://localhost:8888/games/' + String(boardSize) + '/' + userID);
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

