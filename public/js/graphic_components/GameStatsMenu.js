class GameStatsMenu{
    constructor(){
        this.panel_game_stats = null;
        this.statsBoard_ctn = null;
        this.playersCtn = {};
        this.titleCtn = null;

        this.createPanel();
        this.createFirstRow();
        this.hide();
    }

    tick(){

    }

    createPanel(){
        this.panel_game_stats = document.createElement("div");
        this.panel_game_stats.className = "gameStatsMenu";

        this.titleCtn = document.createElement("div");
        this.titleCtn.className = "gameStatsMenu_title";
        this.titleCtn.textContent = "PLAYERS";
        this.panel_game_stats.appendChild(this.titleCtn);

        this.statsBoard_ctn = document.createElement("div");
        this.statsBoard_ctn.className = "gameStatsMenu_statsboard";
        this.panel_game_stats.appendChild(this.statsBoard_ctn);
        document.body.appendChild(this.panel_game_stats);
    }

    show(){
        $(".gameStatsMenu").show();
    }

    hide(){
        $(".gameStatsMenu").hide();
    }

    changeTitle(title){
        this.titleCtn.textContent = title;
    }

    updatePlayer(player){
        if (player){
            if (this.playersCtn[player.id]) {
                let pCtn = this.playersCtn[player.id].childNodes;
                pCtn[2].textContent = player.score;
                pCtn[3].textContent = player.kills;
                pCtn[4].textContent = player.deaths;
            }
            else{
                this.addPlayer(player);
            }
        }
    }   

    /**
     * @param Array players
     */
    addPlayers(players){
        
    }

    addPlayer(player){
        this.playersCtn[player.id] = this.createRow(player);
    }

    createFirstRow(){
        let row = document.createElement("div");
        row.className = "gameStatsMenu_statsboard_row";
        row.appendChild(this.createCell("ID", "greenYellow", null, "center"));
        row.appendChild(this.createCell("Username", "greenYellow"));
        row.appendChild(this.createCell("Score", "greenYellow", null, "center"));
        row.appendChild(this.createCell("Kill", "greenYellow", null, "center"));
        row.appendChild(this.createCell("Death", "greenYellow", null, "center"));
        this.statsBoard_ctn.appendChild(row);
    }

    createRow(player){
        let row = document.createElement("div");
        row.className = "gameStatsMenu_statsboard_row";
        row.id = "ctnPlayer"+player.id;
        row.appendChild(this.createCell(player.id, null, null,"center")); //ID
        row.appendChild(this.createCell(player.username, player.color)); //ID
        row.appendChild(this.createCell("", null, null,"center")); //SCORE
        row.appendChild(this.createCell("", null, null,"center")); //KILL
        row.appendChild(this.createCell("", null, null,"center")); //DEATH
        this.statsBoard_ctn.appendChild(row);
        return row;
    }

    createCell(data, color=null, backgroundColor=null, align=null){
        let cell = document.createElement("div");
        cell.className = "gameStatsMenu_statsboard_cell";
        cell.textContent = data;
        if(color){
            cell.style.color = color;
        }
        if(backgroundColor){
            cell.style.color = backgroundColor;
        }
        if(align){
            cell.style.textAlign = align;
        }
        return cell;
    }

    removePlayer(playerID){
        if(this.playersCtn[playerID]){
            this.playersCtn[playerID].remove();
            delete this.playersCtn[playerID];
        }
    }

    remove(){
        this.panel_game_stats.remove();
    }
}