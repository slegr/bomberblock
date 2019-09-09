let Match = require('./Match');

module.exports = class TeamDeathMatch extends Match{
    /**
     * CLASS TeamDeathMatch is a subclass of Match. Rules are simple, kill the most enemy players you can
     * before the timeout or the max score.
     */
    constructor(){
        super(id);
        this.teamScoreBoard = {}; //contient l'ensemble des stats de chaque joueur
        this.rules = {
            maxtime : 600, //en seconde = 10 min
            maxKill : 150
        };
    }
}