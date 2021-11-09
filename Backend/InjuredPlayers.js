const httpGetter = require("./HttpGetter");

async function getInjuries() {
    return new Promise((resolve) => {
        let res = httpGetter.getContent('www.fantasylabs.com', '/api/players/news/2/');
        resolve(res);
        }) 
}

module.exports = {
  getInjuries
}