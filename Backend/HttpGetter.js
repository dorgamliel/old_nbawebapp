async function getContent(hostname, path) {
    const https = require('https');
        let chunks = [];
        const options = {
        hostname: hostname,
        port: 443,
        path: path,
        method: 'GET'
        }
    return new Promise((resolve) => {
        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            res.on('data', d => {
            chunks.push(d);
            })
            res.on('end', d => {
            let data = Buffer.concat(chunks);
            let parsedDataList = JSON.parse(data);
            resolve(parsedDataList);
            })
        })
        req.on('error', error => {
            console.error(error)
        })
        req.end()
    })
}

module.exports = {
    getContent
}