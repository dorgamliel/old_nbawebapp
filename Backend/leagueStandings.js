const httpGetter = require("./HttpGetter");

async function getStandings() {
    return new Promise((resolve) => {
        let res = httpGetter.getContent('data.nba.net', '/prod/v1/current/standings_conference.json');
        resolve(res);
        }) 
}

module.exports = {
    getStandings
  }