const MAX_CHAR = 10;
let namePattern = /^\w\S{0,9}$/;

BomberBox.ConnectionMenu.prototype = {
    init: function () {
        this.graphics = null;
        this.width = 900;
        this.height = 500;
        this.x_origin = window.innerWidth / 2 - this.width / 2;
        this.y_origin = window.innerHeight / 2 - this.height / 2;

        this.menu_Panel = null;
        this.helpMessage = null;
        this.input_name = null;
        this.btn_play = null;
        this.input_color = null;
        this.currentColor = "#00FF00";
    },
    preload: function () {
        let eventMusic = new CustomEvent('sm_connectionmenu');
        window.dispatchEvent(eventMusic);
        this.createMenu();
        // $(".connectionmenu-helptext").hide();
        $(".connectionMenu").hide();
        $(".connectionMenu").fadeIn(500);
        $(".input-username").focus();
        this.makeModalTilt();

        $("#color_picker").spectrum({
            flat: true,
            showInput: true,
            color: this.currentColor,
            change: (color)=> {
                this.currentColor = color.toHexString();
                $(".input-username").css("color", this.currentColor);
            },
            move: (color) => {
                this.currentColor = color.toHexString();
                $(".input-username").css("color", this.currentColor);
            }
        });
    },

    createMenu: function () {
        this.menu_panel = document.createElement("div");
        this.menu_panel.className = "connectionMenu";

        this.input_name = document.createElement("input");
        this.input_name.className = "input-username";
        this.input_name.setAttribute("type", "text");
        this.input_name.setAttribute("placeholder", "Your Name ...");
        this.input_name.onkeyup = (e) => {
            if(e.which == 13) this.start();
        }

        this.helpMessage = document.createElement("div");
        this.helpMessage.className = "connectionmenu-helptext";
        this.helpMessage.textContent = " ";


        this.input_color = document.createElement("input");
        this.input_color.setAttribute("id", "color_picker");
        this.input_color.setAttribute("type", 'text');

        this.ctn_color_picker = document.createElement("div");
        this.ctn_color_picker.className = "container-color-picker";
        this.ctn_color_picker.appendChild(this.input_color);

        this.btn_play = document.createElement("button");
        this.btn_play.className = "btnplay";
        this.btn_play.setAttribute("type", "button");
        this.btn_play.textContent = "PLAY";
        this.btn_play.onclick = () => {
            this.start();
        };

        this.menu_panel.appendChild(this.input_name);
        this.menu_panel.appendChild(this.helpMessage);
        this.menu_panel.appendChild(this.ctn_color_picker);
        this.menu_panel.appendChild(this.btn_play);
        document.body.appendChild(this.menu_panel);

        if(client.error){
            this.input_name.disabled = true;
            this.ctn_color_picker.disabled = true;
            this.btn_play.disabled = true;
        }
    },

    update: function () {

    },
    start: function (element) {
        let name = $(".input-username").val();
        if (namePattern.test(name) || name.length < 1) {
            client.actionPlay(name, this.currentColor);
        }
        else {
            $(".input-username").val("");
            $(".connectionmenu-helptext").hide();
            // $(".connectionmenu-helptext").css({
            //     "background-color": "rgba(255,0,0,0.35)"
            // });
            this.helpMessage.textContent = (name.length >= 10) ? "MAX 10 CHARACTERS" : "INVALID CHARACTERS OR SPACES" ;
            // $(".connectionmenu-helptext").val((name.length >= 10)?"MAX 10 CHARACTERS":"INVALID CHARACTERS OR SPACES" );
            $(".connectionmenu-helptext").fadeIn(1000);
        }
    },

    makeModalTilt(){
        // $("body").mousemove(function (event) {
        //     let variableDeplacement = 10000;
        //     let trans_x = $(".connectionMenu").offset().left + $(".connectionMenu").width() / 2 - event.offsetX;
        //     let trans_y = $(".connectionMenu").offset().top + $(".connectionMenu").height() / 2 - event.offsetY;
        //     $(".connectionMenu").css({
        //         "-webkit-transform-style": "preserve-3d",
        //         "-webkit-transform": "rotateX(" + trans_y / variableDeplacement + "deg) rotateY(" + (-trans_x) / variableDeplacement + "deg) rotateZ(0)",
        //         "transform-style": "preserve-3d",
        //         "transform": "rotateX(" + trans_y / variableDeplacement + "deg) rotateY(" + (-trans_x) / variableDeplacement + "deg) rotateZ(0)"
        //     });
        // });
    },

    connectionFailure(){
        console.log("Connection Failure : Login");
        this.input_name.disabled = true;
        this.ctn_color_picker.disabled = true;
        this.btn_play.disabled = true;
    },

    connectionEstablished(){
        this.input_name.disabled = false;
        this.ctn_color_picker.disabled = false;
        this.btn_play.disabled = false;
    }

}
function enterGame() {
    $(".connectionMenu").fadeOut(500, ()=>{
        $(".connectionMenu").remove();
        game.state.start('MainMenu');
    });
}