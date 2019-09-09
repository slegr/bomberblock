let Match = require('./Match');

module.exports = class OpenWorld extends Match {
    /**
     * Class OpenWorld is a subclass of Match. Rules : Infinite Time, infinite kills, infinite and random enemies.
     * 
     */
    constructor() {
        super(id);
        this.teamScoreBoard = {}; //contient l'ensemble des stats de chaque joueur
        this.rules = {
            maxtime: null, //infinite
            maxKill: null //infinite
        };
    }
}