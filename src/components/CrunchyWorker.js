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
    console.log('worker, gameID', gameID, 'data', data);
    if (Array.isArray(data.rows) && data.rows.length > 0) {
        const solveTimes = data.rows.map((entry) => entry.solve_time_secs);
        const sumTimes = solveTimes.reduce((acc, time) => acc + time, 0);
        const averageTime = Math.floor(sumTimes / data.rows.length);
        const putData = { "id": gameID, "number_of_solves": data.rows.length, "avg_time": averageTime };

        console.log(putData);

        const putComputedURL = databaseURL + 'computed_game_metrics/' + gameID
        await axios.put(putComputedURL, putData);
        return averageTime;
    } else {
        return 0;
    }
}

