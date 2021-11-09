// const { eventNames } = require("process");

// const WebSocket = require('ws');
let openedGames = [];
let userBets = [];
let username = 'dor';

function getBet(bet) {
    console.log('open: ');
    var ws = new WebSocket("ws://127.0.0.1:8080");
    ws.onopen = function (event) {
    console.log('Connection is open ...');
    ws.send(bet);
    };
    ws.onerror = function (err) {
    console.log('err: ', err);
    }
    ws.onmessage = function (event) {
        console.log('message received!!')
        console.log(event.data);

        if (event.data.toString().startsWith('team')) {
            let team = [];
            team = event.data.toString().split(',');
            const team1 = team[0].substring(4).split(':')[0];
            if (openedGames.includes(team1)) {
                return
            }
            openedGames.push(team1);

            team[0] = removeTeamName(team[0])
            
            //build html for team 1 bet
            for (let i=0; i<team.length; i++) {
                const containerName = event.data.toString().split(':')[0]+'-container';
                let div = document.createElement('div');
                div.className = 'bet';
                // div.innerText = removeTeamName(team[i]);
                div.innerText = team[i];
                document.getElementById(containerName).appendChild(div);
            }
        }
    };
    ws.onclose = function() {
        console.log("Connection is closed...");
    }
}

function removeTeamName(name) {
    if (name.split(':').length > 1) {
        return name.split(':')[1];
    }
    return name.split(':')[0];
}

function sendBet(bet) {
    const username = window.localStorage.getItem('username');
    if (!username) {
        console.log('YOU ARE NOT LOGGED IN!')
        return;
    }
    var ws = new WebSocket("ws://127.0.0.1:8080");
    ws.onopen = function (event) {
    ws.send(`sendBet,${bet},${username}`);
    };
    ws.onerror = function (err) {
    console.log('err: ', err);
    }
    ws.onmessage = function (event) {
        console.log('message received!!')
        console.log(event.data);
    };
    ws.onclose = function() {
        console.log("Connection is closed...");
    }
}

function gamesCount() {
    var ws = new WebSocket("ws://127.0.0.1:8080");
    ws.onopen = function (event) {
    console.log('Connection is open ...');
    ws.send('gamesCount');
    setTimeout(() => {
        ws.send('gamesTeams'); 
    }, 200);
    };
    ws.onerror = function (err) {
    console.log('err: ', err);
    }
    ws.onmessage = function (event) {
        console.log('EVENT ', event.data)
        if (!isNaN(event.data)) {
            for (let i=1; i<Number(event.data)+1; i++) {
                console.log('A')
                //Make html of game
                const parent = document.createElement('div');
                parent.className = 'col-4'
                let html = `<div class="title">Bet ${i}</div>
                <div class="row bet-container">
                <div id="team${i}1-container" class="col-3">
                    <div>Team 1</div>
                </div>
                <div id="team${i}2-container" class="col-3">
                    <div>Team 2</div>
                </div>
                </div>`.trim();
                parent.innerHTML = html;
                
                // const containerName = event.data.toString().split(':')[0]+'-container';
                document.getElementById('container').appendChild(parent);
    
                // getBet(i);
            } 
        } else {
            const teams = event.data.split(',');
            let gameCount = 1;
            for (let i=0; i<teams.length-1; i+=2) {
                let imgHtml1 = document.createElement('img');
                let imgHtml2 = document.createElement('img');
                console.log(teams[i]);
                imgHtml1.src = `./images/${teams[i]}.png`;
                imgHtml1.onclick = clickHandler(gameCount, gameCount+'1');
                imgHtml2.src = `./images/${teams[i+1]}.png`;
                imgHtml2.onclick =  clickHandler(gameCount, gameCount+'2');
                console.log(teams)
                console.log(`team${gameCount}1-container`)
                console.log(document.getElementById(`team${gameCount}1-container`))
                document.getElementById(`team${gameCount}1-container`).appendChild(imgHtml1);
                document.getElementById(`team${gameCount}2-container`).appendChild(imgHtml2);
                gameCount += 1;
            }
        }
        
    };
    ws.onclose = function() {
        console.log("Connection is closed...");
    }
}

function clickHandler(gameIndex, bettedTeam) {
    return function() {
        sendBet(bettedTeam);
        userBets.push(bettedTeam);
        getBet(gameIndex);
    }
}

function checkBettedTeams(gamesCount, ws) {
    gamesCount /= 10;
    const username = window.localStorage.getItem('username');
    for (let i=0; i<gamesCount+1; i++) {
        ws.send(`alreadyVoted,${i+1},${username}`);
        ws.onmessage = function(event) {
            if (event.data.startsWith('true')) {
                getBet(event.data.split(',')[1]);
            }
        }
    }
}

setTimeout(() => {
    var ws = new WebSocket("ws://127.0.0.1:8080");
    ws.onopen = function (event) {
        console.log('Connection is open ...');
        ws.send('gamesCount');
        ws.onmessage = function (event) {
            checkBettedTeams(event.data+1, ws);
        }
    }
}, 1500);


function leaderboard1(bets) {
    console.log('ONE ',userBets);
    updateLeaderboard(username, JSON.stringify(userBets));
}

gamesCount();
// getBet(1);

