const httpGetter = require("./HttpGetter");

async function getGamesCount() {
    return new Promise((resolve) => {
        const dateObj = new Date();
        const month = dateObj.getUTCMonth() + 1; //months from 1-12
        const day = Number(dateObj.getUTCDate()) - 1;
        const year = dateObj.getUTCFullYear();
        // const addr = 
        const res = httpGetter.getContent('data.nba.net', '/prod/v1/'+year+month+day+'/scoreboard.json');
        resolve(res);
        }) 
}

module.exports = {
    getGamesCount
  }