
BomberBox.Preloader.prototype = {
    init: function(){
        this.graphics = null;
        this.preloadBar = null;
        this.loadingText = null;
        this.width = 900;
        this.height = 500;
        this.x_origin = window.innerWidth/2 - this.width/2;
        this.y_origin = window.innerHeight/2 - this.height/2;
    },
    preload: function(){
        this.graphics = game.add.graphics(0,0);
        this.graphics.beginFill(0x000000);
        this.graphics.drawRoundedRect(this.x_origin, this.y_origin, this.width, this.height, 20);
        this.graphics.endFill();

        this.preloadBar = game.add.sprite(game.world.centerX, game.world.centerY + 100, 'preloaderBar');
        this.preloadBar.anchor.setTo(0.5, 0.5);

        this.time.advancedTiming = true;

        this.load.setPreloadSprite(this.preloadBar);
    },

    create: function(){
        game.load.onLoadStart.add(this.loadStart, this);
        game.load.onFileComplete.add(this.fileComplete, this);
        game.load.onLoadComplete.add(this.loadComplete, this);

        this.start();
    },

    start: function(){
        //load all the assets, sprites and other images
        // game.load.spritesheet('warrior_spritesheet', '/game/sprites/characters/ball_spritesheet.png', 108, 160);
        game.load.spritesheet('cowboy_spritesheet', '/game/sprites/characters/cowboy.png', 128, 128);
        game.load.spritesheet('spawn_effect', '/game/sprites/effect/spawning_effect.png', 108, 160);
        game.load.spritesheet('spawn_effect_items', '/game/sprites/effect/spawning_effect_items.png', 108, 160);
        game.load.spritesheet('base', '/game/sprites/effect/base.png', 512, 273);
        game.load.spritesheet('settings_icon', '/game/images/settings.png', 149, 150, 2);
        game.load.spritesheet('black_bullet', '/game/sprites/bullet.png', 50, 50);
        
        // this.load.image('cube', '/game/sprites/cube/cube.png');
        // game.load.image('water_cube', '/game/sprites/cube/watercube.png');
        this.load.image('metal_cube', '/game/sprites/cube/Metal_Cube.png');
        this.load.image('wood_cube', '/game/sprites/cube/Wood_Cube.png');
        this.load.image('money_cube', '/game/sprites/cube/Money_Cube.png');
        this.load.image('rubik_cube', '/game/sprites/cube/Rubik_Cube.png');
        this.load.image('money_sprite', '/game/sprites/cube/money_sprite.png');
        this.load.image('grass', '/game/sprites/tiles/grass.png');
        this.load.image('sand', '/game/sprites/tiles/sand.png');
        this.load.image('rock_tile', '/game/sprites/tiles/rock_tile.png');
        this.load.image('platform_white', '/game/sprites/tiles/platform_white.png');
        this.load.image('sweatcoin_logo', '/game/sprites/sweatcoin-logo.png');
        this.load.image('pointer', '/game/sprites/pointer.png');
        this.load.image('heart_icon', '/game/sprites/graphics/heart.png');
        this.load.image('shield_icon', '/game/sprites/graphics/shield2.png');

        //Audio
        game.load.audio('quest_battle', ['/game/audio/music/quest/POL-battle-march-short.wav']);

        game.load.audio('gunshot', ['/game/audio/sound_effect/shot/gunshot.wav']);

        // Thanks to Brandon Morris and HaelDB for this beautiful song
        // https://opengameart.org/content/15-min-medieval-acidweird-strings
        game.load.audio('western_15', ['/game/audio/music/quest/western.ogg']);

        // Thanks to Shalpin for this amazing western song
        // https://opengameart.org/content/western
        game.load.audio('western_37s', ['/game/audio/music/quest/western_37s.mp3']);

        // Thanks to Monplaisir Loyalty Freak Music for this beautiful song
        // https://opengameart.org/content/un-désert
        game.load.audio('desert', ['/game/audio/music/quest/desert.mp3']);

        // Thanks to Trevor Lentz for this beautiful quest music
        // https://opengameart.org/content/opengameartorg-theme-a-better-world
        game.load.audio('ABetterWorld', ['/game/audio/music/quest/ABetterWorld.mp3']);

        // Thanks to Hitctrl for this beautiful quest music
        // https://opengameart.org/content/rpg-for-wenches-ale-and-loot
        game.load.audio('rpg', ['/game/audio/music/quest/rpg.mp3']);

        // Thanks to BBandRage for this beautiful quest music
        // https://opengameart.org/content/questing-loop
        game.load.audio('Questing', ['/game/audio/music/quest/Questing.wav']);

        game.load.start();
    },
    

    loadStart: function(){
        this.loadingText = game.add.text(game.world.centerX, game.world.centerY, "Loading... 0%", {
            font: "50px Arial",
            fill: "#ffffff",
            align: "center"
        });
        this.loadingText.anchor.setTo(0.5, 0.5);
    },

    fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles){
        //console.log("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
        this.loadingText.setText("Loading... "+progress+"%");
    },

    loadComplete: function(){
        //console.log("load complete");
            this.loadingText.fill = "#00ff00";
        this.loadingText.setText("Loading Complete");
        BomberBox.SoundManager.init();
        setTimeout(() => {
            game.state.start('ConnectionMenu');
        }, 1000);
    }
}