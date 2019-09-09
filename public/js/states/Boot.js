

BomberBox.Boot.prototype = {
    init: function(){
        game.input.maxPointers = 1;

        game.stage.disableVisibilityChange = true;
    },
    preload: function(){
        this.load.image('preloaderBar', '/game/images/loadingbar.png')
    },
    create: function(){
        this.state.start('Preloader');
    }
}