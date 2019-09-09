const MAX_Z = 1500;
const SECONDS_IN_A_DAY = 5 * 60;
const WORLD_SIZE = 4096;
let allGroup;
let obstacleGroup, floorGroup, bulletGroup, effectGroup;
let pointer, btnOptions, settingPanel, stats_info_sprites = {};
let pauseMenu = null, gameStatsMenu = null, chat = null;
let keys = {};
let space_key_pressed = false;
let decalage = -80;
let myPlayer = null, myPlayerSprite = null;
let playersConnected = {}, spritesList = {};
let bulletList = {}, bulletSpriteList = {};
let map = null;
let playersNameLabel = {};
let graphics = null;
let graphics_minimap = null;
let current_darkness = 0.0;
let sun_movement = 0.01;
let timeInterval = SECONDS_IN_A_DAY/100;
let timer_sprite = null;
let minimap_sprite = null;

let graphic_property = {
    lightOn : false
};

let direction_polygon ={
    N  : null,
    NW : null,
    W  : null,
    SW : null,
    S  : null,
    SE : null,
    NE: null,
    E  : null,
    dummy : null
};
let darkness_polygon = null;
let darkness_texture = null;
let header_polygon = null;


function toggleSetting() {
    pauseMenu.toggleMenu();
}

function toggleChat() {
    chat.toggleChat();
}

function showMatchStat() {
    if (gameStatsMenu){
        gameStatsMenu.show();
    }
}

function hideMatchStat() {
    if (gameStatsMenu) {
        gameStatsMenu.hide();
    }
}

function disableGameKeys() {
    game.input.enabled = false;
}

function enableGameKeys(){
    game.input.enabled = true;
}

BomberBox.Game.prototype = {
    init: function (currentGameState){
        this.currentGameState = currentGameState;
        this.currentTime = null;
        this.intervalTimer = null;
        this.bulletList = {};
        this.bulletSpriteList = {};
        this.loadingSprite = new LoadingSprite(window.innerWidth/2,window.innerHeight/2, 2, true);
        this.countDown = null;
        this.moneyList = {};
        this.perkList = {};
        this.header_polygon = null;
        this.money_sprite = null;
        this.bullet_sprite = null;
        this.rubikcubes = [];
        this.base = null;
        let eventMusic = new CustomEvent('sm_game');
        window.dispatchEvent(eventMusic);
    },

    startCountDown(time){
        if (this.loadingSprite) {
            this.loadingSprite.remove();
            this.loadingSprite = null;
        }
        this.countDown = new CountDown();
    },

    startGame(){
        if (this.loadingSprite) {
            this.loadingSprite.remove();
            this.loadingSprite = null;
        }
        enableGameKeys();
    },
        preload: function () {
            //RESIZE THE SCREEN
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.setShowAll();
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVerticaly = true;
            game.scale.setScreenSize(true);
            game.scale.refresh();

            //hide the cursor
            document.querySelector("#game").style.cursor = "none";

            game.time.advancedTiming = true;
            game.plugins.add(new Phaser.Plugin.Isometric(game));
            game.world.setBounds(-decalage, -decalage, WORLD_SIZE * 2 + decalage, WORLD_SIZE + decalage);
            game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
            game.iso.anchor.setTo(0.5, 0.0);

        },
        create: function () {
            // create groups for different tiles
            floorGroup = game.add.group();
            //itemGroup = game.add.group();
            //grassGroup = game.add.group();
            obstacleGroup = game.add.group();
            obstacleGroup.name = "obstacleGroup";
            bulletGroup = game.add.group();
            bulletGroup.name = "bulletGroup";
            effectGroup = game.add.group();
            effectGroup.name = "effectGroup";
            // allGroup.add(obstacleGroup);
            // allGroup.add(bulletGroup);
            // set the gravity in our game
            game.physics.isoArcade.gravity.setTo(0, 0, -1000);

            game.camera.bounds = null;

            enableGameKeys();
            // Ajouter les events sur le curseur et les toucher W, A, S, D
            keys['UP'] = this.input.keyboard.addKey(Phaser.Keyboard.W);
            keys['LEFT'] = this.input.keyboard.addKey(Phaser.Keyboard.A);
            keys['DOWN'] = this.input.keyboard.addKey(Phaser.Keyboard.S);
            keys['RIGHT'] = this.input.keyboard.addKey(Phaser.Keyboard.D);
            keys['SPACE'] = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            keys['SPACE'].onDown.add(()=>{
                space_key_pressed = true;
            }, this);
            keys['SHIFT'] = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            //Ajout de la touche P pour le menu contextuel (config)
            keys['P'] = this.input.keyboard.addKey(Phaser.Keyboard.P);
            keys['P'].onDown.add(toggleSetting, this);
            keys['C'] = this.input.keyboard.addKey(Phaser.Keyboard.C);
            keys['C'].onDown.add(toggleChat, this);
            keys['L'] = this.input.keyboard.addKey(Phaser.Keyboard.L);
            keys['L'].onDown.add(()=>{
                graphic_property.lightOn = !graphic_property.lightOn;
            }, this);

            keys['TAB'] = this.input.keyboard.addKey(Phaser.Keyboard.TAB);
            keys['TAB'].onDown.add(showMatchStat, this);
            keys['TAB'].onUp.add( hideMatchStat, this);

            this.input.mouse.capture = true;

            //POINTEUR
            pointer = game.add.sprite(game.world.centerX, game.world.centerY, 'pointer');
            pointer.fixedToCamera = true;
            pointer.inputEnabled = true;

            pauseMenu = new PauseMenu();

            gameStatsMenu = new GameStatsMenu();

            chat = new Chat();

            //CREATION DES POLYGON DE DÉTERMINATION DE DIRECTION
            let centerX = game.width/2,
                centerY = game.height/2;
            direction_polygon.N = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point((game.width / 3) * 2, 0), new Phaser.Point(game.width, 0), new Phaser.Point(game.width, game.height/3)]);
            direction_polygon.NW = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point(game.width / 3, 0), new Phaser.Point((game.width / 3) * 2, 0)]);
            direction_polygon.W = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point(game.width / 3, 0), new Phaser.Point(0, 0), new Phaser.Point(0, game.height / 3)]);
            direction_polygon.SW = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point(0, game.height / 3), new Phaser.Point(0, (game.height / 3)*2)]);
            direction_polygon.S = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point(0, (game.height / 3) * 2), new Phaser.Point(0, game.height), new Phaser.Point(game.width/3, game.height)]);
            direction_polygon.SE = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point(game.width/3, game.height), new Phaser.Point((game.width/3)*2, game.height)]);
            direction_polygon.E = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point((game.width / 3)*2, game.height), new Phaser.Point(game.width, game.height), new Phaser.Point(game.width, (game.height/3)*2)]);
            direction_polygon.NE = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point(game.width, game.height / 3), new Phaser.Point(game.width, (game.height / 3) * 2)]);
            
            darkness_polygon = new Phaser.Polygon([new Phaser.Point(0, 0), new Phaser.Point(game.width, 0), new Phaser.Point(game.width, game.height), new Phaser.Point(0, game.height)]);
            graphics = game.add.graphics(0, 0);
            graphics.fixedToCamera = true;
            graphics.inputEnabled = true;

            //dark header
            header_polygon = new Phaser.Polygon([   new Phaser.Point(0, 0), 
                                                    new Phaser.Point(game.width, 0), 
                                                    // new Phaser.Point(game.width, 120),
                                                    new Phaser.Point(game.width, 60), //OU SA
                                                    // new Phaser.Point(game.width - 150, 120),
                                                    new Phaser.Point(game.width - 200, 60),
                                                    new Phaser.Point(300, 60),
                                                    new Phaser.Point(280, 90),
                                                    new Phaser.Point(140, 90),
                                                    new Phaser.Point(120, 120),
                                                    new Phaser.Point(0, 120)]);
            
            timer_sprite = game.add.text(game.width/2, 0, "", {
                font: "50px Arial",
                fill: "#ffffff",
                align: "center"
            });
            timer_sprite.anchor.set(0.5,0.0);
            timer_sprite.fixedToCamera = true;
            game.world.bringToTop(timer_sprite);

            //STATS DU JOUEUR
            this.hearth_sprite = game.add.sprite(20, 20, 'heart_icon');
            this.hearth_sprite.scale.set(0.5);
            this.hearth_sprite.anchor.set(0.5);
            this.hearth_sprite.fixedToCamera = true;
            stats_info_sprites["life"] = game.add.text(70, 20, "100%", {
                font: "18px Arial",
                fill: "#ffffff",
                align: "center"
            });
            stats_info_sprites["life"].anchor.set(0.5, 0.4);
            stats_info_sprites["life"].fixedToCamera = true;
            
            this.shield_sprite = game.add.sprite(20, 60, 'shield_icon');
            this.shield_sprite.scale.set(0.5);
            this.shield_sprite.anchor.set(0.5);
            this.shield_sprite.fixedToCamera = true;
            stats_info_sprites["shield"] = game.add.text(70, 60, "100%", {
                font: "18px Arial",
                fill: "#ffffff",
                align: "center"
            });
            stats_info_sprites["shield"].anchor.set(0.5, 0.4);
            stats_info_sprites["shield"].fixedToCamera = true;

            stats_info_sprites["score"] = this.add.text(60, 100, "0", {
                font: "bold 30px Arial",
                fill: "#FFFF00",
                align: "center"
            });
            stats_info_sprites["score"].anchor.set(0.5);
            stats_info_sprites["score"].fixedToCamera = true;

            /* SWEATCOIN STATS */
            this.sweatcoin_sprite = game.add.sprite(game.width / 2 + 85, 25, 'sweatcoin_logo');
            this.sweatcoin_sprite.scale.set(0.3);
            this.sweatcoin_sprite.anchor.set(0.0, 0.5);
            this.sweatcoin_sprite.fixedToCamera = true;
            stats_info_sprites["sweatcoin"] = game.add.text(game.width / 2 + 115, 25, "", {
                font: "25px Arial",
                fill: "#ffffff",
                align: "center"
            });
            stats_info_sprites["sweatcoin"].anchor.set(0.0, 0.5);
            stats_info_sprites["sweatcoin"].fixedToCamera = true;

            /* MONEY STATS */
            this.money_sprite = game.add.sprite(game.width / 2 + 175, 25, 'money_sprite');
            this.money_sprite.scale.set(0.35);
            this.money_sprite.anchor.set(0.0, 0.5);
            this.money_sprite.fixedToCamera = true;
            stats_info_sprites["money"] = game.add.text(game.width / 2 + 230, 25, "", {
                font: "25px Arial",
                fill: "#ffffff",
                align: "center"
            });
            stats_info_sprites["money"].anchor.set(0.0, 0.5);
            stats_info_sprites["money"].fixedToCamera = true;

            /* BULLET STATS */
            this.bullet_sprite = game.add.sprite(game.width / 2 + 280, 25, 'black_bullet');
            this.bullet_sprite.scale.set(0.5);
            this.bullet_sprite.anchor.set(0.0, 0.5);
            this.bullet_sprite.fixedToCamera = true;
            stats_info_sprites["bullets"] = game.add.text(game.width / 2 + 310, 25, "", { //∞
                font: "25px Arial",
                fill: "#ffffff",
                align: "center"
            });
            stats_info_sprites["bullets"].anchor.set(0.0, 0.5);
            stats_info_sprites["bullets"].fixedToCamera = true;



            // MINI MAP
            graphics_minimap = game.add.graphics(0, 0);
            graphics_minimap.lineStyle(1, 0xFFFFFF, 1);
            graphics_minimap.beginFill(0x000000, 0.5);
            graphics_minimap.drawRect(0, 0, 200, 200);
            graphics_minimap.endFill();
            minimap_sprite = game.add.sprite(game.width - 150, game.height - 300, graphics_minimap.generateTexture());
            // minimap_sprite.anchor.set(0.5);
            minimap_sprite.rotation = 0.75;
            minimap_sprite.fixedToCamera = true;
            graphics_minimap.destroy();
            graphics_minimap = game.make.graphics(0,0);
            minimap_sprite.addChild(graphics_minimap);

            //AJOUTE LES ÉLÉMENTS DE LA MAP ET LES JOUEURS
            disableGameKeys();
            client.getCurrentMatchState();
            //termine avec un resize au cas ou la fenetre aurait ete changé depuis le début
            this.resize();
        },

        updateTime: function(){
            if(this.currentTime){
                // this.currentTime--;
                let min = Math.floor(this.currentTime/60),
                    sec = this.currentTime%60;
                (min < 10)? min = "0" + min: null;
                (sec < 10) ? sec = "0" + sec : null;
                if (this.currentTime < 10){
                    timer_sprite.addColor("#ff0000", 0);
                }
                // if(this.currentTime > -1){
                // }
                timer_sprite.setText(min + ':' + sec);
            }
        },

        update: function () {
            //CHECK LES COLLISIONS
            game.physics.isoArcade.collide(obstacleGroup, null, (a, b)=>{
                if (b.key == 'money_sprite' || a.key == 'money_sprite') {
                    let sprite = (a.key == 'money_sprite')?a:b;
                    client.collectMoney(sprite.customID);
                    sprite.destroy();
                }
                else if( b.customType || a.customType){
                    let sprite = (a.customType) ? a : b;
                    client.collectPerk(sprite.customID);
                    sprite.destroy();
                }
            });
            game.physics.isoArcade.collide(obstacleGroup, bulletGroup, null, this.bullet_hit, this);
            game.iso.topologicalSort(obstacleGroup);

            //RESET LA CAMERA
            //si le joueur est plus bas que la moitier de lahauteur (Z) maximale du jeu
            if(myPlayerSprite && myPlayer){
                let camY = (myPlayerSprite.body.position.z / MAX_Z);
                game.iso.anchor.setTo(0.5, camY);
                myPlayerSprite.body.velocity.x = myPlayer.velocityX;
                myPlayerSprite.body.velocity.y = myPlayer.velocityY;
                if (myPlayer.velocityZ > 0)
                    myPlayerSprite.body.velocity.z = myPlayer.velocityZ;
                playersNameLabel[myPlayer.id].position.x = myPlayerSprite.position.x;
                playersNameLabel[myPlayer.id].position.y = myPlayerSprite.position.y - 100;
                let anim = myPlayer.direction + ((myPlayer.isShooting) ? "-shooting" : (myPlayer.isWalking || myPlayer.isMovingLeftRight) ? "-walking" : (myPlayer.isStepingBack) ? "-backward" : "");
                myPlayerSprite.animations.play(anim);
                if(myPlayer.isShooting){
                    window.dispatchEvent(new CustomEvent('sm_gunshot'));
                }
            }
            //UPDATE DES AUTRES JOUEURS
            $.each(playersConnected, function (index, player) {
                if (spritesList[index]){
                    spritesList[index].body.position.x = player.x;
                    spritesList[index].body.position.y = player.y;
                    spritesList[index].body.position.z = player.z;
                    playersNameLabel[index].x = spritesList[index].position.x;
                    playersNameLabel[index].y = spritesList[index].position.y - 100;
                    let anim = player.direction + ((player.isShooting) ? "-shooting" : (player.isWalking || player.isMovingLeftRight) ? "-walking" : (player.isStepingBack) ? "-backward" : "");
                    spritesList[index].animations.play(anim);
                }
            });

            $.each(this.bulletList, (index, bullet) => {
                this.bulletSpriteList[index].body.velocity.x = bullet.velocityX;
                this.bulletSpriteList[index].body.velocity.y = bullet.velocityY;
            });
            //POINTEUR
            pointer.fixedToCamera = false;
            pointer.x = game.input.mousePointer.x - 50;
            pointer.y = game.input.mousePointer.y - 50;
            pointer.fixedToCamera = true;

            //CHECK LA DIRECTION
            $.each(direction_polygon, (index, poly) =>{
                if(poly){
                    if (poly.contains(game.input.x, game.input.y)) {
                        if(myPlayer)
                            myPlayer.direction = String(index);
                        if (graphic_property.lightOn){

                        }
                    }
                }
            });

            //rotate money_cube
            if (this.rubikcubes) {
                for (let i = 0; i < this.rubikcubes.length; i++) {
                    // let cube = this.rubikcubes[i];
                    // cube.angle += 1;
                    this.rubikcubes[i].angle += 1;
                }
            }

            // UPDATE L'ÉTAT DU JOUEUR
            if(myPlayer){
                graphics.clear();

                graphics.beginFill(0x000000, 0.65);
                graphics.drawPolygon(header_polygon.points);
                graphics.endFill();

                if(myPlayer.life > 0){
                    graphics.lineStyle(20, 0xd75a4a);
                    graphics.moveTo(40, 20);
                    graphics.lineTo(40+ myPlayer.life * 2, 20);
                }
    
                // graphics.lineStyle(20, 0x00AAFF);
                graphics.lineStyle(20, 0x32bdc7);
                graphics.moveTo(40, 60);
                graphics.lineTo(40 + myPlayer.shield * 2, 60);

                stats_info_sprites["life"].setText(myPlayer.life+"%");
                stats_info_sprites["shield"].setText(myPlayer.shield + "%");
                stats_info_sprites["score"].setText(myPlayer.score);
                stats_info_sprites["sweatcoin"].setText(Math.floor(myPlayer.sweatcoin));
                stats_info_sprites["money"].setText(Math.floor(myPlayer.money));
                stats_info_sprites["bullets"].setText(Math.floor(myPlayer.nbBulletsLeft));

            }

            //UPDATE LA MINIMAP
            this.updateMinimap();
            
            //RENVOIS TOUTE LES NOUVELLES INFOS
            let actions = {};
            actions['UP'] = keys['UP'].isDown;
            actions['DOWN'] = keys['DOWN'].isDown;
            actions['LEFT'] = keys['LEFT'].isDown;
            actions['RIGHT'] = keys['RIGHT'].isDown;
            actions['SPACE'] = keys['SPACE'].isDown;
            actions['SHIFT'] = keys['SHIFT'].isDown;
            actions['LEFT_CLICK'] = (this.input.mousePointer.isDown && this.input.mousePointer.button == 0);

            //ENVOIS LES NOUVELLES DONNÉES AU SERVEUR
            if (myPlayerSprite && myPlayer && this.base) {
                let data = {
                    id: myPlayer.id,
                    actions: actions,
                    x: myPlayerSprite.body.position.x,
                    y: myPlayerSprite.body.position.y,
                    z: myPlayerSprite.body.position.z,
                    d: myPlayer.direction,
                    isOnGround: (myPlayerSprite.body.touching.up || myPlayerSprite.body.blocked.down)? true : false,
                    isFalling: myPlayerSprite.body.velocity.z <= 0,
                    isInBase : this.checkBaseIntersect(),
                }
                client.newPosition(data);
                space_key_pressed = false;
                this.newMoneyCollected = 0;
            }

            // GAME GRAPHICS ON TOP FOR : DAYS AND NIGHTS
            game.world.bringToTop(graphics);
            //METTRE LES BOUTONS ET PANELS SUR LE TOP
            game.world.bringToTop(this.hearth_sprite);
            game.world.bringToTop(this.shield_sprite);
            game.world.bringToTop(this.sweatcoin_sprite);
            game.world.bringToTop(this.money_sprite);
            game.world.bringToTop(this.bullet_sprite);
            game.world.bringToTop(stats_info_sprites["life"]);
            game.world.bringToTop(stats_info_sprites["shield"]);
            game.world.bringToTop(stats_info_sprites["score"]);
            game.world.bringToTop(stats_info_sprites["sweatcoin"]);
            game.world.bringToTop(stats_info_sprites["money"]);
            game.world.bringToTop(stats_info_sprites["bullets"]);
            game.world.bringToTop(pointer);
            game.world.bringToTop(timer_sprite);
            game.world.bringToTop(minimap_sprite);
        },
        render: function () {
            try{
                //game.debug.soundInfo(currentMusic, 32, 32);
            }catch(err){
                console.log(err);
            }
        },

        checkBaseIntersect(){
            let success = false;
            if(myPlayerSprite && this.base){
                let myBound = myPlayerSprite.getBounds();
                let baseBound = this.base.getBounds();
                baseBound.x += 75;
                baseBound.y += 75;
                baseBound.width -= 150;
                baseBound.height -= 150;
                if(Phaser.Rectangle.intersects(myBound, baseBound)){
                    success = true;
                }
            }
            return success;
        },

        updateGame(data){
            // UPDATE PLAYERS
            let data_players = data.players;
            let playersID = Object.keys(playersConnected);
            for (let i = 0; i < data_players.length; i++) {
                if (playersID.indexOf(data_players[i].id.toString()) >= 0) { // OTHER PLAYERS
                    playersConnected[data_players[i].id].x = data_players[i].x;
                    playersConnected[data_players[i].id].y = data_players[i].y;
                    playersConnected[data_players[i].id].z = data_players[i].z;
                    playersConnected[data_players[i].id].direction = data_players[i].d;
                    playersConnected[data_players[i].id].life = data_players[i].life;
                    playersConnected[data_players[i].id].score = data_players[i].score;
                    playersConnected[data_players[i].id].isAlive = data_players[i].isAlive;
                    playersConnected[data_players[i].id].isWalking = data_players[i].isWalking;
                    playersConnected[data_players[i].id].isStepingBack = data_players[i].isStepingBack;
                    playersConnected[data_players[i].id].isMovingLeftRight = data_players[i].isMovingLeftRight;
                    playersConnected[data_players[i].id].isShooting = data_players[i].isShooting;
                    gameStatsMenu.updatePlayer(data_players[i]);
                }
                if (myPlayer) {
                    if (data_players[i].id == myPlayer.id) { // MY PLAYER
                        // console.log(data_players[i].x + " - " + data_players[i].y);
                        myPlayer.x = data_players[i].x;
                        myPlayer.y = data_players[i].y;
                        myPlayer.z = data_players[i].z;
                        myPlayer.velocityX = data_players[i].vX;
                        myPlayer.velocityY = data_players[i].vY;
                        myPlayer.velocityZ = data_players[i].vZ;
                        myPlayer.life = data_players[i].life;
                        myPlayer.shield = data_players[i].shield;
                        myPlayer.score = data_players[i].score;
                        myPlayer.money = data_players[i].money;
                        myPlayer.sweatcoin = data_players[i].sweatcoin;
                        myPlayer.nbBulletsLeft = data_players[i].nbBulletsLeft;
                        myPlayer.isAlive = data_players[i].isAlive;
                        myPlayer.isWalking = data_players[i].isWalking;
                        myPlayer.isStepingBack = data_players[i].isStepingBack;
                        myPlayer.isMovingLeftRight = data_players[i].isMovingLeftRight;
                        myPlayer.isShooting = data_players[i].isShooting;
                        if(gameStatsMenu){
                            gameStatsMenu.updatePlayer(data_players[i]);
                        }
                    }
                }
            }
            if (this.countDown){
                // console.log(data.matchState.countDownTime);
                if (data.matchState.countDownTime > 0){
                    this.countDown.update(data.matchState.countDownTime);
                }
                else{
                    this.countDown.remove();
                    this.countDown = null;
                    enableGameKeys();
                }
            }
            // gameStatsMenu.update(data_players);
            if (this.currentTime != data.matchState.time){
                this.currentTime = data.matchState.time;
                this.updateTime();
            }
            // ADD NEW BULLETS
            this.addNewBullet(data.newBullets);
        },

        addCurrentPlayers(players){
            for (let i = 0; i < players.length; i++) {
                let player = players[i];
                if (player.id != client.id) {
                    this.addNewPlayer(player);
                }
            }
            client.readyToPlay(true);
        },
        
        addNewPlayer(data){
            let player = this.add.isoSprite(data.x, data.y, data.z, 'cowboy_spritesheet', 0, obstacleGroup); //Create sprite
            player.customID = data.id;
            this.addSpawnEffect(player);
            this.addAnimation(player);
            player.anchor.set(0.5);
            game.physics.isoArcade.enable(player);
            player.body.collideWorldBounds = true;
            spritesList[data.id] = player;
            playersNameLabel[data.id] = game.add.text(player.position.x, player.position.y - 100, data.username, {
                font: "25px Arial",
                fill: data.color,
                align: "center"
            });
            playersNameLabel[data.id].anchor.setTo(0.5, 0.5);
            playersConnected[data.id] = data; //Add player to player list
        },
        
        addMyPlayer(data) {
            myPlayer = data; //create my player data
            myPlayerSprite = this.add.isoSprite(data.x, data.y, data.z, 'cowboy_spritesheet', 0, obstacleGroup); //create my sprite
            myPlayerSprite.name = "ME"; //Mostly to help my bullet dont hit me
            myPlayerSprite.customID = myPlayer.id;
            this.addSpawnEffect(myPlayerSprite); //Make a spawn circle effect under the sprite
            this.addAnimation(myPlayerSprite);
            myPlayerSprite.anchor.set(0.5); //Anchor sprite position in center of the sprite
            game.physics.isoArcade.enable(myPlayerSprite); //Add Physic
            myPlayerSprite.body.collideWorldBounds = true; //Add collision with the world border
            game.camera.follow(myPlayerSprite); //Make Camera follow sprite
            let text = game.add.text(myPlayerSprite.position.x, myPlayerSprite.position.y - 100, myPlayer.username, {
                font: "25px Arial",
                fill: myPlayer.color,
                align: "center"
            });
            text.anchor.setTo(0.5, 0.5);
            playersNameLabel[myPlayer.id] = text;
        },
        
        addSpawnEffect(sprite) {
            let spawn = game.make.sprite(0, 0, 'spawn_effect', 0);
            spawn.anchor.set(0.5);
            sprite.addChild(spawn);
            let tween = game.add.tween(spawn).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 2000);
            tween.onComplete.add(() => {
                spawn.destroy();
            }, this);
        },

        addSpawnEffect_items(sprite) {
            let spawn = game.make.sprite(0, 0, 'spawn_effect_items', 0);
            spawn.anchor.set(0.5);
            sprite.addChild(spawn);
        },

        createLightSprite(x, y, z) {
            let light = game.add.isoSprite(x, y, z, 'spawn_effect_items', 0);
            light.anchor.set(0.5);
        },
        
        addAnimation(player) {
            player.animations.add('E', [28], 10, true);
            player.animations.add('NE', [42], 10, true);
            player.animations.add('N', [56], 10, true);
            player.animations.add('NW', [70], 10, true);
            player.animations.add('W', [84], 10, true);
            player.animations.add('SW', [98], 10, true);
            player.animations.add('S', [112], 10, true);
            player.animations.add('SE', [126], 10, true);

            player.animations.add('E-shooting', [39], 10, true);
            player.animations.add('NE-shooting', [53], 10, true);
            player.animations.add('N-shooting', [67], 10, true);
            player.animations.add('NW-shooting', [81], 10, true);
            player.animations.add('W-shooting', [95],10, true);
            player.animations.add('SW-shooting', [109], 10, true);
            player.animations.add('S-shooting', [123], 10, true);
            player.animations.add('SE-shooting', [137], 10, true);

            player.animations.add('E-walking', [28, 29, 30, 31, 32, 33, 34, 35], 10, true);
            player.animations.add('NE-walking', [42, 43, 44, 45, 46, 47, 48, 49], 10, true);
            player.animations.add('N-walking', [56, 57, 58, 59, 60, 61, 62, 63], 10, true);
            player.animations.add('NW-walking', [70, 71, 72, 73, 74, 75, 76, 77], 10, true);
            player.animations.add('W-walking', [84, 85, 86, 87, 88, 89, 90, 91], 10, true);
            player.animations.add('SW-walking', [98, 99, 100, 101, 102, 103, 104, 105], 10, true);
            player.animations.add('S-walking', [112, 113, 114, 115, 116, 117, 118, 119], 10, true);
            player.animations.add('SE-walking', [126, 127, 128, 129, 130, 131, 132, 133], 10, true);

            player.animations.add('E-backward', [35, 34, 33, 32, 31, 30, 29, 28], 10, true);
            player.animations.add('NE-backward', [49, 48, 47, 46, 45, 44, 43, 42], 10, true);
            player.animations.add('N-backward', [63, 62, 61, 60, 59, 58, 57, 56], 10, true);
            player.animations.add('NW-backward', [77, 76, 75, 74, 73, 72, 71, 70], 10, true);
            player.animations.add('W-backward', [91,90,89,88,87,86,85,84], 10, true);
            player.animations.add('SW-backward', [105, 104, 103,101, 100, 99, 98], 10, true);
            player.animations.add('S-backward', [119, 118, 117, 116, 115, 114, 113, 112], 10, true);
            player.animations.add('SE-backward', [133, 132, 131, 130, 129, 128, 127, 126], 10, true);
        },
        
        playerDead(data){
            this.removeSprite(data[0]);
            playersNameLabel[data[0]].visible = false;
            this.createMoneySprite(data[1]);
        },

        playerRevive(player) {
            if (myPlayer.id == player.id) {
                this.createMySprite(player);
            }
            else{
                this.createOthersSprite(player);
            }
        },

        createMySprite(player) {
            myPlayer = player;
            myPlayerSprite = this.add.isoSprite(myPlayer.x, myPlayer.y, myPlayer.z, 'cowboy_spritesheet', 0, obstacleGroup); //create my sprite
            myPlayerSprite.name = "ME"; //Mostly to help my bullet dont hit me
            myPlayerSprite.customID = myPlayer.id;
            this.addSpawnEffect(myPlayerSprite); //Make a spawn circle effect under the sprite
            this.addAnimation(myPlayerSprite);
            myPlayerSprite.anchor.set(0.5); //Anchor sprite position in center of the sprite
            game.physics.isoArcade.enable(myPlayerSprite); //Add Physic
            myPlayerSprite.body.collideWorldBounds = true; //Add collision with the world border
            let tween = game.add.tween(game.camera);
            tween.to({x: myPlayerSprite.position.x - game.width/2, y: myPlayerSprite.position.y - game.height/2}, 500, "Linear");
            tween.onComplete.add((e)=>{
                game.camera.follow(myPlayerSprite); //Make Camera follow sprite
            }, this);
            tween.start();
            // this.camera.x = myPlayerSprite.position.x - game.width/2;
            // this.camera.y = myPlayerSprite.position.y - game.height/2;
            // game.camera.follow(myPlayerSprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1); //Make Camera follow sprite
            // let text = game.add.text(myPlayerSprite.position.x, myPlayerSprite.position.y - 100, myPlayer.username, {
            //     font: "25px Arial",
            //     fill: myPlayer.color,
            //     align: "center"
            // });
            // text.anchor.setTo(0.5, 0.5);
            // playersNameLabel[myPlayer.id] = text;
            if (playersNameLabel[myPlayer.id]){
                playersNameLabel[myPlayer.id].visible = true;
            }
        },

        createOthersSprite(data) {
            let player = this.add.isoSprite(data.x, data.y, data.z, 'cowboy_spritesheet', 0, obstacleGroup); //Create sprite
            player.customID = data.id;
            this.addSpawnEffect(player);
            this.addAnimation(player);
            player.anchor.set(0.5);
            game.physics.isoArcade.enable(player);
            player.body.collideWorldBounds = true;
            spritesList[data.id] = player;
            // playersNameLabel[data.id] = game.add.text(player.position.x, player.position.y - 100, data.username, {
            //     font: "25px Arial",
            //     fill: data.color,
            //     align: "center"
            // });
            // playersNameLabel[data.id].anchor.setTo(0.5, 0.5);
            if (playersNameLabel[data.id]) {
                playersNameLabel[data.id].visible = true;
            }
        },

        removeSprite(playerID) {
            let pos = null;
            if (myPlayerSprite.customID == playerID) {
                game.camera.follow(null);
                pos = myPlayerSprite.body.position;
                myPlayerSprite.destroy();
                myPlayerSprite = null;

            } 
            else if (spritesList[playerID]) {
                pos = spritesList[playerID].body.position;
                spritesList[playerID].destroy();
                delete spritesList[playerID];
            }
            // playersNameLabel[playerID].destroy();
            // delete playersNameLabel[playerID];
        },

        removePlayer(playerID){
            if (spritesList[playerID]) {
                playersNameLabel[playerID].destroy();
                delete playersNameLabel[playerID];
                spritesList[playerID].destroy();
                delete spritesList[playerID];
                delete playersConnected[playerID];
                gameStatsMenu.removePlayer(playerID);
            }
        },

        createMoneySprite(data){
            let moneySprite = this.add.isoSprite(data.x, data.y, data.z, 'money_sprite', 0, obstacleGroup); //Create sprite
            moneySprite.customID = data.id;
            moneySprite.anchor.set(0.5);
            moneySprite.scale.set(0.5);
            game.physics.isoArcade.enable(moneySprite);
            moneySprite.body.collideWorldBounds = true;
            moneySprite.body.immovable = true;
            moneySprite.body.allowGravity = true;
            this.moneyList[data.id] = moneySprite;
        },

        removeMoney(moneyID){
            if (this.moneyList[moneyID]){
                this.moneyList[moneyID].destroy();
                delete this.moneyList[moneyID];
            }
        },

        addNewPerk(data){
            let type = "";
            if(data.type == 'health'){
                type = 'heart_icon';
            }
            else if(data.type == 'shield'){
                type = 'shield_icon';
            }
            else if(data.type == 'bullet'){
                type = 'black_bullet';
            }
            let perkSprite = this.add.isoSprite(data.x, data.y, data.z, type, 0, obstacleGroup); //Create sprite
            perkSprite.customID = data.id;
            perkSprite.customType = data.type;
            perkSprite.anchor.set(0.5);
            perkSprite.scale.set(0.5);
            game.physics.isoArcade.enable(perkSprite);
            perkSprite.body.collideWorldBounds = true;
            perkSprite.body.immovable = true;
            perkSprite.body.allowGravity = false;
            this.perkList[data.id] = perkSprite;
        },

        removePerk(perkID) {
            if (this.perkList[perkID]) {
                this.perkList[perkID].destroy();
                delete this.perkList[perkID];
            }
        },
        
        addCurrentMap(data) {
            let floorTile;
            data.floorTiles.forEach(element => {
                floorTile = this.add.isoSprite(element[0], element[1], element[2], element[3], element[4], floorGroup);
                floorTile.anchor.set(0.5, 0.0);
                game.physics.isoArcade.enable(floorTile);
                floorTile.body.immovable = true;
                floorTile.body.allowGravity = false;
            });

            let obstacle;
            data.obstacles.forEach(element => {
                obstacle = this.add.isoSprite(element[0], element[1], element[2], element[3], element[4], obstacleGroup);
                obstacle.anchor.set(0.5);
                if(element[3] == "metal_cube"){
                    obstacle.scale.set(0.7);
                }
                game.physics.isoArcade.enable(obstacle);
                obstacle.body.immovable = true;
                obstacle.body.allowGravity = false;
                if (element[3] == 'rubik_cube'){
                    this.rubikcubes.push(obstacle);
                }
            });

            let effect;
            data.effects.forEach(element => {
                if (element[3] == 'base'){
                    effect = this.add.isoSprite(element[0], element[1], element[2], element[3], element[4], effectGroup);
                    game.physics.isoArcade.enable(effect);
                    effect.body.immovable = true;
                    effect.body.allowGravity = false;
                    this.base = effect;
                }else{
                    effect = this.add.isoSprite(element[0], element[1], element[2], element[3], element[4], obstacleGroup);
                }
                effect.anchor.set(0.5);
            });
        },
        
        addNewBullet(bullet_list) {
            for (let i = 0; i < bullet_list.length; i++) {
                let bullet = bullet_list[i];
                let bulletSprite = this.add.isoSprite(bullet.x, bullet.y, bullet.z, 'black_bullet', 0, bulletGroup);
                bulletSprite.scale.set(0.3);
                bulletSprite.anchor.set(0.5);
                bulletSprite.name = "bullet";
                bulletSprite.owner = bullet.owner;
                bulletSprite.customID = bullet.id;
                game.physics.isoArcade.enable(bulletSprite);
                bulletSprite.body.collideWorldBounds = true;
                bulletSprite.checkWorldBounds = true;
                bulletSprite.events.onOutOfBounds.add(this.bullet_out, this);
                bulletSprite.body.velocity.x = bullet.velocityX;
                bulletSprite.body.velocity.y = bullet.velocityY;
                bulletSprite.body.bounce.set(0.01, 0.01, 0.01);
                this.bulletSpriteList[bullet.id] = bulletSprite;
                this.bulletList[bullet.id] = bullet;
                setTimeout(() => {
                    this.destroyBullet(bulletSprite);
                }, 700);
            }
        },

        bullet_out(bullet) {
            console.log("bullet out");

        },

        bullet_hit(otherObject, bulletSprite) {
            if (otherObject && bulletSprite.owner != otherObject.customID) {
                this.destroyBullet(bulletSprite);
                if(otherObject.customID && bulletSprite.owner == client.id){
                    client.bulletHitPlayer(otherObject.customID);
                }
            }
        },

        destroyBullet(bulletSprite) {
            // console.log("destroying bullet");
            let id = bulletSprite.customID;
            bulletSprite.destroy();
            delete this.bulletSpriteList[id];
            delete this.bulletList[id];
        },
        
        gameOver(){
            // console.log("GAME OVER");
            disableGameKeys();
            gameStatsMenu.changeTitle("GAME OVER");
            gameStatsMenu.show();
            document.querySelector("#game").style.cursor = "auto";
        },

        gotoLobbyState(){
            this.changeState('Lobby');
        },

        quit(){
            client.leaveMatch();
            this.changeState("MainMenu");
        },

        changeState(state, currentGameState = null) {
            if (this.loadingSprite) {
                this.loadingSprite.remove();
                this.loadingSprite = null;
            }
            chat.remove();
            chat = null;
            pauseMenu.remove();
            pauseMenu = null;
            gameStatsMenu.remove();
            gameStatsMenu = null;
            disableGameKeys();
            clearInterval(this.intervalTimer);
            game.state.start(state);
        },

        updateMinimap() {
            graphics_minimap.clear();
            graphics_minimap.lineStyle(0);
            let posX = 0,
                posY = 0;
            let color = null;
            for (let i = 0; i < this.rubikcubes.length; i++) {
                let cube = this.rubikcubes[i];
                 posX = (cube.body.position.x / WORLD_SIZE) * 200;
                 posY = (cube.body.position.y / WORLD_SIZE) * 200;
                 graphics_minimap.beginFill(0xAAAA22, 1);
                 graphics_minimap.drawRect(posX-10, posY-10, 20,20);
                 graphics_minimap.endFill();
            }
            if (this.base){
                posX = (this.base.body.position.x / WORLD_SIZE) * 200;
                posY = (this.base.body.position.y / WORLD_SIZE) * 200;
                graphics_minimap.lineStyle(2, 0x00FF00, 1);
                graphics_minimap.drawCircle(posX, posY, 20);
                graphics_minimap.lineStyle(0);
                // graphics_minimap.endFill();
            }
            $.each(playersConnected, function (index, player) {
                if (player.isAlive) {
                    color = Phaser.Color.hexToColor(player.color);
                    posX = (player.x / WORLD_SIZE) * 200;
                    posY = (player.y / WORLD_SIZE) * 200;
                    graphics_minimap.beginFill(Phaser.Color.getColor(color.r, color.g, color.b), 1);
                    graphics_minimap.drawCircle(posX, posY, 5);
                    graphics_minimap.endFill();
                }
            });
            if (myPlayer && myPlayerSprite) {
                color = Phaser.Color.hexToColor(myPlayer.color);
                posX = (myPlayer.x / WORLD_SIZE) * 200;
                posY = (myPlayer.y / WORLD_SIZE) * 200;
                graphics_minimap.beginFill(Phaser.Color.getColor(color.r, color.g, color.b), 1);
                graphics_minimap.drawCircle(posX, posY, 10);
                graphics_minimap.endFill();
            }
        },

        resize(e) {
            gameContainer.style.width = window.innerWidth + "px";
            gameContainer.style.height = window.innerHeight + "px";
            game.scale.setGameSize($(window).width(), $(window).height() - 53);
            try {
                let centerX = game.width / 2,
                    centerY = game.height / 2;
                direction_polygon.N = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point((game.width / 3) * 2, 0), new Phaser.Point(game.width, 0), new Phaser.Point(game.width, game.height / 3)]);
                direction_polygon.NW = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point(game.width / 3, 0), new Phaser.Point((game.width / 3) * 2, 0)]);
                direction_polygon.W = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point(game.width / 3, 0), new Phaser.Point(0, 0), new Phaser.Point(0, game.height / 3)]);
                direction_polygon.SW = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point(0, game.height / 3), new Phaser.Point(0, (game.height / 3) * 2)]);
                direction_polygon.S = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point(0, (game.height / 3) * 2), new Phaser.Point(0, game.height), new Phaser.Point(game.width / 3, game.height)]);
                direction_polygon.SE = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point(game.width / 3, game.height), new Phaser.Point((game.width / 3) * 2, game.height)]);
                direction_polygon.E = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point((game.width / 3) * 2, game.height), new Phaser.Point(game.width, game.height), new Phaser.Point(game.width, (game.height / 3) * 2)]);
                direction_polygon.NE = new Phaser.Polygon([new Phaser.Point(centerX, centerY), new Phaser.Point(game.width, game.height / 3), new Phaser.Point(game.width, (game.height / 3) * 2)]);

                darkness_polygon = new Phaser.Polygon([new Phaser.Point(0, 0), new Phaser.Point(game.width, 0), new Phaser.Point(game.width, game.height), new Phaser.Point(0, game.height)]);

                header_polygon = new Phaser.Polygon([new Phaser.Point(0, 0),
                    new Phaser.Point(game.width, 0),
                    // new Phaser.Point(game.width, 120),
                    new Phaser.Point(game.width, 60), //OU SA
                    // new Phaser.Point(game.width - 150, 120),
                    new Phaser.Point(game.width - 200, 60),
                    new Phaser.Point(300, 60),
                    new Phaser.Point(280, 90),
                    new Phaser.Point(140, 90),
                    new Phaser.Point(120, 120),
                    new Phaser.Point(0, 120)
                ]);

                timer_sprite.fixedToCamera = false;
                minimap_sprite.fixedToCamera = false;
                this.sweatcoin_sprite.fixedToCamera = false;
                stats_info_sprites["sweatcoin"].fixedToCamera = false;
                this.money_sprite.fixedToCamera = false;
                stats_info_sprites["money"].fixedToCamera = false;
                this.bullet_sprite.fixedToCamera = false;
                stats_info_sprites["bullets"].fixedToCamera = false;

                timer_sprite.x = centerX;
                timer_sprite.y = 0;

                minimap_sprite.x = game.width - 150;
                minimap_sprite.y = game.height - 300;

                this.sweatcoin_sprite.x = centerX + 90;
                this.sweatcoin_sprite.y = 25;
                stats_info_sprites["sweatcoin"].x = centerX + 120;
                stats_info_sprites["sweatcoin"].y = 25;

                this.money_sprite.x = centerX + 180;
                this.money_sprite.y = 25;
                stats_info_sprites["money"].x = centerX + 225;
                stats_info_sprites["money"].y = 25;

                this.bullet_sprite.x = centerX + 280;
                this.bullet_sprite.y = 25;
                stats_info_sprites["bullets"].x = centerX + 310;
                stats_info_sprites["bullets"].y = 25;

                timer_sprite.fixedToCamera = true;
                minimap_sprite.fixedToCamera = true;
                this.sweatcoin_sprite.fixedToCamera = true;
                stats_info_sprites["sweatcoin"].fixedToCamera = true;
                this.money_sprite.fixedToCamera = true;
                stats_info_sprites["money"].fixedToCamera = true;
                this.bullet_sprite.fixedToCamera = true;
                stats_info_sprites["bullets"].fixedToCamera = true;

            } catch (e) {
                //NOTHING TO DO, let it be !! .. :)
                // console.log(e);
            }
        },

        connectionFailure() {
            this.changeState('ConnectionMenu');
        }
        
    };

function updateChatMessages(data) {
    if(chat){
        chat.update(data);
    }
}
