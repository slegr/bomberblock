let Entity = require('../Entity');
let Utils = require("../../../utils");
const perk_types = [ 'health', 'shield', 'bullet'];

module.exports = class Perk extends Entity {
    constructor(id, x, y, z, value=null, type=null) {
        super(id, x, y, z);
        this.type = type;
        this.value = value;
        if(!type || perk_types.indexOf(type) < 0){
            let rndType = Utils.random(0, perk_types.length-1);
            this.type = perk_types[rndType];
        }
        if(!value){
            if(this.type == 'health'){
                this.value = Utils.random(25, 100);
            }
            else if(this.type == 'shield'){
                this.value = Utils.random(25, 100); 
            }
            else if (this.type == 'bullet') {
                // this.value = Utils.random(5, 50);
                this.value = this.randomPerkValue();
            }
        }
    }

    randomPerkValue(){
        let rndChance = Utils.random(0,100);
        let rndValue = null;
        if(rndChance < 40){
            rndValue = Utils.random(5,20);
        }
        else if(rndChance < 60){
            rndValue = Utils.random(10, 40);
        }
        else if (rndChance < 80) {
            rndValue = Utils.random(25, 60);
        }
        else if (rndChance < 100) {
            rndValue = Utils.random(50, 100);
        }
        return rndValue;
    }
}