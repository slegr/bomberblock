BomberBox.Lobby.prototype = {
    init: function () {
        this.menu_panel = null;
        this.header = null;
        this.matchInfoCtn = null;
        this.labelMatchRoom = null;
        this.labelMatchType = null;
        this.labelMatchNumPlayers = null;
        this.labelTimer = null;
        this.imageMatch = null;
        this.labelMapName = null;
        this.playersInfoCtn = null;
        this.playersCtn = {};
        this.footer = null;
        this.btnReady = null;
        this.btnLeave = null;
        this.loadingSprite = null;
        this.intervalUpdate = null;
        this.isReady = false;
        this.helpMessage_isBlinking = false;

        this.pauseMenu = null;

    },
    preload: function () {
        let eventMusic = new CustomEvent('sm_lobby');
        window.dispatchEvent(eventMusic);
        this.createMenu();
        this.addListeners();
        $(".lobbyHelpMessage").hide();
        $(".lobbymenu").hide();
        $(".lobbymenu").fadeIn(500);
    },

    createMenu: function () {
        this.menu_panel = document.createElement("div");
        this.menu_panel.className = "lobbymenu";

        this.header = document.createElement("div");
        this.header.className = "lobbymenu-header";
        this.header.appendChild(this.addLabel("BomberBlock"));
        this.header.appendChild(this.addTitle("LOBBY"));

        /* MATCH */
        this.matchInfoCtn = document.createElement("div");
        this.matchInfoCtn.className = "lobbymenu-matchCtn";

        let ctn = this.createContainer("1fr 1fr 1fr 50px", false);

        this.labelMatchRoom = document.createElement("div");
        this.labelMatchRoom.className = "lobbymenu-matchCtn-label";
        ctn.appendChild(this.labelMatchRoom);

        this.labelMatchType = document.createElement("div");
        this.labelMatchType.className = "lobbymenu-matchCtn-label";
        ctn.appendChild(this.labelMatchType);

        this.labelMatchNumPlayers = document.createElement("div");
        this.labelMatchNumPlayers.className = "lobbymenu-matchCtn-label";
        ctn.appendChild(this.labelMatchNumPlayers);

        let helpMessage = document.createElement("div");
        helpMessage.className = "lobbyHelpMessage";
        helpMessage.textContent = "Waiting for other players";
        ctn.appendChild(helpMessage);
        
        this.matchInfoCtn.appendChild(ctn);

        this.labelTimer = document.createElement("div");
        this.labelTimer.className = "lobbymenu-matchCtn-timer";
        this.matchInfoCtn.appendChild(this.labelTimer);

        ctn = this.createFlexContainer("column");

        this.imageMatch = document.createElement("div");
        this.imageMatch.className = "lobbymenu-matchCtn-img";
        
        this.labelMapName = document.createElement("div");
        this.labelMapName.className = "lobbymenu-matchCtn-mapName";
        this.imageMatch.appendChild(this.labelMapName);

        ctn.appendChild(this.imageMatch);
        this.matchInfoCtn.appendChild(ctn);

        /* PLAYERS */
        this.playersInfoCtn = document.createElement("div");
        this.playersInfoCtn.className = "lobbymenu-playersSection";



        /* FOOTER - BUTTONS */
        this.footer = document.createElement("div");
        this.footer.className = "lobbymenu-footer";

        this.btnLeave = document.createElement("button");
        this.btnLeave.className = "mainmenu-footer-btn";
        this.btnLeave.textContent = "Leave room";
        this.footer.appendChild(this.btnLeave);

        this.btnReady = document.createElement("button");
        this.btnReady.className = "mainmenu-footer-btn";
        this.btnReady.textContent = "READY!";
        this.footer.appendChild(this.btnReady);

        this.menu_panel.appendChild(this.header);
        this.menu_panel.appendChild(this.matchInfoCtn);
        this.menu_panel.appendChild(this.playersInfoCtn);
        this.menu_panel.appendChild(this.footer);
        document.body.appendChild(this.menu_panel);

        this.pauseMenu = new PauseMenu(true);
    },

    resize(e) {
        // if (window.innerHeight <= 800) {
        //     // $(".lobbymenu").css({
        //     //     "height": (window.innerHeight - 60) + "px",
        //     //     "grid-template-rows": "auto " + (window.innerHeight / 2) + "px 100px"
        //     // });
        // } else {
        //     $(".mainmenu").css({
        //         "height": "auto"
        //     });
        // }
    },

    addListeners(){
        this.btnLeave.onclick = (e) =>{
            this.quit();
        }
        this.btnReady.onclick = (e) =>{
            this.isReady = !this.isReady;
            client.readyToPlay(this.isReady);
            let ctn = this.playersCtn[client.id];
            if(this.isReady){
                this.btnReady.style.backgroundColor = "greenyellow";
                this.btnReady.style.color = "rgba(0,0,0,1)";
                ctn.className = "lobbymenu-playerCtn-ready";
            }
            else{
                this.btnReady.style.backgroundColor = "rgba(0,0,0,0)";
                this.btnReady.style.color = "greenyellow";
                ctn.className = "lobbymenu-playerCtn";
            }
        }
    },

    quit() {
        client.leaveMatch();
        this.changeState("MainMenu");
    },

    changeState(state, currentGameState=null) {
        if (this.loadingSprite) {
            this.loadingSprite.remove();
            this.loadingSprite = null;
        }
        this.pauseMenu.remove();
        this.pauseMenu = null;
        $(".lobbymenu").fadeOut(500, () => {
            $(".lobbymenu").remove();
            if(currentGameState){
                game.state.start(state, true, false, currentGameState);
            }
            else{
                game.state.start(state);
            }
        });
    },
    gotoGameState(currentGameState){
        this.changeState('Game', currentGameState);
    },
    
    update: function () {},
    
    addLabel(text) {
        let label = document.createElement("div");
        label.textContent = text;
        label.style.fontSize = "45px";
        label.style.padding = "0px";
        label.style.margin = "0px";
        return label;
    },
    
    addTitle(text) {
        let title = document.createElement("div");
        title.textContent = text;
        title.style.fontSize = "80px";
        title.style.padding = "0px";
        title.style.margin = "0px";
        // title.style.height = "50px";
        return title;
    },
    
    createContainer(pattern, horizontal=true){
        let ctn = document.createElement("div");
        ctn.style.width = "100%";
        ctn.style.height = "100%";
        ctn.style.display = "grid";
        if(horizontal){
            ctn.style.gridTemplateColumns = pattern;
        }
        else{
            ctn.style.gridTemplateRows = pattern;
        }
        return ctn;
    },
    
    createFlexContainer(direction) {
        let ctn = document.createElement("div");
        ctn.style.width = "100%";
        ctn.style.height = "100%";
        ctn.style.display = "flex";
        ctn.style.flexDirection = direction;
        return ctn;
    },
    
    updateLobby(data){
        // console.log(data);
        this.updateMatchState(data.matchState);
        this.updatePlayers(data.players);
        this.removePlayers(data.playersToRemove);
    },

    updateMatchState(data){
        this.labelMatchRoom.textContent = "Room "+data.id;
        this.labelMatchType.textContent = data.type;
        this.labelMatchNumPlayers.textContent = data.nbPlayers+"/"+data.maxPlayers;
        this.labelTimer.textContent = this.timeFormat(data.time);
        if(data.time<10){
            this.labelTimer.style.color = "red";
        }
        if(data.time <= 0){
            if (!this.helpMessage_isBlinking) {
                this.blink();
            }
        }
        this.imageMatch.style.backgroundImage = "url('/game/images/screenshot_game_level1.png')";
        if(this.imageMatch.style.backgroundImage == null){
            // this.imageMatch.style.backgroundImage = "url('/game/images/"+data.mapImagePath+"')";
        }

        this.labelMapName.textContent = data.mapName;
    },

    blink(){
        this.helpMessage_isBlinking = true;
        $('.lobbyHelpMessage').fadeIn(1000, ()=>{
            $('.lobbyHelpMessage').fadeOut(1000, () => {
                this.blink();
            });
        });
    },

    stopBlinking(){
        if(this.helpMessage_isBlinking){
            this.helpMessage_isBlinking = false;
        }
    },

    timeFormat(secondes){
        let min = Math.floor(secondes / 60),
            sec = secondes % 60;
        (min < 10) ? min = "0" + min : null;
        (sec < 10) ? sec = "0" + sec : null;
        return min + ':' + sec
    },

    updatePlayers(players){
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if(this.playersCtn[player.id]){ // le player existe déja dans la liste
                let ctn = this.playersCtn[player.id];
                if(player.isReady){
                    ctn.className = "lobbymenu-playerCtn-ready";
                }
                else{
                    ctn.className = "lobbymenu-playerCtn";
                }
            }
            else{   //Insérer le player
                this.insertPlayer(player);
            }
        }
    },

    addCurrentPlayers(player){

    },

    insertPlayer(player){
        let ctn = document.createElement("div");
        ctn.className = "lobbymenu-playerCtn";
        ctn.style.backgroundImage = "url('/game/images/player2.png')";

        let labelUsername = document.createElement("div");
        labelUsername.className = "lobbymenu-playerCtn-username";
        labelUsername.style.color = player.color;
        labelUsername.textContent = player.username;
        ctn.appendChild(labelUsername);

        this.playersInfoCtn.appendChild(ctn);
        this.playersCtn[player.id] = ctn;
    },

    removePlayers(players){
        for (let i = 0; i < players.length; i++) {
            let playerID = players[i];
            if (this.playersCtn[playerID]) { // le player existe dans la liste
                this.playersCtn[playerID].remove();
                delete this.playersCtn[playerID];
            }
        }
    },

    connectionFailure() {
        this.changeState('ConnectionMenu');
    }
}