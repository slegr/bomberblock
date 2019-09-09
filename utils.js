let Utils = {
    randomPosition : function(minW, minH, maxW, maxH){
        let x = Math.round(Math.random() * (maxW) + minW);
        let y = Math.round(Math.random() * (maxH) + minH);
        return {x, y};
    },

    random(min, max){
        return Math.round(Math.random()*max) + min;
    },

    getDistanceBetween(p1, p2){
        let a = p1.x - p2.x;
        let b = p1.y - p2.y;
        return Math.floor(Math.sqrt(a * a + b * b));
    }

    
}
module.exports = Utils;