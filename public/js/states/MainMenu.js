
BomberBox.MainMenu.prototype = {
    init: function () {
        this.menu_Panel = null;
        this.header = null;
        this.imageCtn = null;
        this.welcomMessage = null;
        this.joueurInfoCtn = null;
        this.playerBestScore = null;
        this.playerTotalKills = null;
        this.playerTotalDeath = null;
        this.playerTotalBullets = null;
        this.playerTotalMoney = null;
        this.playerTotalSweatCoins = null;
        this.infoCtn = null;
        this.totalPlayerConnected = null;
        this.footer = null;
        this.btnQuit = null;
        this.btnFindGame = null;
        this.loadingSprite = null;

        this.panelScores = null;

        this.pauseMenu = null;
    },
    preload: function () {
        let eventMusic = new CustomEvent('sm_mainmenu');
        window.dispatchEvent(eventMusic);
        this.createMenu();
        this.addListener();
        $(".mainmenu").hide();
        $(".mainmenu").fadeIn(500);
        client.updateMainMenu();
        this.intervalUpdate = setInterval(()=>{
            client.updateMainMenu();
        }, 2000);
        this.resize();
    },

    createMenu: function(){
        this.menu_panel = document.createElement("div");
        this.menu_panel.className = "mainmenu";

        this.header = document.createElement("div");
        this.header.className = "mainmenu-header";
        this.header.textContent = "BomberBlock"

        this.imageCtn = document.createElement("div");
        this.imageCtn.className = "mainmenu-imgCtn";

        this.welcomMessage = document.createElement("div");
        this.welcomMessage.className = "mainmenu-welcom";
        this.imageCtn.appendChild(this.welcomMessage);

        this.imageJoueur = document.createElement("div");
        this.imageJoueur.className = "mainmenu-imagejoueur";
        this.imageCtn.appendChild(this.imageJoueur);

        this.joueurInfoCtn = document.createElement("div");
        this.joueurInfoCtn.className = "mainmenu-joueurinfo";
        this.imageCtn.appendChild(this.joueurInfoCtn);

        /* INFO DU JOUEUR */
        let row = this.newRow();
        row.appendChild(this.newLabel("Best Score :"));
        this.playerBestScore = this.newLabel("0");
        row.appendChild(this.playerBestScore);
        this.joueurInfoCtn.appendChild(row);

        row = this.newRow();
        row.appendChild(this.newLabel("Kills :"));
        this.playerTotalKills = this.newLabel("0");
        row.appendChild(this.playerTotalKills);
        this.joueurInfoCtn.appendChild(row);

        row = this.newRow();
        row.appendChild(this.newLabel("Deaths :"));
        this.playerTotalDeath = this.newLabel("0");
        row.appendChild(this.playerTotalDeath);
        this.joueurInfoCtn.appendChild(row);

        row = this.newRow();
        row.appendChild(this.newLabel("Bullets :"));
        this.playerTotalBullets = this.newLabel("0");
        row.appendChild(this.playerTotalBullets);
        this.joueurInfoCtn.appendChild(row);

        row = this.newRow();
        row.appendChild(this.newLabel("Money :"));
        this.playerTotalMoney = this.newLabel("0");
        row.appendChild(this.playerTotalMoney);
        this.joueurInfoCtn.appendChild(row);

        row = this.newRow();
        row.appendChild(this.newLabel("Sweatcoins :"));
        this.playerTotalSweatCoins = this.newLabel("0");
        row.appendChild(this.playerTotalSweatCoins);
        this.joueurInfoCtn.appendChild(row);

        row = this.newRow();
        row.appendChild(this.newLabel("Distance :"));
        this.playerTotalDistance = this.newLabel("0");
        row.appendChild(this.playerTotalDistance);
        this.joueurInfoCtn.appendChild(row);
        

        /* INFO GLOBAL*/
        this.infoCtn = document.createElement("div");
        this.infoCtn.className = "mainmenu-infoCtn";

        this.totalPlayerConnected = document.createElement("div");
        this.totalPlayerConnected.className = "mainmenu-totalplayers";
        this.infoCtn.appendChild(this.totalPlayerConnected);

        let title = document.createElement("div");
        title.textContent = "* Ultimate BomberKillers *";
        this.infoCtn.appendChild(title);

        this.panelScores = document.createElement("div");
        this.panelScores.className = "mainmenu-scorepanel";
        this.infoCtn.appendChild(this.panelScores);
        
        this.footer = document.createElement("div");
        this.footer.className = "mainmenu-footer";

        this.btnQuit = document.createElement("button");
        this.btnQuit.className = "mainmenu-footer-btn";
        this.btnQuit.textContent = "Quit";
        this.footer.appendChild(this.btnQuit);

        this.btnFindGame = document.createElement("button");
        this.btnFindGame.className = "mainmenu-footer-btn";
        this.btnFindGame.textContent = "Find a game!";
        this.footer.appendChild(this.btnFindGame);

        this.menu_panel.appendChild(this.header);
        this.menu_panel.appendChild(this.imageCtn);
        this.menu_panel.appendChild(this.infoCtn);
        this.menu_panel.appendChild(this.footer);
        document.body.appendChild(this.menu_panel);

        this.pauseMenu = new PauseMenu(true);
    },

    newRow(){
        let row = document.createElement("div");
        row.className = "mainmenu-joueurinfo-row";
        return row;
    },

    newLabel(text){
        let label = document.createElement("div");
        label.textContent = text;
        return label;
    },
    
    newIcon(path){
        let icon = document.createElement("div");
        icon.style.backgroundImage = "url("+path+")";
        icon.style.backgroundPosition = "center";
        icon.style.backgroundRepeat = "no-repeat";
        icon.style.backgroundSize = "100%";
        return icon;
    },

    addListener(){
        if(this.btnQuit){
            this.btnQuit.onclick = (e)=>{
                this.quit();
            }
        }
        if(this.btnFindGame){
            this.btnFindGame.onclick = (e)=>{
                client.joinMatch();
                this.loadingSprite = new LoadingSprite(window.innerWidth/2,window.innerHeight/2, 2, true);
            }
        }
    },
    
    updateMainMenu(data){
        if(data.player){
            console.log(data.player);
            this.welcomMessage.innerHTML = "Welcome, <span style='color:"+data.player.color+";font-size:50px;'>" + data.player.username +"</span>";
            let color = Phaser.Color.hexToColor(data.player.color);
            $(".mainmenu-imagejoueur").css({
                "-webkit-box-shadow": "0px 0px 72px 2px "+data.player.color,
                "-moz-box-shadow": "0px 0px 72px 2px " + data.player.color,
                "box-shadow": "0px 0px 72px 2px " + data.player.color,
                "background-color": "rgba(" + color.r + "," + color.g + "," + color.b + ",0.5)",
                // "border":"2px solid "+data.player.color,
            });
            this.playerBestScore.textContent = data.player.bestScore;
            this.playerTotalKills.textContent = data.player.totalKills;
            this.playerTotalDeath.textContent = data.player.totalDeaths;
            this.playerTotalBullets.textContent = Math.floor(data.player.nbBulletsLeft);
            this.playerTotalMoney.textContent = Math.floor(data.player.money);
            this.playerTotalSweatCoins.textContent = Math.floor(data.player.sweatcoin);
            this.playerTotalDistance.textContent = Math.floor(data.player.totalDistance);
            this.totalPlayerConnected.textContent = data.totalPlayerConnected +" player"+((data.totalPlayerConnected > 1)?"s":"") + " connected";
            this.updateScorePanel(data.scores);
        }
    },

    updateScorePanel(scores){
        let listText = "";
        for (let i = 0; i < scores.length; i++) {
            let player = scores[i];
            listText += "<div class='score-row' style='color:" + player.color + ";'><div>" + player.username + "</div><div>" + player.score + "</div></div>";
        }
        this.panelScores.innerHTML = listText;
    },

    joinMatch(data){
        if(data.isInLobby){
            this.changeState("Lobby");
        }
        else if (data.isInGame){
            console.log("GAME IN ON! NEED TO ENTER GAME!");
            this.changeState("Game");
        }
    },

    quit() {
        client.quitGame();
        this.changeState('ConnectionMenu');
    },

    changeState(state){
        clearInterval(this.intervalUpdate);
        if (this.loadingSprite) {
            this.loadingSprite.remove();
            this.loadingSprite = null;
        }
        this.pauseMenu.remove();
        this.pauseMenu = null;
        $(".mainmenu").fadeOut(500, () => {
            $(".mainmenu").remove();
            game.state.start(state);
        });
    },

    update: function(){

    },
    start: function(element){
        
    },

    resize(e){
        if(window.innerHeight <= 800){
            $(".mainmenu").css({
                "height": (window.innerHeight-60)+"px",
                "grid-template-rows": "auto " + (window.innerHeight/2) + "px 100px"
            });
        }
        else{
            $(".mainmenu").css({
                "height": "auto"
            });
        }
    },

    connectionFailure() {
        this.changeState('ConnectionMenu');
    }

}

function newLabel(value){
    let div = document.createElement("div");
    div.className = "mainmenu-helptext";
    div.textContent = value;
    return div;
}