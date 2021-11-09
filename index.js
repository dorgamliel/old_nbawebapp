function hello() {
    let name = 'guest';
    storedName = window.localStorage.getItem('username');
    if (storedName) {
        name = storedName;
    }
    let greeting = document.createElement('div');
    greeting.innerHTML = `Hello ${name}!`

    const parent = document.getElementById('greeting-container');
    parent.appendChild(greeting);
}

hello();