let MovingEntity = require('./MovingEntity');
module.exports = class Bullet extends MovingEntity{
    constructor(id, owner, x, y, z, veloX, veloZ, color){
        super(id, x, y, z, veloX, veloZ);
        this.color = color;
        this.owner = owner;
    }

    update(){

    }
}