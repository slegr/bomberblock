/**
 * Auteur : Simon Legros
 * Date : 30/01/2018
 */

// import Main from 'Main';
//let main = new Main();
let client = {};
client.id = null;

window.onload = () => {
    
    init();
    client.socket = io(); //'https://simonlegros.ca:8080'

    client.socket.on('addNewPlayer', function (data) {
        if (game.state.getCurrentState().addNewPlayer) {
            game.state.getCurrentState().addNewPlayer(data);
        }
    });

    client.socket.on('gameEntered', function(data){
        client.id = data.id;
        enterGame();
    });

    client.socket.on('updateMainMenu', function(data){
        if (game.state.getCurrentState().updateMainMenu){
            game.state.getCurrentState().updateMainMenu(data);
        }
    });

    client.socket.on('matchEntered', function(data){
        if (game.state.getCurrentState().joinMatch) {
            game.state.getCurrentState().joinMatch(data);
        }
    });

    client.socket.on('joinMatch_error', function(data){
        if (game.state.getCurrentState().errorJoiningMatch) {
            game.state.getCurrentState().errorJoiningMatch(data);
        }
    });

    client.socket.on('currentMatchState', function(data){

    });

    client.socket.on('updateLobby', function(data){
        if (game.state.getCurrentState().updateLobby) {
            game.state.getCurrentState().updateLobby(data);
        }
    });

    client.socket.on('gotoGameState', function(data) {
        if (game.state.getCurrentState().gotoGameState) {
            game.state.getCurrentState().gotoGameState(data);
        }
    });

    client.socket.on('gotoLobbyState', function() {
        if (game.state.getCurrentState().gotoLobbyState) {
            game.state.getCurrentState().gotoLobbyState();
        }
    });

    client.socket.on('updateGame', function(data) {
        if (game.state.getCurrentState().updateGame) {
            game.state.getCurrentState().updateGame(data);
        }
    });


    client.socket.on('currentGameState', function (data) {
        if (game.state.getCurrentState().addCurrentMap) {
            game.state.getCurrentState().addCurrentMap(data.currentMap);
        }
        if (game.state.getCurrentState().addCurrentPlayers) {
            game.state.getCurrentState().addCurrentPlayers(data.players);
        }
    });

    client.socket.on('currentMap', function(data){
        if (game.state.getCurrentState().addCurrentMap) {
            game.state.getCurrentState().addCurrentMap(data);
        }
    });

    client.socket.on('currentPlayers', function (data) {
        if (game.state.getCurrentState().addCurrentPlayers) {
            game.state.getCurrentState().addCurrentPlayers(data);
        }
    });

    client.socket.on('myplayer', function (player) {
        if (game.state.getCurrentState().addMyPlayer) {
            game.state.getCurrentState().addMyPlayer(player);
        }
    });

    client.socket.on('startCountDown', function(){
        if (game.state.getCurrentState().startCountDown) {
            game.state.getCurrentState().startCountDown();
        }
    });

    client.socket.on('gameIsStarted', function () {
        if (game.state.getCurrentState().startGame) {
            game.state.getCurrentState().startGame();
        }
    });

    client.socket.on('gameEnded', function () {
        if (game.state.getCurrentState().gameOver) {
            game.state.getCurrentState().gameOver();
        }
    });

    client.socket.on('playerDead', function (data) {
        if (game.state.getCurrentState().playerDead) {
            game.state.getCurrentState().playerDead(data);
        }
    });

    client.socket.on('playerRevive', function (data) {
        if (game.state.getCurrentState().playerRevive) {
            game.state.getCurrentState().playerRevive(data);
        }
    });

    client.socket.on('newPerk', function (data) {
        if (game.state.getCurrentState().addNewPerk) {
            game.state.getCurrentState().addNewPerk(data);
        }
    });

    client.socket.on('removeMoney', function (data) {
        if (game.state.getCurrentState().removeMoney) {
            game.state.getCurrentState().removeMoney(data);
        }
    });

    client.socket.on('removePerk', function (data) {
        if (game.state.getCurrentState().removePerk) {
            game.state.getCurrentState().removePerk(data);
        }
    });


    client.socket.on('newMessages', function(data){
        updateChatMessages(data);
    });

    client.socket.on('removePlayer', function(data){
        if (game.state.getCurrentState().removePlayer) {
            game.state.getCurrentState().removePlayer(data);
        }
    });

    client.socket.on('connect_error', function (e) {
        client.error = true;
        showErrorConnection();
        if (game.state.getCurrentState().connectionFailure) {
            game.state.getCurrentState().connectionFailure();
        }
    });

    client.socket.on('reconnect', function (e) {
        hideErrorConnection();
        client.error = false;
        if (game.state.getCurrentState().connectionEstablished) {
            game.state.getCurrentState().connectionEstablished();
        }
    });
};
client.actionPlay = function (username, color){
    client.socket.emit('actionPlay', username, color);
}

client.updateMainMenu = function(){
    client.socket.emit('updateMainMenu');
}

client.joinMatch = function(matchID=null){
    client.socket.emit('joinMatch', matchID);
}

client.getCurrentMatchState = function(){
    client.socket.emit('getCurrentMatchState');
}

client.leaveMatch = function(){
    client.socket.emit('leaveMatch');
}

client.readyToPlay = function(data){
    client.socket.emit('readyToPlay', data);
}

//Envois des positions au serveur
client.newPosition = function(data){
    client.socket.emit('newPosition', data);
}

client.collectMoney = function(data){
    client.socket.emit('collectMoney', data);
}

client.collectPerk = function (data) {
    client.socket.emit('collectPerk', data);
}

client.newMessage = function(data){
    client.socket.emit('newMessage', data);
}

client.quitGame = function(){
    client.socket.emit('quitGame');
}

client.bulletHitPlayer = function(playerID){
    client.socket.emit('bulletHitPlayer', playerID);
}

client.buyAmmo = function(nbAmmo){
    client.socket.emit('buyAmmo', nbAmmo);
}

client.buyMoney = function (nbMoney) {
    client.socket.emit('buyMoney', nbMoney);
}

client.exchangeSweatcoins = function(){
    client.socket.emit('exchangeSweatcoins');
}

