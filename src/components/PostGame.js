import axios from 'axios';

export function PostGame(id, time) {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const combinedDate = parseInt(`${year}${month}${day}`, 10);
    const postData = { "id": id, "solve_time_secs": time, "solve_date_yymmdd": combinedDate };
    axios.post('http://localhost:8888/game_metrics', postData)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });

}

// winning menu should show: Congrats! You solve this puzzle in xxx hours, xx minutes, and x seconds. 
// The average solve time for this puzzle is ___ time.
// Play again button. Main Menu button