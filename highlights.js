// const WebSocket = require('ws');

function getHilights() {
    console.log('open: ');
    var ws = new WebSocket("ws://127.0.0.1:8080");
    ws.onopen = function (event) {
    console.log('Connection is open ...');
    ws.send('highlights');
    };
    ws.onerror = function (err) {
    console.log('err: ', err);
    }
    ws.onmessage     = function (event) {
    console.log('message received!!')
    console.log(event.data);
    const videos = event.data.split(',');
    for (let i=0; i< videos.length; i++) {
        videos[i] = videos[i].replace('watch?v=', 'embed/');
        console.log('one ', videos[i])
        const el = document.createElement('iframe');
        el.src = videos[i];
        el.style.height = '200px';
        el.style.width = '100%';
        el.className = 'col-md-4';
        // el.style.marginRight = '-40px'
        // const htmlEl = `<iframe width="400px" height="1000px" src="${videos[i]}"></iframe>`;
        // const htmlEl = '<iframe style="border: none" src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&mute=1"> </iframe>';
        // el.src = 'data:text/html;charset=utf-8,' + encodeURI(htmlEl);
        document.getElementById('content').appendChild(el);
    }
    // document.body.innerHTML += event.data + '&lt;br&gt;';
    };
    ws.onclose = function() {
        console.log("Connection is closed...");
    }
}

getHilights();