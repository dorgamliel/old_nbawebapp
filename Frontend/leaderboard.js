function getLeaderboard() {
    console.log('open: ');
    var ws = new WebSocket("ws://127.0.0.1:8080");
    ws.onopen = function (event) {
    console.log('Connection is open ...');
    ws.send('leaderboard');
    };
    ws.onerror = function (err) {
    console.log('err: ', err);
    }
    ws.onmessage = function (event) {
        console.log('message received!!')
        const users = getUsers(event.data.split('}'));
        console.log(event.data);
        console.log(users);
        
        for (let i=0; i<users.length-1; i++) {
            let div = document.createElement('div');
            div.className = 'user';
            div.innerText = users[i].username + users[i].score;
            document.getElementById('leaderboard-container').appendChild(div);
        }
    }
}

function getUsers(usersArr) {
    let user;
    allUsers = [];
    for (let i=0; i<usersArr.length; i++) {
        let str = usersArr[i].split('"');
        if (str.length > 1) {
            user = {username: str[3], score: str[6].substring(1, str[6].length-1)};
            allUsers.push(user);
        }

    }
    return allUsers;
}

function updateLeaderboard(username, score) {
    console.log('open: ');
    var ws = new WebSocket("ws://127.0.0.1:8080");
    ws.onopen = function (event) {
    console.log('Connection is open ...');
    ws.send(`updateLeaderboard,${username},${score}`);
    };
    ws.onerror = function (err) {
    console.log('err: ', err);
    }
    ws.onmessage = function (event) {
        console.log('updated!! ', event.data)
    }
}

console.log('jkk');
getLeaderboard();
// updateLeaderboard('dor', '1000');