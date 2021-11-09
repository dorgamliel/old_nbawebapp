

function getStandings(){
    console.log('open: ');
    var ws = new WebSocket("ws://127.0.0.1:8080");
    ws.onopen = function (event) {
    console.log('Connection is open ...');
    ws.send('standings');
    };
    ws.onerror = function (err) {
    console.log('err: ', err);
    }
    ws.onmessage     = function (event) {
    let div = document.createElement('div');
    div.className = 'team';
    div.innerText = event.data;
    document.getElementById('container').appendChild(div);

    // console.log(event.data);
    };
    ws.onclose = function() {
        console.log("Connection is closed...");
    }
}

let div = document.createElement('div');
div.className = 'team';
div.innerText = 'Team Name  Wins    Losses  Streak  PCT';
div.style.fontWeight = 'bolder'
document.getElementById('container').appendChild(div);

getStandings();