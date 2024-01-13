import axios from 'axios';

onmessage = async (event) => {
    const gameID = event.data;
    const averageTime = await processMetrics(gameID);
    postMessage(averageTime);
}

async function processMetrics(gameID) {
    const databaseURL = 'https://sterfd-islands-7f98ffd68a4e.herokuapp.com/'
    const metricURL = databaseURL + 'game_metrics/' + gameID;
    // const { data } = await axios.get('http://localhost:8888/game_metrics/' + gameID);
    const { data } = await axios.get(metricURL);
    // console.log('worker, gameID', gameID, 'data', data);
    let averageTime = 0;
    let solveTotal = 0;
    if (Array.isArray(data.rows) && data.rows.length > 0) {
        const solveTimes = data.rows.map((entry) => entry.solve_time_secs);
        const sumTimes = solveTimes.reduce((acc, time) => acc + time, 0);
        const averageTime = Math.floor(sumTimes / data.rows.length);
        solveTotal = data.rows.length;
        // return averageTime;
        // } else {
        // return 0;

    }
    const putData = { "id": gameID, "number_of_solves": solveTotal, "avg_time": averageTime };
    const putComputedURL = databaseURL + 'computed_game_metrics/';
    await axios.put(putComputedURL, putData);
    return averageTime;
}

