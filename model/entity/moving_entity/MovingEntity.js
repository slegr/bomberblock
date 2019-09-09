let Entity = require('../Entity');

module.exports = class MovingEntity extends Entity{
    constructor(id, x, y, z, veloX=0.0, veloY=0.0, veloZ=0.0){
        super(id, x, y, z);
        this.direction = 'S';
        this.speed = 0.0;
        this.strenght = 0.0
        this.life = 100.0;
        this.shield = 100.0;
        this.isAlive = true;
        this.velocityX = veloX;
        this.velocityY = veloY;
        this.velocityZ = veloZ;
    }

    move(x, y){
        this.x = x;
        this.y = y;
    }

    kill(){

    }
}