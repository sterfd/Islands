import axios from 'axios';

onmessage = async (event) => {
    const gameID = event.data;
    const averageTime = await processMetrics(gameID);
    postMessage(averageTime);
}

async function processMetrics(gameID) {
    const { data } = await axios.get('http://localhost:8888/game_metrics/' + gameID);
    if (data.length === 0) {
        return 0;
    } else {
        const solveTimes = data.map((entry) => entry.solve_time_secs);
        const sumTimes = solveTimes.reduce((acc, time) => acc + time, 0);
        const averageTime = Math.floor(sumTimes / data.length);
        const putData = { "id": gameID, "number_of_solves": data.length, "avg_time": averageTime };
        await axios.put('http://localhost:8888/computed_game_metrics/' + gameID, putData);
        return averageTime;
    }
}

