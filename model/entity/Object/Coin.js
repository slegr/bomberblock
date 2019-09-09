let Entity = require('../Entity');

module.exports = class Coin extends Entity {
    constructor(id, x, y, z, value) {
        super(id, x, y, z);
        this.value = value;
    }
}