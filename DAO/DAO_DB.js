
let sqlite3 = require('sqlite3').verbose();

module.exports = class DAO_DB {
    constructor(){
        this.db = null;
        this.currentScores = [];
        this.createTable();
    }

    open(){
        this.db = new sqlite3.Database('DAO/gamedb.db', (err) => {
            if (err) {
                return console.error(err.message);
            }
            // console.log('Connected to DAO/gamedb.db SQlite database.');
        });
    }

    close(){
        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            // console.log('Close the database connection.');
        });
    }

    createTable(){
        this.open();
        this.db.run("CREATE TABLE IF NOT EXISTS scores (username TEXT, score INTEGER, color TEXT)");
        this.close();

    }

    getAllScores(){
        this.open();
        this.db.all("SELECT username, score, color FROM scores ORDER BY score DESC LIMIT 10", (err, rows) => {
            this.setScores(rows);
        });
        this.close();
        return this.currentScores;
    }

    insertNewScores(data){
        let placeholder = data.map((player) => '(?, ?, ?)').join(',');
        let newScores = [];
        for (let i = 0; i < data.length; i++) {
            let player = data[i];
            newScores.push(player.username);
            newScores.push(player.score);
            newScores.push(player.color);
        }
        let statement = "INSERT INTO scores(username, score, color) VALUES "+placeholder;
        console.log(statement);
        console.log(newScores);
        this.open();
        this.db.run(statement,newScores);
        this.close();
    }

    setScores(rows){
        this.currentScores = rows;
    }
}