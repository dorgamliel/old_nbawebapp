

function getInjuries(){
    console.log('open: ');
    var ws = new WebSocket("ws://127.0.0.1:8080");
    ws.onopen = function (event) {
    console.log('Connection is open ...');
    ws.send('injuries');
    };
    ws.onerror = function (err) {
    console.log('err: ', err);
    }
    ws.onmessage     = function (event) {
    let div = document.createElement('div');
    div.className = 'injury';
    div.innerText = event.data;
    document.getElementById('container').appendChild(div);

    // console.log(event.data);
    };
    ws.onclose = function() {
        console.log("Connection is closed...");
    }
}

getInjuries();