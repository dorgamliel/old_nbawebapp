const WebSocket = require('ws');
const { login, signup, getGameBets, sendBet, alreadyBetted, getLeaderboard, updateLeaderboard, resetAllGames } = require('./DBUse');

const { highlightsF, standingsF, injuriesF, gamesCount } = require('./DataCollector');

const schedule = require('node-schedule');
// import schedule from 'node-schedule';
var Cookies = require('cookies')



// Set up server
const wss = new WebSocket.Server({ port: 8080 });

async function func() {
  // Wire up some logic for the connection event (when a client connects) 
  wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
      let team1 = [];
      let team2 = [];
      console.log('received: %s', message.toString());
      if ( message.toString().length === 1) {
        ws.send('Hello client!');
        const x = getGameBets(message.toString());
        x.then((res) => {
          for (let i=0; i<res.length; i++) {
            if (res[i].team % 2 === 1) {
              team1.push(res[i].username)
            } else {
              console.log('res is ', Number(message.toString()) % 2)
              team2.push(res[i].username)
            }
          }
          ws.send('team'+message.toString()+'1:'+team1.toString());
          ws.send('team'+message.toString()+'2:'+team2.toString());
        });
      } else if (message.toString().startsWith('sendBet')) {
        const gameStrLen = message.toString().split(',')[1].length;
        const gameNum = message.toString().split(',')[1].slice(0,gameStrLen-1);
        const gameBet = message.toString().split(',')[1].charAt(gameStrLen-1);
        const gameUser = message.toString().split(',')[2];
        ws.send('Hello client!');
        const bet = getGameBets(gameNum).then((res)=>{
          for (let i=0; i<res.length; i++) {
            if (res[i]['username'] === gameUser) {
              ws.send('Already voted');
              return;
            }
          }
          const x = sendBet(gameNum, gameUser, gameBet); //TODO: username
        });
      } else if (message.toString() === 'highlights') {
        const x = highlightsF();
        x.then((res) => {
          console.log('got highlights ', res);
          ws.send(res.toString());
        })
      } else if (message.toString() == 'standings') {
        console.log(' received standings request from client');
        const stnd = standingsF();
        let teamName, teamNickname, wins, losses, streak, pct;
        stnd.then((res) => {
          let length = res['league']['standard']['conference']['east'].length;
          for (let i=0; i<length; i++) {
            teamName = res['league']['standard']['conference']['east'][i]['teamSitesOnly']['teamName'];
            teamNickname = res['league']['standard']['conference']['east'][i]['teamSitesOnly']['teamNickname'];
            wins = res['league']['standard']['conference']['east'][i]['win'];
            losses = res['league']['standard']['conference']['east'][i]['loss'];
            streak = res['league']['standard']['conference']['east'][i]['streak'];
            pct = res['league']['standard']['conference']['east'][i]['gamesBehind'];
            ws.send(teamName+','+teamNickname+','+wins+','+losses+','+streak+','+pct);
          }
        })
      } else if (message.toString() == 'injuries') {
        let playerName, playerStatus, injury, team, title;
        const injr = injuriesF();
        injr.then((res) => {
          console.log()
          for (let i=0; i<res.length; i++) {
            if (res[i]['PlayerStatus'] !== 'Active') {
              playerName = (res[i]['PlayerName'])
              playerStatus = (res[i]['PlayerStatus'])
              injury = (res[i]['Injury'])
              team = (res[i]['Team'])
              title = (res[i]['Title'])
              ws.send(playerName+','+playerStatus+','+injury+','+team+','+title);
            }
          }
          console.log('sending injuries: ', res);
        })

      } else if (message.toString() === 'gamesCount') {
        const count = gamesCount();
        count.then((res) => {
          ws.send(res['numGames']);
        });
      } else if (message.toString() === 'gamesTeams') {
        const count = gamesCount();
        count.then((res) => {
          let teams = [];
          for (let i=0; i<res['games'].length; i++) {
            teams.push(res['games'][i]['hTeam']['triCode'])
            teams.push(res['games'][i]['vTeam']['triCode'])
          }
          setTimeout(() => {
            ws.send(teams.toString());
          }, 200);
        });
      } else if (message.toString() === 'leaderboard') {
          const lead = getLeaderboard();
          lead.then((res) => {
          // ws.send(res);
          let lead = [];
          ws.send(JSON.stringify(res));
        })
      } else if(message.toString().startsWith('updateLeaderboard')) {
          const data = message.toString().split('updateLeaderboard')[1];
          const lead = updateLeaderboard();
          lead.then((res) => {
            // ws.send(res);
            console.log('updated successfuly! ', res);
            // ws.send(JSON.stringify(res));
          });
      } else if (message.toString().startsWith('login')) {

        let username = message.toString().split(',')[1];
        let password = message.toString().split(',')[2];
        // const data = login('Koala', 123)
        const data = login(username, password).then((res) => {
          ws.send(res);
        })
      } else if(message.toString().startsWith('signup')) {
        let username = message.toString().split(',')[1];
        const data = signup(username).then((res) => {
          ws.send(res)
        })
      } else if (message.toString().startsWith('alreadyVoted')) {
        const gameNum = message.toString().split(',')[1];
        const user = message.toString().split(',')[2];
        // const user = window.localStorage.getItem('username');
        alreadyBetted(gameNum, user).then((res) => {
          if (res.length > 0) {
            ws.send(`true,${gameNum}`);
          } else {
            ws.send('false')
          }
        })
      }
    });
  });
}

async function dailyUpdate() {
  schedule.scheduleJob('0 8 * * *', () => {
    updateLeaderboard();
    //reset all bets tables
    resetAllGames();
  })
}

dailyUpdate();

func();