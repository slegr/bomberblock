class PauseMenu{
    constructor(darker=false){
        this.darker = darker;
        this.panel_setting  = null;
        this.panel_setting_x = game.width / 2 - 60;
        this.panel_setting_y = 60;
        this.panel_setting_width  = game.width / 2;
        this.panel_setting_height = game.height /2;

        this.btn_setting = null;
        this.btn_setting_x = game.width - 100;
        this.btn_setting_y = 100;
        this.btn_setting_width = 50;
        this.btn_setting_height = 50;

        this.topCtn = null;

        this.btnAmmo_10 = null;
        this.btnAmmo_20 = null;
        this.btnAmmo_50 = null;
        this.btnAmmo_100 = null;

        this.btnExchangeSweatcoins = null;

        this.btn_mute = null;
        this.slider_volume = null;
        this.btnQuit = null;

        this.isMute = false;

        this.createPanel();
        this.addListeners();

        $(".panelsetting").hide();

    }

    toggleMenu(){
        $(".panelsetting").toggle("slide");
    }

    createPanel(){
        // Principal button to get setting menu
        this.btn_setting = document.createElement("button");
        this.btn_setting.className = "btnsetting";

        // SETTING PANEL
        this.panel_setting = document.createElement("div");
        this.panel_setting.className = "panelsetting";
        if (this.darker){
            this.panel_setting.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
        }

        this.topCtn = document.createElement("div");
        this.topCtn.className = "panelsetting-topCtn";

        this.createMarketPanel();

        // MUSIC container in setting panel
        let ctn_music = document.createElement("div");
        ctn_music.className = "panelSetting-ctn-music";

        let ctn_mute_volume = document.createElement("div");
        ctn_mute_volume.className = "panelSetting-ctn-music-volume";

        // mute button
        this.btn_mute = document.createElement("button");
        this.btn_mute.className = "btnMute-off";
        this.btn_mute.textContent = "MUTE";

        // volume slider
        this.slider_volume = document.createElement("input");
        this.slider_volume.className = "slider-volume";
        this.slider_volume.setAttribute("type", "range");
        this.slider_volume.setAttribute("min", "0");
        this.slider_volume.setAttribute("max", "100");
        this.slider_volume.setAttribute("value", "100");
        this.slider_volume.style.width = "100px";
        this.slider_volume.style.display = "inline-block";

        ctn_mute_volume.appendChild(this.btn_mute);
        ctn_mute_volume.appendChild(this.slider_volume);

        // container music control

        // btn previous music

        // text current music

        // btn next music

        ctn_music.appendChild(ctn_mute_volume);

        //Ajouter les composantes au panel
        this.topCtn.appendChild(ctn_music);
        this.panel_setting.appendChild(this.topCtn);

        this.btnQuit = document.createElement("button");
        this.btnQuit.className = "panelSetting-btnQuit";
        this.btnQuit.textContent = "QUIT";

        this.panel_setting.appendChild(this.btnQuit);

        //Ajout du boutons et du panel au body
        document.body.appendChild(this.btn_setting);
        document.body.appendChild(this.panel_setting);
    }

    createMarketPanel(){
        let ctn = document.createElement("div");
        ctn.className = "panelSetting-marketCtn";

        ctn.appendChild(this.createLabel("Ammo"));

        let flexAmmoCtn = this.createFlexContainer();

        this.btnAmmo_10 = this.createAmmoButton(10);
        flexAmmoCtn.appendChild(this.btnAmmo_10);
        this.btnAmmo_20 = this.createAmmoButton(20);
        flexAmmoCtn.appendChild(this.btnAmmo_20);
        this.btnAmmo_50 = this.createAmmoButton(50);
        flexAmmoCtn.appendChild(this.btnAmmo_50);
        this.btnAmmo_100 = this.createAmmoButton(100);
        flexAmmoCtn.appendChild(this.btnAmmo_100);
        ctn.appendChild(flexAmmoCtn);

        ctn.appendChild(this.createLabel("Money & Sweatcoins"));

        // flexAmmoCtn = this.createFlexContainer();

        // this.btnMoney_10 = this.createMoneyButton(10);
        // flexAmmoCtn.appendChild(this.btnMoney_10);
        // this.btnMoney_20 = this.createMoneyButton(20);
        // flexAmmoCtn.appendChild(this.btnMoney_20);
        // this.btnMoney_50 = this.createMoneyButton(50);
        // flexAmmoCtn.appendChild(this.btnMoney_50);
        // this.btnMoney_100 = this.createMoneyButton(100);
        // flexAmmoCtn.appendChild(this.btnMoney_100);
        // ctn.appendChild(flexAmmoCtn);

        this.btnExchangeSweatcoins = document.createElement("div");
        this.btnExchangeSweatcoins.className = "panelSetting-marketCtn-btn-allwidth";
        this.btnExchangeSweatcoins.textContent = "Exchange Sweatcoins";
        ctn.appendChild(this.btnExchangeSweatcoins);


        this.topCtn.appendChild(ctn);
    }

    createLabel(text){
        let label = document.createElement("div");
        label.textContent = text;
        label.style.width = "100%";
        label.style.fontSize = "20px";
        label.style.textAlign = "center";
        return label;
    }

    createFlexContainer(){
        let ctn = document.createElement("div");
        ctn.className = "gridCtn";
        return ctn;
    }

    createAmmoButton(nb){
        let btn = document.createElement("div");
        btn.className = "panelSetting-marketCtn-btn";

        let text = document.createElement("div");
        text.textContent = nb;
        btn.appendChild(text);

        let img = document.createElement("div");
        img.className = "panelSetting-marketCtn-btn-img";
        img.style.backgroundImage = "url('/game/sprites/bullet.png')"
        btn.appendChild(img);

        return btn;
    }

    createMoneyButton(nb) {
        let btn = document.createElement("div");
        btn.className = "panelSetting-marketCtn-btn";

        let text = document.createElement("div");
        text.textContent = nb;
        btn.appendChild(text);

        let img = document.createElement("div");
        img.className = "panelSetting-marketCtn-btn-img";
        img.style.backgroundImage = "url('/game/sprites/cube/money_sprite.png')"
        btn.appendChild(img);

        return btn;
    }

    addListeners(){
        if (this.btn_setting) {
            this.btn_setting.onclick = () => {
                this.toggleMenu();
            }
        }
        if(this.btn_mute){
            this.btn_mute.onclick = (e)=>{
                this.isMute = !this.isMute;
                if (this.isMute){
                    this.btn_mute.className = "btnMute-on";
                }
                else{
                    this.btn_mute.className = "btnMute-off";
                }
                let eventMusic = new CustomEvent('sm_music_mute');
                window.dispatchEvent(eventMusic);
            }
        }
        if(this.slider_volume){
            this.slider_volume.oninput = (e) =>{
                let vol = this.slider_volume.value / 100;
                let eventMusic = new CustomEvent('sm_music_volume', {
                    detail: vol
                });
                window.dispatchEvent(eventMusic);
            }
            this.slider_volume.onchange = (e) =>{
                let vol = this.slider_volume.value / 100;
                let eventMusic = new CustomEvent('sm_music_volume', {
                    detail: vol
                });
                window.dispatchEvent(eventMusic);
            }
        }

        if (this.btnQuit){
            this.btnQuit.onclick = (e) =>{
                if (game.state.getCurrentState().quit) {
                    game.state.getCurrentState().quit();
                }
            }
        }

        if (this.btnAmmo_100){
            this.btnAmmo_100.onclick = (e) =>{
                client.buyAmmo(100);
            }
            this.btnAmmo_10.onclick = (e) => {
                client.buyAmmo(10);
            }
            this.btnAmmo_20.onclick = (e) => {
                client.buyAmmo(20);
            }
            this.btnAmmo_50.onclick = (e) => {
                client.buyAmmo(50);
            }
        }

        if (this.btnExchangeSweatcoins){
            this.btnExchangeSweatcoins.onclick = (e) =>{
                client.exchangeSweatcoins();
            }
        }

        if (this.btnMoney_100) {
            this.btnMoney_100.onclick = (e) => {
                client.buyMoney(100);
            }
            this.btnMoney_10.onclick = (e) => {
                client.buyMoney(10);
            }
            this.btnMoney_20.onclick = (e) => {
                client.buyMoney(20);
            }
            this.btnMoney_50.onclick = (e) => {
                client.buyMoney(50);
            }
        }
    }

    remove(){
        this.panel_setting.remove();
        this.btn_setting.remove();
    }


}