function login() {
    let user = document.getElementById('userLogin').value;
    let pass = document.getElementById('passLogin').value;
    var ws = new WebSocket("ws://127.0.0.1:8080");
    ws.onopen = function (event) {
    console.log('Connection is open ...');
    ws.send(`login,${user},${pass}`);
    };
    ws.onerror = function (err) {
    console.log('err: ', err);
    }
    ws.onmessage = function (event) {
        if (event.data === 'No username found.') {
            console.log('No username found.')
        } else {
            console.log(`Hello ${user}!`)
            window.localStorage.setItem('username', user);
            window.location.href = './index.html'
        }
    }
}

function signup() {
    let user = document.getElementById('userSignup').value;
    var ws = new WebSocket("ws://127.0.0.1:8080");
    ws.onopen = function (event) {
    console.log('Connection is open ...');
    ws.send(`signup,${user}`);
    };
    ws.onerror = function (err) {
    console.log('err: ', err);
    }
    ws.onmessage = function (event) {
        if (event.data === 'Signup failed.') {
            console.log('Signup failed.');
        } else {
            console.log(`Hello ${user}! Your password is: ${event.data}.`)
            window.localStorage.setItem('username', user);
            window.location.href = './index.html'
        }
    }
}