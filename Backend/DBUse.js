const sqlite3 = require('sqlite3').verbose();
const { gamesCount } = require('./DataCollector');

let db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
      console.error('error!! ' + err.message);
    }
    console.log('Connected to the my database. ' + db);
  });


function login(name, password) {
    let sql = 'SELECT * FROM users WHERE username="'+name+'"';
    return new Promise((resolve, rej) => {
        db.all(sql, [], (err, rows) => {
            let row = rows[0];
            if (err || !row || row.password !== Number(password)) {
                // throw err;
                console.log('No username found.');
                resolve('No username found.')
                return;
                throw err;
            }
            console.log('connected! ',row.username, row.password);
            resolve('user and pass from DB '+ row.username + row.password)
            resolve('user and pass from front '+ name+ password)
            });
    })
}

function signup(name) {
    const pass = Math.floor(Math.random()*(999-100+1)+100);
    return new Promise((resolve, rej) => {
        db.run('INSERT INTO users(username, password) VALUES(?, ?)', [name,pass], (err) => {
            if(err) {
                resolve('Signup failed.')
                return console.log(err.message); 
            }
            console.log('Signed up successfully!');
            resolve(pass); 
        });
    })
}

function sendBet(gameNumber, username, bet) {
    db.run('INSERT INTO game'+gameNumber+'(username, team) VALUES(?, ?)',[username, bet], (err) => {
        if(err) {
            return console.log(err.message); 
        }
        console.log('Guess for game '+gameNumber+' has been places!');
    });
}

function alreadyBetted(game, username) {
    return new Promise((resolve, rej) => {
        const bet = getGameBets(game).then((res) => {
            let sql = `SELECT * FROM game${game} WHERE username="${username}"`;
            db.all(sql, [], (err, rows) => {
            if (err) {
                // throw err;
                console.log('No game found.', err);
                return;
                throw err;
            }
            console.log('got bet! ', rows[0]);
            resolve(rows)
            });
            //check if already betted
            let x = 4;
        });
    })

}
alreadyBetted('9', 'Dor123');

function getGameBets(gameNum) {
    return new Promise((resolve, rej) => {
        let sql = 'SELECT * FROM game'+gameNum+'';
        db.all(sql, [], (err, rows) => {
        if (err) {
            // throw err;
            console.log('No game found.', err);
            return;
            throw err;
        }
        console.log('got bet! ', rows);
        resolve(rows)
        });
    })
}

function getPlayerBet(playerName, gameID) {
    let sql = 'SELECT * FROM game'+gameID+' WHERE username="'+playerName+'";';
    db.all(sql, [], (err, rows) => {
    if (err) {
        console.log('No player bet found.', err);
        return;
        throw err;
    }
    console.log('got player bet! ', rows);
    // callback(rows)
    });
}

function updateLeaderboard() {
    return new Promise((resolve, rej) => {
        //feach game, each user that won gets + 1
        // const username = data.split(',')[1];
        // // let scoresStr = data.split('[')[1].split(']')[0];
        // const count = Math.floor(data.split('"').length/2);
        const scores = getTotalScore().then((usersScores) => {
            for (let userData in usersScores) {
                db.run('UPDATE leaderboard SET score=score+'+usersScores[userData]+' WHERE username="'+userData+'";', (err) => {
                    if(err) {
                        return console.log(err.message); 
                    }
                    console.log('leaderboard has been updated.');
                });
            }
        });
    })
}
//replaces updateLeaderboard
function getTotalScore() {
return new Promise((resolve, rej) => {
    let scores = {};
    let total = 0;
    const games = gamesCount();
    games.then((numGames) => {
        //TODO: change 5
    for(let i=1; i<numGames; i++) {
        getGameBets(i).then((receivedBets) => {
            //TODO: get winning team id
            games.then((res) => {
                res = res['games']
                let winner = 2;
                let a = Number(res[i]['hTeam']['score']);
                let b = Number(res[i]['vTeam']['score']);
                // if home team wins
                if (Number(res[i]['hTeam']['score']) > Number(res[i]['vTeam']['score'])) {
                    winner = 1;
                }
                for (let j=0; j<receivedBets.length; j++) {
                    if (receivedBets[j]['team'] !== winner) {
                        continue;
                    }
                    if (scores[receivedBets[j]['username']]) {
                        scores[receivedBets[j]['username']] += 1
                    } else {
                        scores[receivedBets[j]['username']] = 1
                    }
                     
                }
                console.log('WOW ', receivedBets);
                if (i === 4) {
                    resolve(scores);
                }
            })
        });
    }
    })
})
}
// updateLeaderboard();

function getLeaderboard() {
    return new Promise((resolve, rej) => {
        let sql = 'SELECT * FROM leaderboard ORDER BY score DESC';
        db.all(sql, [], (err, rows) => {
            if (err) {
                // throw err;
                console.log('No game found.', err);
                throw err;
            }
            console.log('got leaderboard! ', rows);
            resolve(rows);
    })
    });
}

function resetAllGames() {
    gamesCount().then((numGames) => {
        //TODO: add real number of games
        for (let i=1; i<numGames+1; i++) {
            db.run(`TRUNCATE TABLE game${i}`, (err) => {
                if(err) {
                    return console.log(err.message); 
                }
                console.log('Row was added to the table!');
            });
        }
    })
}



// signup("Dor11111");
// login('Raiko', '29');


// const x = getGameBets(1).then(function(res) {
//     console.log('Result from outside: ',res);
// })


// getLeaderboard();
// updateLeaderboard(1);
// getPlayerBet('Raiko', 1);

module.exports = {
    sendBet,
    getGameBets,
    getLeaderboard,
    alreadyBetted,
    updateLeaderboard,
    resetAllGames,
    login,
    signup
}