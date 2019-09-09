let width = window.innerWidth;
let height = window.innerHeight - 55;

let gameContainer = null;

let game = new Phaser.Game(width, height, Phaser.CANVAS, 'game', null, true, true);

let BomberBox = function(){};
BomberBox.Boot = function(game){};
BomberBox.Preloader = function(game){};
BomberBox.ConnectionMenu = function (game) { };
BomberBox.MainMenu = function (game){};
BomberBox.Lobby = function (game) { };
BomberBox.Game = function (game){};

BomberBox.SoundManager = null;

//Initialize function
let init = function () {
    //Empeche le menu contextuel lors du right click de la souris
    document.querySelector("#game").oncontextmenu = (e) =>{
        e.preventDefault();
    }

    gameContainer = document.querySelector("#game");

    game.state.add('Boot', BomberBox.Boot);
    game.state.add('Preloader', BomberBox.Preloader);
    game.state.add('ConnectionMenu', BomberBox.ConnectionMenu);
    game.state.add('MainMenu', BomberBox.MainMenu);
    game.state.add('Lobby', BomberBox.Lobby);
    game.state.add('Game', BomberBox.Game);

    BomberBox.SoundManager = new SoundManager();
    game.state.start('Boot');

    window.onresize = (e) => {
        if (game.state.getCurrentState().resize) {
            game.state.getCurrentState().resize(e);
        }
    }

};
// add eventListener for tizenhwkey
document.addEventListener('tizenhwkey', function (e) {
    if (e.keyName == "back") {
        try {
            tizen.application.getCurrentApplication().exit();
        } catch (error) {
            console.error("getCurrentApplication(): " + error.message);
        }
    }
});

function showErrorConnection(){
    let ctn = document.querySelector("#error_connection_msg");
    if(ctn){
        ctn.style.display = "block";
    }
    else{
        ctn = document.createElement("div");
        ctn.id = "error_connection_msg";
        ctn.innerHTML = "<div>Connection to server failed <span class='glyphicon glyphicon-exclamation-sign' style='color:rgb(194, 41, 41);'></span></div>" +
                        "<div>We thank you for your patience during this downtime and apologize for any inconvenience caused</div>"+
                        "<div>We are currently trying to reconnect!</div>";
        document.body.appendChild(ctn);
    }

}

function hideErrorConnection() {
    let ctn = document.querySelector("#error_connection_msg");
    if(ctn){
        // ctn.style.display = "none";
        $("#error_connection_msg").fadeOut(500);
    }
}