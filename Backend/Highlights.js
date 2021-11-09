require('isomorphic-fetch');

async function getHighlights() {
    const response = await fetch('https://www.youtube.com/playlist?list=PLGhYnSIdMJtPcrd6nNfUx1XGGUFu2gkHl');
    const result = await response.text();
    // console.log(result)
    return result;
}

function parseToSet(htmlContent) {
    const htmlSplitted = htmlContent.split('videoId":"');
    const videos = new Set();
    for (let i=1; i<htmlSplitted.length; i++) {
        videos.add("https://www.youtube.com/watch?v=" + htmlSplitted[i].split("\"")[0]);
        if (videos.size == 10) {
            break;
        }
    }
    const vids = Array.from(videos);
    return vids;
}

async function getHighlights1() {
    return new Promise((resolve) => {
        getHighlights().then(htmlContent => {
            const res = (parseToSet(htmlContent))
            resolve(res);
        })
    })
}

module.exports = {
    getHighlights1
    }