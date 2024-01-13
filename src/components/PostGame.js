import axios from 'axios';

export function PostGame(id, user, time) {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const combinedDate = parseInt(`${year}${month}${day}`, 10);
    const postData = { "id": id, "user_id": user, "solve_time_secs": time, "solve_date_yymmdd": combinedDate };
    const postURL = 'https://sterfd-islands-7f98ffd68a4e.herokuapp.com/game_metrics/';

    // console.log('postgame')

    axios.post(postURL, postData)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
}
