const TILES = ["grass", "rock_tile", "platform_white", "sand"];

let getPixels = require("get-pixels");
let Utils = require('../utils');

module.exports = class Map {
    constructor(world_size) {
        this.world_size = world_size;
        this.mapName = "LEVEL 1";
        this.mapImagePath = "screenshot_game_level1.png";
        this.floorTiles = [];
        this.obstacles = [];
        this.effects = [];
        this.item_pos_deploy = [];
        this.player_pos_deploy = [];
        this.sizeFloor = 80;
        this.nbTileX = this.world_size/this.sizeFloor;
        this.startingPoint = {
            x : this.sizeFloor * 3,
            y : this.sizeFloor * 3,
            width : this.sizeFloor * 6,
            height : this.sizeFloor * 6 
        }

        this.positions_initiales = [];

        this.tileArray = [];

        this.getPixelsOfImage();
        // this.fillMap();
    }

    getPixelsOfImage(){
        getPixels("map_tileset/level1.png", (err, pixels) => {
            if (err) {
                console.log(err);
                return
            }
            let data = pixels.data, chunk = 4;
            for (let i = 0; i < data.length; i += chunk) {
                this.tileArray.push(data.slice(i, i + chunk));
            }
            this.fillMap();
        });
    }

    fillMap(){
        let index = 0;
        for (let xt = 0; xt < this.world_size; xt += this.sizeFloor) {
            for (let yt = 0; yt < this.world_size; yt += this.sizeFloor) {
                let color = this.tileArray[index];
                if(color){
                    if (color[0] == 0 && color[1] == 255 && color[2] == 0) { //GRASS
                        this.floorTiles.push([xt, yt, 0, TILES[0], 0]);
                    } else if (color[0] == 255 && color[1] == 255 && color[2] == 255) { //STARTING POINTS
                        this.floorTiles.push([xt, yt, 5, TILES[2], 0]);
                        this.positions_initiales.push({x : xt, y: yt, z: 0});
                    } else if (color[0] == 0 && color[1] == 0 && color[2] == 0) { //ROCKS
                        this.floorTiles.push([xt, yt, 0, TILES[1], 0]);
                    } else if (color[0] == 255 && color[1] == 255 && color[2] == 0) { //SAND
                        this.floorTiles.push([xt, yt, 0, TILES[3], 0]);
                    }
                }
                else{
                    this.floorTiles.push([xt, yt, 0, TILES[0], 0]);
                }
                index++;
            }
        }
        for (let y = 0; y < this.world_size; y += 110 ) {
            for (let x = 0; x < this.world_size; x += 110) {
                if(y == 0 || y >= this.world_size-110 || x == 0 || x >= this.world_size-110){
                    this.obstacles.push([x, y, 0, 'metal_cube', 0]);
                }
            }
        }
        let centerX = this.world_size/2;
        let centerY = this.world_size/2;
        let pileCenter = [
            { x: centerX/2, y : centerY/2},
            { x: centerX / 2, y: (centerY / 2)*3 },
            { x: (centerX / 2) * 3, y: centerY / 2 },
            { x: (centerX / 2) * 3, y: (centerY / 2) * 3 },
        ]
        this.createPile(pileCenter);
        // this.createCenterBlock(centerX, centerY);
        // this.createBigBlock_withStairs(centerX, centerY);
        //THE BASE
        this.effects.push([centerX-50, centerY-50, 0, 'base', 0]);
    }

    createPile(pileCenterList){
        for (let i = 0; i < pileCenterList.length; i++) {
            let centerX = pileCenterList[i].x;
            let centerY = pileCenterList[i].y;
            // this.obstacles.push([centerX, centerY, 0, 'metal_cube', 0]);
            // this.obstacles.push([centerX, centerY, 100, 'metal_cube', 0]);
            // this.obstacles.push([centerX - 110, centerY, 0, 'metal_cube', 0]);
            // this.obstacles.push([centerX + 110, centerY, 0, 'metal_cube', 0]);
            // this.obstacles.push([centerX, centerY - 110, 0, 'metal_cube', 0]);
            // this.obstacles.push([centerX, centerY + 110, 0, 'metal_cube', 0]);
            this.createBigBlock_withStairs(centerX, centerY);
        }
    }

    createCenterBlock(centerX, centerY) {
        let startX = centerX-100;
        let startY = centerY-100;
        let nbEtage = 3,
            nbRows = 3,
            nbcolumns = 3;
                    
        let x = startX;
        let y = startY;
        let z = 0;
        for (let etage = 0; etage < 3; etage++) {
            z = etage * 90;
            for (let row = 0; row < 3; row++) {
                x = startX + (row * 100);
                for (let column = 0; column < 3; column++) {
                    y = startY + (column * 100);
                    this.obstacles.push([x, y, z, 'wood_cube', 0]);
                }
            }
        }
        //Add the money box!
        // this.obstacles.push([centerX, centerY, z+300, 'money_cube', 0]);
        this.obstacles.push([centerX, centerY, z + 300, 'rubik_cube', 0]);
    }  

    createBigBlock_withStairs(centerX, centerY){
        let blockSize = 90;
        let startX = centerX - (blockSize*3);
        let startY = centerY - (blockSize * 3);
        let x = null;
        let y = null;
        //ETAGE 1
        let e1_size = 7;
        let e1_z = 0;
        for (let i = 0; i < e1_size; i++) {
            for (let j = 0; j < e1_size; j++) {
                if( i == 0 || i == e1_size-1 || j == 0 || j == e1_size-1){
                    x = startX + (i*blockSize);
                    y = startY + (j*blockSize);
                    this.obstacles.push([x, y, e1_z, 'wood_cube', 0]);
                }
            }
        }

        let e2_size = 5;
        let e2_z = 90;
        startX += blockSize;
        startY += blockSize;
        for (let i = 0; i < e2_size; i++) {
            for (let j = 0; j < e2_size; j++) {
                if (i == 0 || i == e2_size - 1 || j == 0 || j == e2_size - 1) {
                    x = startX + (i * blockSize);
                    y = startY + (j * blockSize);
                    this.obstacles.push([x, y, e2_z, 'wood_cube', 0]);
                }
            }
        }

        let e3_size = 3;
        let e3_z = 90 * 2;
        startX += blockSize;
        startY += blockSize;
        for (let i = 0; i < e3_size; i++) {
            for (let j = 0; j < e3_size; j++) {
                x = startX + (i * blockSize);
                y = startY + (j * blockSize);
                this.obstacles.push([x, y, e3_z, 'wood_cube', 0]);
            }
        }
        this.effects.push([centerX, centerY, e3_z + 100, 'spawn_effect_items', 0]);
        this.item_pos_deploy.push({x : centerX, y : centerY, z : e3_z+100, itemID : null});
        this.obstacles.push([centerX, centerY, e3_z + 250, 'rubik_cube', 0]);

    }

    randomTile(){
        let rnd = Math.round(Math.random() * (TILES.length-1));
        return TILES[rnd];
    }
}