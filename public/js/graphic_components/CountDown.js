class CountDown {
    constructor() {
        this.time = 0;
        this.mainPanel = null;
        this.number = null;
        this.x = 0;
        this.y = 0;
        this.scale = 1.0;
        this.width = 100;
        this.height = 100;
        this.back = null;
        this.text = null;
        this.scaleText = this.scale * 25;
        this.scaleText_Max = this.scaleText + 10;
        this.scaleText_Min = this.scaleText - 10;
        this.scaleStep = 1;
        this.create();

        // this.interval = setInterval(() => {
        //     this.tick();
        // }, 1000 / 25);
    }

    create(){
        this.mainPanel = document.createElement("div");
        this.mainPanel.className = "countDownPanel";
        this.number = document.createElement("div");
        this.number.style.width = "auto";
        this.number.style.height = "auto";
        this.mainPanel.appendChild(this.number);
        document.body.appendChild(this.mainPanel);
    }

    update(time){
        this.number.textContent = time;

    }

    remove(){
        this.number.textContent = "go";
        this.mainPanel.style.background = "transparent";
        setTimeout(()=>{
            this.mainPanel.remove();
        },1000);
    }
}