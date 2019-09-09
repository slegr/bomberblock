let log = console.log;
let fs = require('fs');
let express = require('express');
let app = express();
let server = require('http').Server(app);
server.listen(process.env.PORT || 8080, function () {
    console.log('Listening on ' + server.address().port);
});
let io = require('socket.io').listen(server);
let Events = require('events');
let eventEmitter = new Events;
module.exports = {io, eventEmitter};

let path = require('path');
let router = express.Router();
let Player = require('./model/entity/moving_entity/Player');
let Bullet = require('./model/entity/moving_entity/Bullet');
let Match = require('./model/match/Match');
let Map = require('./model/Map');
let Utils = require('./utils');
let DAO_DB = require('./DAO/DAO_DB');

app.set('view engine', 'ejs');

//app.use(express.static('public'));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/game', express.static(path.join(__dirname, 'public')));
app.use('/socket.io', express.static(path.join(__dirname, 'public/js/socket.io')));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

/* REQUETE DE PAGES */
app.get('/', (request, response) => {
    response.render('pages/index', { test: 'salut' });
});

app.get('/game', (request, response) => {
    let ip = request.headers["x-real-ip"];
    let port = request.headers["x-real-port"];
    let cookie_io = request.headers.cookie;
    writeToLog(ip, port, cookie_io);
    response.render('pages/game');
});

app.get('/aboutgame', (request, response) => {
    let ip = request.headers["x-real-ip"];
    let port = request.headers["x-real-port"];
    let cookie_io = request.headers.cookie;
    writeToLog(ip, port, cookie_io);
    response.render('pages/aboutgame');
});

/**
 * LOGIQUE DU SERVEUR
 * 
 * Le serveur 
 * une connection se fait, le socket du nouveau joueur est ajouté à la
 * liste des sockets connectées. 
 *
 */

const WORLD_SIZE = 4096;
let lastPlayerID = 0;
let player_connected = {};
let player_inMenu = {};
let matchList = {};
let newBullets = [];
let allMessages = [], newMessages = [];

let dao_db = new DAO_DB();
let map_template = new Map(WORLD_SIZE);

//let currentMap = new Map(WORLD_SIZE); //POUR L'INSTANT TJRS RANDOM AU RESTART DU SERVER

io.on('connection', function (socket) {
    // console.log("CONNECTION!");
    var ip = socket.handshake.headers["x-real-ip"];
    var port = socket.handshake.headers["x-real-port"];
    writeToLog(ip, port);
    socket.customID = lastPlayerID++;
    player_connected[socket.customID] = socket;

    //Le joueur a appuyé sur PLAY dans le menu
    //création d'un joueur et retour de résultat
    socket.on('actionPlay', function(username, color){
        username = username.substring(0,9);
        let player = new Player(socket.customID, username, color);
        player_inMenu[socket.customID] = player; 
        socket.emit("gameEntered", player);
    });

    socket.on('updateMainMenu', function(){
        let data = {};
        data.player = player_inMenu[socket.customID];
        data.totalPlayerConnected = (Object.keys(player_connected)).length;
        data.scores = dao_db.getAllScores();
        socket.emit('updateMainMenu', data);
    });

    socket.on('joinMatch', function(matchID=null) {
        let matchFound = false;
        if (matchID) {
            let result = matchList[matchID].join(socket, player_inMenu[socket.customID]);
            if(!result.success){
                socket.emit('joinMatch_error', 'Cannot join this match');
            }
            else{
                socket.currentMatchID = id_match;
                delete player_inMenu[socket.customID];
            }
        }
        else{
            if (Object.keys(matchList).length <= 0){
                let id_match = createMatch();
                let result = matchList[id_match].join(socket, player_inMenu[socket.customID]);
                if (result.success) {
                    matchFound = true;
                    socket.currentMatchID = id_match;
                    delete player_inMenu[socket.customID];
                }
            }
            else{
                let timeout = setTimeout(()=>{
                    if(!matchFound){
                        matchFound = true;
                        clearInterval(interval);
                        socket.emit('joinMatch_error', 'No match found');
                        let id_match = createMatch();
                        let result = matchList[id_match].join(socket, player_inMenu[socket.customID]);
                        if (result.success) {
                            matchFound = true;
                            socket.currentMatchID = id_match;
                            delete player_inMenu[socket.customID];
                        }
                    }
                },1000 * 10);
                let interval = setInterval(()=>{
                    for(let id in matchList){
                        let result = matchList[id].join(socket, player_inMenu[socket.customID]);
                        if (result.success) {
                            clearTimeout(timeout);
                            matchFound = true;
                            socket.currentMatchID = result.id;
                            delete player_inMenu[socket.customID];
                            clearInterval(interval);
                            break;
                        }
                    }
                },1000);
            }
        }
    });

    socket.on('getCurrentMatchState', function() {
        if (matchList[socket.currentMatchID]){
            matchList[socket.currentMatchID].sendCurrentGameState(socket);
        }
    });
    
    socket.on('leaveMatch', function(){
        leaveMatch(socket);
    });

    socket.on('readyToPlay', (isReady) => {
        if (matchList[socket.currentMatchID]){
            matchList[socket.currentMatchID].setIsReady(socket, isReady);
        }
    });

    socket.on('newPosition', function(data){
        if (matchList[socket.currentMatchID]){
            matchList[socket.currentMatchID].updatePlayer(socket, data);
        }
    });

    socket.on('collectMoney', function (data) {
        if (matchList[socket.currentMatchID]) {
            matchList[socket.currentMatchID].collectMoney(socket, data);
        }
    });

    socket.on('collectPerk', function (data) {
        if (matchList[socket.currentMatchID]) {
            matchList[socket.currentMatchID].collectPerk(socket, data);
        }
    });

    socket.on('newMessage', function(data){
        if(data){
            newMessages.push(data);
            io.sockets.emit('newMessages', data);
        }
    });

    socket.on('quitGame', function(){
        quitGame(socket);
    });

    socket.on('bulletHitPlayer', function(otherPlayerID){
        if (matchList[socket.currentMatchID]) {
            matchList[socket.currentMatchID].bulletHit(socket, otherPlayerID);
        }
    });

    socket.on('buyAmmo', function (nbAmmo) {
        if (matchList[socket.currentMatchID]) {
            matchList[socket.currentMatchID].buyAmmo(socket, nbAmmo);
        }
        else if (player_inMenu[socket.customID]) {
            player_inMenu[socket.customID].buyAmmo(nbAmmo);
        }
    });

    socket.on('exchangeSweatcoins', function () {
        if (matchList[socket.currentMatchID]) {
            matchList[socket.currentMatchID].exchangeSweatcoins(socket);
        }
        else if (player_inMenu[socket.customID]){
            player_inMenu[socket.customID].exchangeSweatcoins();
        }
    });

    socket.on('buyMoney', function (nbMoney) {
        if (matchList[socket.currentMatchID]) {
            matchList[socket.currentMatchID].buyMoney(socket, nbMoney);
        }
    });


    //Le joueur se déconnecte ou quitte la page
    socket.on('disconnect', function () {
        quitGame(socket);
        delete player_connected[socket.customID];
        // delete players_list[socket.customID];
    });

});

function createMatch(){
    // console.log("NEW MATCH CREATED!");
    let match = new Match(map_template);
    matchList[match.id] = match;
    return match.id;
}

function leaveMatch(socket){
    if ((socket.currentMatchID != null || socket.currentMatchID != undefined) && matchList[socket.currentMatchID]) {
        let result = matchList[socket.currentMatchID].leaveMatch(socket);
        player_inMenu[socket.customID] = result.player;
        if (result.roomEmpty){
            matchList[socket.currentMatchID].destroy();
            delete matchList[socket.currentMatchID];
        }
        socket.currentMatchID = null;
        
    }
}

function quitGame(socket){
    leaveMatch(socket);
    delete player_inMenu[socket.customID];
}

function writeToLog(ip, port, cookie_id) {
    let text = "\n==============================="+
            "\nConnection : " + (new Date()).toString() + 
            "\nFROM       : " + ip + ":" + port +
            "\nCOOKIE ID  : " + cookie_id + "\n";
    fs.appendFile("log", text, function(err){
        if(err){
            return console.log(err);
        }
    });
}

eventEmitter.on('insertNewScores', (data) => {
    insertNewScores(data);
});

function insertNewScores(data) {
    dao_db.insertNewScores(data);
}

