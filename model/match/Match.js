const WORLD_SIZE = 4096;

let lastMatchID = 0;
let lastCoinID = 0;
let lastItemID = 0;
let Utils = require("../../utils");
let Map = require('../Map');
let Bullet = require('../entity/moving_entity/Bullet');
let Coin = require('../entity/Object/Coin');
let Perk = require('../entity/Object/Perk');

let {io, eventEmitter} = require('../../server');

module.exports = class Match {
    // id : integer
    // rules = rule json object
    constructor(map) {
        this.id = lastMatchID;
        this.sockets = {};
        this.players = {};
        this.playersToRemove = [];
        this.ennemies = {};
        this.currentMap = map;
        this.borne_perks = this.currentMap.item_pos_deploy;
        this.currentTime = 0;
        this.maxTime = 10;
        this.nbPlayers = 0;
        this.minPlayers = 2;
        this.maxPlayers = 4; 
        this.isFull = false;
        this.isEmpty = false;
        this.isInLobby = true;
        this.isInGame = false;
        this.chronoEnded = false;
        this.allPlayersReady = false;
        this.gameStarted = false;
        this.countDownStarted = false;
        this.gameEnded = false;
        this.countDownTime = 3;
        this.pointBase_parSeconde = 10;
        this.newBullets = [];
        this.moneyList = {};
        this.newPerks = [];
        this.perkList = {};
        lastMatchID++;

        this.max_time_in_lobby = 20 // secondes
        this.max_time_in_Game = 60 * 5;
        this.current_time = 0;

        this.intervalLobby = null;
        this.intervalGame = null;
        this.intervalTimeGame = null;
        this.intervalCountDown = null;

        this.type = "Free For All";
        
        this.roomName = "room"+this.id;
        this.init();
    }

    init() {
        this.goToLobbyState();
    }

    join( socket , player) {
        let result = {};
        result.success = true;
        if(this.isFull){
            result.success = false;
        }
        else{
            socket.join(this.roomName);
            let pos = this.getBestSpawningPosition();
            player.setPos(pos.x, pos.y, pos.z);
            let data = {
                id : this.id,
                isInLobby : this.isInLobby,
                isInGame : this.isInGame
            };
            socket.emit('matchEntered', data);
            result.id = this.id;
            result.socket = socket;
            if(this.isInGame){
                setTimeout(()=>{
                    player.init();
                    socket.to(this.roomName).emit('addNewPlayer', player);
                },3000);
            }
            this.sockets[socket.customID] = socket;
            this.players[socket.customID] = player;
            this.nbPlayers++;
            if (Object.keys(this.players).length >= this.maxPlayers) {
                this.isFull = true;
            }
        }

        return result;
    }

    leaveMatch(socket){
        let result = {};
        result.player = this.players[socket.customID];
        result.player.isReady = false;
        this.removePlayer(socket);
        result.roomEmpty = this.isEmpty;
        return result;
    }

    removePlayer(socket){
        socket.leave(this.roomName);
        delete this.sockets[socket.customID];
        this.playersToRemove.push(socket.customID);
        delete this.players[socket.customID];
        socket.to(this.roomName).emit('removePlayer', socket.customID);
        this.nbPlayers--;
        if ((Object.keys(this.players)).length <= 0){
            this.isEmpty = true;
        }
        this.isFull = false;
    }

    setIsReady(socket, isReady){
        if (this.players[socket.customID]){
            this.players[socket.customID].isReady = isReady;
        }
        if(this.gameStarted){
            socket.emit('gameIsStarted');
        }
    }

    updateLobby(){
        let pack = {};
        pack.players = [];
        for (let i in this.players) {
            let player = this.players[i];
            pack.players.push({
                id: player.id,
                username : player.username,
                isReady : player.isReady,
                color : player.color
            });
        }
        pack.matchState = {};
        pack.matchState.id = this.id;
        pack.matchState.type = this.type;
        pack.matchState.time = this.current_time;
        pack.matchState.maxPlayers = this.maxPlayers;
        pack.matchState.minPlayers = this.minPlayers;
        pack.matchState.nbPlayers = Object.keys(this.players).length;
        pack.matchState.mapName = this.currentMap.mapName;
        pack.matchState.mapImagePath = this.currentMap.mapImagePath;
        pack.playersToRemove = this.playersToRemove;
        io.sockets.in(this.roomName).emit('updateLobby', pack);
        this.playersToRemove = [];
    }

    updateGame(){
        let pack = {};
        pack.newBullets = this.newBullets;
        pack.players = [];
        for (let i in this.players) {
            let player = this.players[i];
            pack.players.push({
                x: player.x,
                y: player.y,
                z: player.z,
                vX: player.velocityX,
                vY: player.velocityY,
                vZ: player.velocityZ,
                id: player.id,
                username : player.username,
                color : player.color,
                d: player.direction,
                score: player.score,
                life : player.life,
                isAlive : player.isAlive,
                shield : player.shield,
                kills: player.kills,
                deaths: player.deaths,
                money : player.money,
                sweatcoin : player.sweatcoin,
                nbBulletsLeft: player.nbBulletsLeft,
                isShooting: player.isShooting,
                isWalking: player.isWalking,
                isStepingBack: player.isStepingBack,
                isMovingLeftRight : (player.isGoingLeft || player.isGoingRight),
            });
        }
        pack.matchState = {};
        pack.matchState.time = this.current_time;
        pack.matchState.countDownTime = this.countDownTime;
        pack.playersToRemove = this.playersToRemove;
        io.sockets.in(this.roomName).emit('updateGame', pack);
        this.newBullets = [];
        this.playersToRemove = [];
    }

    updatePlayer(socket, data){
        if (this.players[socket.customID]){
            let result = this.players[socket.customID].update(data);
            if(result && result.bullet){
                this.newBullets.push(result.bullet);
            }
        }
    }

    collectMoney(socket, moneyID){
        let money = this.moneyList[moneyID];
        if (money && this.players[socket.customID]) {
            this.players[socket.customID].money += money.value;
            delete this.moneyList[moneyID];
            socket.to(this.roomName).emit('removeMoney', moneyID);
        }
    }

    collectPerk(socket, perkID) {
        let perk = this.perkList[perkID];
        if (perk && this.players[socket.customID]) {
            if(perk.type == 'health'){
                this.players[socket.customID].addLife(perk.value);
            }
            else if(perk.type == 'shield'){
                this.players[socket.customID].addShield(perk.value);
            }
            else if (perk.type == 'bullet') {
                this.players[socket.customID].addBullet(perk.value);
            }
            delete this.perkList[perkID];
            socket.to(this.roomName).emit('removePerk', perkID);
            this.checkPerkBelongToBorne(perkID);
        }
    }

    checkPerkBelongToBorne(perkID){
        for (let i = 0; i < this.borne_perks.length; i++) {
            let borne = this.borne_perks[i];
            if (perkID == borne.itemID){
                borne.itemID = null;
                this.initBornePerk(i);
            }
        }
    }

    createMoney(x, y, z, value){
        lastCoinID++;
        this.moneyList[lastCoinID] = new Coin(lastCoinID, x, y, z, value);
        return this.moneyList[lastCoinID];
    }

    buyAmmo(socket, nbAmmo){
        this.players[socket.customID].buyAmmo(nbAmmo);
    }

    exchangeSweatcoins(socket){
       this.players[socket.customID].exchangeSweatcoins();
    }

    buyMoney(socket, nbMoney) {
        this.players[socket.customID].buyMoney(nbMoney);
    }

    bulletHit(socket, otherPlayerID){
        let player = this.players[otherPlayerID];
        if (this.players[socket.customID] && player) {
            let result = player.gotHit();
            this.players[socket.customID].targetHit(result.alive);
            if (!result.alive) {
                let money = this.createMoney(player.x, player.y, player.z, result.value);
                io.sockets.in(this.roomName).emit('playerDead', [otherPlayerID, money]);
                setTimeout(()=>{
                    if (this.players[otherPlayerID]){
                        let pos = this.getBestSpawningPosition();
                        this.players[otherPlayerID].revive(pos.x, pos.y, pos.z);
                        io.sockets.in(this.roomName).emit('playerRevive', this.players[otherPlayerID]);
                    }
                },5000);
            }
        }
    }
    
    getNbReady(){
        let nbReady = 0;
        Object.keys(this.players).forEach((socketID)=>{
            if (this.players[socketID] && this.players[socketID].isReady) {
                nbReady++;
            }
        });
        return nbReady;
    }

    checkNumberPlayer(){
        if( Object.keys(this.players).length == this.maxPlayers || (this.chronoEnded && Object.keys(this.players).length >= this.minPlayers)){
            if(this.getNbReady() == Object.keys(this.players).length){
                this.goToGameState();
            }
        }
    }

    goToGameState(socket){
        this.isInLobby = false;
        this.isInGame = true;
        this.chronoEnded = false;
        this.gameStarted = false;
        this.countDownStarted = false;
        this.gameEnded = false;
        this.countDownTime = 3;
        this.newBullets = [];
        clearInterval(this.intervalLobby);
        Object.keys(this.players).forEach((socketID) => {
            this.players[socketID].init();
        });
        this.setRandomPos();
        io.sockets.in(this.roomName).emit('gotoGameState');
        this.intervalGame = setInterval(()=>{
            this.updateGame(); 
        }, 1000 / 25);
        this.current_time = 0;
        this.intervalTimeGame = setInterval(()=>{
            this.checkStateOfGame();
        }, 1000);
    }

    checkStateOfGame(){
        if (!this.gameStarted && !this.countDownStarted) { //la partie attent encore que tout le monde soit pret
            if (this.getNbReady() == Object.keys(this.players).length) {
                this.startCountDown();
            }
        }
        else if (this.gameStarted && !this.gameEnded) {
            if (this.current_time <= 0 || this.nbPlayers <= 1) {
                this.gameEnded = true;
                this.gameStarted = false;
                this.insertNewScores();
                io.sockets.in(this.roomName).emit('gameEnded');
                setTimeout(() => {
                    this.goToLobbyState();
                }, 5000);
                clearInterval(this.intervalTimeGame);
            }
            else {
                this.current_time--;
                this.checkPlayerInBase();
            }
        }
    }
    checkPlayerInBase(){
        Object.keys(this.players).forEach((socketID) => {
            let player = this.players[socketID];
            if(player.isInBase){
                player.score += this.pointBase_parSeconde;
            }
        });
    }

    insertNewScores(){
        let data = [];
        Object.keys(this.players).forEach((socketID) => {
            let player = this.players[socketID];
            data.push({
                username : player.username,
                score : player.score,
                color : player.color,
            });
        });
        eventEmitter.emit('insertNewScores', data);
    }
    
    initAllBornesPerks(){
        for (let i = 0; i < this.borne_perks.length; i++) {
            this.initBornePerk(i);
        }
    }

    initBornePerk(borneId){
        let borne = this.borne_perks[borneId];
        let rndTime = Utils.random(1000*5, 1000*15);
        setTimeout(() => {
            let perk = this.createRandomPerk(borne.x, borne.y, borne.z);
            io.sockets.in(this.roomName).emit('newPerk', perk);
            borne.itemID = perk.id;
        }, rndTime);
    }
    

    createRandomPerk(x, y, z){
        lastItemID++;
        this.perkList[lastItemID] = new Perk(lastItemID, x, y, z);
        return this.perkList[lastItemID];

    }

    startCountDown(){
        this.countDownTime = 3;
        this.countDownStarted = true;
        io.sockets.in(this.roomName).emit('startCountDown');
        this.intervalCountDown = setInterval(()=>{
            this.countDownTime--;
            if(this.countDownTime <= 0){
                this.gameStarted = true;
                this.initAllBornesPerks();
                this.current_time = this.max_time_in_Game;
                clearInterval(this.intervalCountDown);
            }
        },1000);
    }
    getCurrentInfo(){
        let currentGame = {};
        currentGame.currentMap = this.currentMap;
        currentGame.players = this.getAllPlayers();
        currentGame.time = this.current_time;
        return currentGame;
    }
    getAllPlayers() {
        let players = [];
        Object.keys(this.players).forEach((socketID)=>{
            if (this.players[socketID]) {
                let player = this.players[socketID];
                players.push(player);
            }
        });
        return players;
    }

    getBestSpawningPosition(){
        let spawnPositions = this.currentMap.positions_initiales;
        let bestIndex = null;
        if (this.nbPlayers <= 0){
            bestIndex = 0;
        }
        else{
            let allDistances = [];
            for (let i = 0; i < spawnPositions.length; i++) {
                let pos = spawnPositions[i];
                let distanceTotale = 0;
                Object.keys(this.players).forEach((socketID) => {
                    let player = this.players[socketID];
                    if(player){
                        let playerPos = {
                            x : player.x,
                            y : player.y
                        };
                        distanceTotale += Utils.getDistanceBetween(pos, playerPos);
                    }
                });
                allDistances.push(distanceTotale);
            }
            bestIndex = allDistances.indexOf(Math.max(...allDistances));
        }
        return spawnPositions[bestIndex];
    }

    setRandomPos(){
        Object.keys(this.players).forEach((socketID)=>{
            if (this.players[socketID]) {
                let pos = this.getBestSpawningPosition();
                this.players[socketID].setPos(pos.x, pos.y, pos.z);
            }
        });
    }

    goToLobbyState(){
        this.isInLobby = true;
        this.isInGame = false;
        this.chronoEnded = false;
        Object.keys(this.players).forEach((socketID) => {
            this.players[socketID].init();
        });
        clearInterval(this.intervalGame);
        this.current_time = this.max_time_in_lobby;
        this.intervalLobby = setInterval(()=>{
            this.checkNumberPlayer();
            this.updateLobby();
            if(this.current_time > 0){
                this.current_time--;
            }
            else{
                this.chronoEnded = true;
            }
        }, 1000);
        io.sockets.in(this.roomName).emit('gotoLobbyState');
    }

    sendCurrentGameState(socket){
        socket.emit('currentMap', this.currentMap);
        socket.emit('myplayer', this.players[socket.customID]);
        setTimeout(() => {
            socket.emit('currentPlayers', this.getAllPlayers());
        }, 2000);
    }

    sendGameCurrentState_toAll(){

    }

    start_match() {

    }

    step_match() {

    }

    end_match() {

    }


    destroy(){
        if(this.intervalLobby){
            clearInterval(this.intervalLobby);
        }
        if(this.intervalGame){
            clearInterval(this.intervalGame);
        }
    }
}