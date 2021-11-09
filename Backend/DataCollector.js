const injuries = require("./InjuredPlayers.js");
const standings = require("./leagueStandings.js");
const highlights = require("./Highlights.js");
const todaysData = require("./TodaysData");

async function injuriesF() {
    return new Promise((resolve) => {
        injuries.getInjuries().then((res) => {
            resolve(res); 
        });
    })
} 

async function standingsF() {
    return new Promise((resolve) => {
        standings.getStandings().then((res) => {
            resolve(res); 
        });
    })
} 

async function highlightsF() {
    return new Promise((resolve) => {
        highlights.getHighlights1().then((res) => {
            resolve(res); 
        });
    })
}

async function gamesCount() {
    return new Promise((resolve) => {
        todaysData.getGamesCount().then((res) => {
            resolve(res); 
        });
    })
}

// console.log("HIGHLIGHTS");
// // console.log(highlightsF().then((res) => {console.log(res)}));
// console.log("INJURIES");
// // injuriesF();
// console.log("STANDINGS");
// standingsF();

module.exports = {
    highlightsF,
    standingsF,
    injuriesF,
    gamesCount
}