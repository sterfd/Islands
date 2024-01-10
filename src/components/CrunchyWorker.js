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
    console.log(data);
    if (data.rowCount === 0) {
        return 0;
    } else {
        const solveTimes = data.map((entry) => entry.solve_time_secs);
        const sumTimes = solveTimes.reduce((acc, time) => acc + time, 0);
        const averageTime = Math.floor(sumTimes / data.length);
        const putData = { "id": gameID, "number_of_solves": data.length, "avg_time": averageTime };
        const putComputedURL = databaseURL + 'computed_game_metrics/' + gameID
        await axios.put(putComputedURL, putData);
        return averageTime;
    }
}

