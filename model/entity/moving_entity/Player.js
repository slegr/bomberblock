let MovingEntity = require('./MovingEntity');
let Bullet = require('./Bullet');
let Utils = require("../../../utils");
const WALK = 0;
const STEP_BACK = 1;
const MOVE_LEFT = 2;
const MOVE_RIGHT = 3;
const JUMP = 4;
const SPEED_X = 200;
const SPEED_Y = 200;
const SPEED_Z = 500;
const SPEED_VARIABLE_BULLET = 10;
const DECALAGE = 100;
const DIRECTION_VELOCITY = {
    'N' : [0, -SPEED_Y],
    'NW': [-SPEED_X, -SPEED_Y],
    'W': [-SPEED_X, 0],
    'SW': [-SPEED_X + DECALAGE, SPEED_Y - DECALAGE], //va trop vite dans ce sens
    'S': [0, SPEED_Y],
    'SE': [SPEED_X, SPEED_Y],
    'E': [SPEED_X, 0],
    'NE': [SPEED_X - DECALAGE, -SPEED_Y + DECALAGE] //va trop vite dans ce sens
};

const DIRECTION_COMPOSITION = {
    'N' : ['NW', 'W', 'SW', 'S', 'SE', 'E', 'NE'],
    'NW': ['W','SW', 'S', 'SE', 'E', 'NE', 'N'],
    'W' : ['SW', 'S', 'SE', 'E', 'NE', 'N', 'NW'],
    'SW': ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W'],
    'S':  ['SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'],
    'SE': ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S'],
    'E':  ['NE', 'N', 'NW', 'W', 'SW', 'S', 'SE'],
    'NE': ['N', 'NW', 'W', 'SW', 'S', 'SE', 'E']
} ;

const bulletCost = {
    '10' : 10,
    '20' : 20,
    '50' : 30,
    '100' : 60,
};

const moneyCost = {
    '10': 10,
    '20': 20,
    '50': 30,
    '100': 60,
};

module.exports = class Player extends MovingEntity{
    constructor(id, username, color){
        super(id, 0, 0, 0);
        this.username = (username) ? username:"Player"+this.id;
        this.color = color;
        this.score = 0.0;
        this.bestScore = 0;
        this.kills = 0;
        this.totalKills = 0;
        this.deaths = 0;
        this.totalDeaths = 0;
        this.totalDistance = 0;
        this.money = 0;
        this.sweatcoin = 0;
        this.sweatcoin_dollar_value = 0.1;
        this.nbBulletsLeft = 0;
        this.addBullet(30);
        this.weapons = [];
        this.bag = [];
        this.missions = [];
        this.actions = [];
        this.step = 1;
        this.isWalking = false;
        this.isStepingBack = false;
        this.isGoingLeft = false;
        this.isGoingRight = false;
        this.isJumping = false;
        this.isDoubleJumping = false;
        this.isOnGround = false;
        this.isFalling = false;
        this.isShooting = false;
        this.isInBase = false;
        this.canShoot = true;
        this.bulletList = {};
        this.bullet_id = 0;
        this.isReady = false;
    }

    init(){
        this.isWalking = false;
        this.isStepingBack = false;
        this.isJumping = false;
        this.isDoubleJumping = false;
        this.isOnGround = false;
        this.isFalling = false;
        this.canShoot = true;
        this.bulletList = {};
        this.bullet_id = 0;
        // this.addBullet(20);
        this.isReady = false;
        this.bestScore = (this.score > this.bestScore)? this.score: this.bestScore;
        this.score = 0.0;
        this.life = 100.0;
        this.shield = 100.0;
        this.totalKills += this.kills;
        this.kills = 0;
        this.deaths = 0;
        this.isAlive = true;
        this.isInBase = false;
        this.actions = [];
    }

    fullinit(){
        this.init();
    }

    setPos(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    update(data){
        let result = {};
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
        this.direction = data.d;
        this.isOnGround = data.isOnGround;
        this.isFalling = data.isFalling;
        this.isInBase = data.isInBase;
        if(this.isOnGround){
            this.isJumping = false;
            this.isDoubleJumping = false;
        }
        let actions = data.actions;
        if(actions['UP']){
            this.walk();
        }
        else if (actions['DOWN']){
            this.stepBack();
        }
        else{
            this.isWalking = false;
            this.isStepingBack = false;
        }

        if (actions['LEFT']) {
            this.moveLeft();
        }
        else if (actions['RIGHT']) {
            this.moveRight();
        }
        else{
            this.isGoingLeft = false;
            this.isGoingRight = false;
        }
        if (!actions['UP'] && !actions['DOWN'] && !actions['LEFT'] && !actions['RIGHT']){
            this.stopMoving();
        }

        if(actions['SHIFT']){
            this.velocityX *= 1.5;
            this.velocityY *= 1.5;
        }

        if (actions['SPACE'] == true){
            if(this.isOnGround && !this.isJumping && !this.isFalling){
                this.isOnGround = false;
                this.isJumping = true;
                this.velocityZ = SPEED_Z;
            }
            if(this.isFalling && !this.isDoubleJumping){
                this.isDoubleJumping = true;
                this.velocityZ = SPEED_Z;
            }
            else{
                this.velocityZ = 0;
            }
        }
        else{
            this.velocityZ = 0;
        }
        
        if (actions["LEFT_CLICK"]){
            result.bullet = this.shoot();
        }
        return result;
    }

    // MAKE THE Z POSITION DECREASE
    jump(){

    }

    hand_attack(){

    }

    gun_attack(){

    }

    shoot(){
        let bullet = null;
        if (this.canShoot){
            this.isShooting = true;
            let id = this.id +"_"+this.bullet_id;
            let decalageX = DIRECTION_VELOCITY[this.direction][0]/10;
            let decalageY = DIRECTION_VELOCITY[this.direction][1] / 10;
            bullet = new Bullet(id, this.id, this.x + decalageX,this.y+decalageY, this.z+20, DIRECTION_VELOCITY[this.direction][0]*SPEED_VARIABLE_BULLET, DIRECTION_VELOCITY[this.direction][1]*SPEED_VARIABLE_BULLET, this.color);
            this.bulletList[id] = bullet;
            this.canShoot = false;
            setTimeout(()=>{
               delete this.bulletList[id];
            },1000);
            setTimeout(()=>{
                this.isShooting = false;
            },100);
            this.nbBulletsLeft--;
            if(this.nbBulletsLeft > 0){
                setTimeout(()=>{
                    this.canShoot =  true;
                },250);
            }
            this.bullet_id++;
        }
        return bullet;
    }

    makeSweatcoins() {
        this.totalDistance += 0.02;
        this.sweatcoin += 0.02;
    }

    addLife(value=0){
        this.life += value;
        if(this.life > 100){
            this.life = 100;
        }
    }

    addShield(value = 0) {
        this.shield += value;
        if (this.shield > 100) {
            this.shield = 100;
        }
    }
    
    addBullet(nbBullets = 15){
        this.nbBulletsLeft += nbBullets;
        this.canShoot = true;
    }

    buyAmmo(nbBullets){
        let cost = bulletCost[nbBullets];
        if (cost) {
            if( this.money >= cost){
                this.money -= cost;
                this.addBullet(nbBullets);
            }
        }
    }

    exchangeSweatcoins(){
        this.money += this.sweatcoin * this.sweatcoin_dollar_value;
        this.sweatcoin = 0;
    }

    buyMoney(nbSweatcoin){
        if (nbSweatcoin && nbSweatcoin <= this.sweatcoin) {
            this.sweatcoin -= nbSweatcoin;
            this.money += nbSweatcoin * this.sweatcoin_dollar_value;
        }
    }

    targetHit(playerAlive){
        this.score += 10;
        if (!playerAlive) {
            this.kills++;
            this.score += 50;
        }
    }

    gotHit(){
        let result = {
            alive : true,
            value : null
        };
        if(this.shield > 0){
            this.shield -= 50;
            if(this.shield < 0){
                this.life += this.shield;
                this.shield = 0;
            }
        }
        else{
            this.life -= 50;
        }
        if(this.life <= 0){
            this.life = 0;
            this.isAlive = false;
            this.deaths++;
            this.totalDeaths++;
        }
        result.alive = this.isAlive;
        if(!this.isAlive){
            result.value = this.dropMoney();
        }
        return result;
    }

    dropMoney(){
        let rndChance = Utils.random(0, 100);
        let moneyValue = 0;
        if(rndChance < 50){
            moneyValue = 10;
        }
        else if (rndChance < 75) {
            moneyValue = 25;
        }
        else if (rndChance < 100) {
            moneyValue = 50;
        }
        if(this.money - moneyValue >= 0){
            this.money -= moneyValue;
        }
        else{
            this.money = 0;
            moneyValue = 10;
        }
        console.log("got shoot : "+this.money+" - "+moneyValue);
        return moneyValue;
    }

    revive(x, y){
        this.isAlive = true;
        this.life = 100.0;
        this.shield = 100.0;
        this.addBullet();
        this.setPos(x, y , 0);
    }

    //grenades and rocks
    throw_attack() {

    }


    stopMoving(){
        this.velocityY = 0;
        this.velocityX = 0;
    }

    walk(){
        this.isWalking = true;
        this.isStepingBack = false;
        this.velocityX = DIRECTION_VELOCITY[this.direction][0];
        this.velocityY = DIRECTION_VELOCITY[this.direction][1];
        this.makeSweatcoins();
    }

    stepBack(){
        this.isWalking = false;
        this.isStepingBack = true;
        this.velocityX = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][3]][0];
        this.velocityY = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][3]][1];
        this.makeSweatcoins();
    }

    moveLeft(){
        if(this.isWalking){
            this.velocityX = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][0]][0];
            this.velocityY = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][0]][1];
        }
        else if(this.isStepingBack){
            this.velocityX = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][2]][0];
            this.velocityY = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][2]][1];
        }
        else{    
            this.isGoingLeft = true;
            this.isGoingRight = false;
            this.velocityX = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][1]][0];
            this.velocityY = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][1]][1];
        }
        this.makeSweatcoins();
    }

    moveRight(){
        if (this.isWalking) {
            this.velocityX = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][6]][0];
            this.velocityY = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][6]][1];
        }
        else if (this.isStepingBack) {
            this.velocityX = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][4]][0];
            this.velocityY = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][4]][1];
        }
        else {
            this.isGoingRight = true;
            this.isGoingLeft = false;
            this.velocityX = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][5]][0];
            this.velocityY = DIRECTION_VELOCITY[DIRECTION_COMPOSITION[this.direction][5]][1];
        }
        this.makeSweatcoins();
    }

}