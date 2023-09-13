import axios from 'axios';

/* eslint-disable no-restricted-globals */
self.addEventListener('message', async (event) => {
    const gameID = event.data;
    console.log('worker running ' + gameID);
    const metrics = await processMetrics(gameID);
    self.postMessage(metrics);
    self.close();
    console.log('worker terminated');
});

async function processMetrics(gameID) {
    console.log('processing...')
    const { data } = await axios.get('http://localhost:8888/game_metrics/' + gameID);
    if (data.length === 0) {
        console.log('no data')
        return { "id": gameID, "number_of_solves": 0, "avg_time": 0 };
    } else {
        const solveTimes = data.map((entry) => entry.solve_time_secs);
        const sumTimes = solveTimes.reduce((acc, time) => acc + time, 0);
        const averageTime = Math.floor(sumTimes / data.length);
        const putData = { "id": gameID, "number_of_solves": data.length, "avg_time": averageTime };
        const response = await axios.put('http://localhost:8888/computed_game_metrics/' + gameID, putData)
        console.log(response.data);
        return putData;
    }
}

