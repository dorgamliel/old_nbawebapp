const db = require("./DBUse.js");

function sendBet(gameNumber, username, bet) {
    db.sendBet(gameNumber, username, bet);
}


function getGameBets(gameNum) {
    db.getGameBets(gameNum);
}


function getLeaderboard() {
    db.getLeaderboard();
}

// sendBet(1, 'Raiko', 1);
// getGameBets(1);


module.exports = {
    getGameBets,
    getLeaderboard
}