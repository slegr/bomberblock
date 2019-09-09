class LoadingSprite{
    constructor(x, y, scale, wholePage){
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.width = this.scale * 75;
        this.height = this.scale * 75;
        this.wholePage = wholePage;
        this.angle = 0;
        this.sprite = new Image(this.width, this.height);
        this.sprite.src = "/game/images/player2.png";
        this.back = null;
        this.text = null;
        this.scaleText = this.scale * 25;
        this.scaleText_Max = this.scaleText + 10;
        this.scaleText_Min = this.scaleText - 10;
        this.scaleStep = 1;
        this.create();

        this.interval = setInterval(()=>{
            this.tick();
        }, 1000/25);
    }

    create(){
        if (this.wholePage){
            this.back = document.createElement("div");
            this.back.style.position = "absolute";
            this.back.style.top = "0px";
            this.back.style.left = "0px";
            this.back.style.width = window.innerWidth+"px";
            this.back.style.height = window.innerHeight + "px";
            this.back.style.backgroundColor = "rgba(0,0,0,0.5)";
            document.body.appendChild(this.back);

            this.text = document.createElement("div");
            this.text.style.position = "absolute";
            this.text.style.left = (this.x - 300/2)+"px";
            this.text.style.top = (this.y + this.height/2) + "px";
            this.text.style.width = "300px";
            this.text.style.fontFamily = "PIXEL";
            this.text.style.fontSize = this.scaleText + "px";
            this.text.style.color = "white";
            this.text.textContent = "LOADING...";
            this.text.style.textAlign = "center";
            // this.text.style.border = "1px solid red";

            document.body.appendChild(this.text);
        }
        // this.sprite = document.createElement("div");
        // this.sprite.className = "loadingSprite";
        // // this.sprite.style.position = "absolute";
        // this.sprite.style.left = (this.x-this.width) +"px";
        // this.sprite.style.top = (this.y-this.height) + "px";
        // this.sprite.style.width = this.width +"px";
        // this.sprite.style.height = this.height + "px";
        // // this.sprite.style.zIndex = 10;
        // // this.sprite.style.background = "url('/game/images/player.png') no-repeat center center";

        // console.log(this.sprite);
        // document.body.appendChild(this.sprite);

        this.sprite.style.position = "absolute";
        this.sprite.style.left = (this.x-this.width/2) +"px";
        this.sprite.style.top = (this.y-this.height/2) + "px";
        // this.sprite.style.border = "1px solid red";
        this.sprite.style.zIndex = 10;
        document.body.appendChild(this.sprite);
    }

    tick(){
        if(this.angle >=350){
            this.angle = 0;
        }
        this.angle = lerp(this.angle, 360,0.15);
        rotateElement(this.sprite, this.angle);

        if(this.text){
            if(this.scaleText < this.scaleText_Min || this.scaleText > this.scaleText_Max){
                this.scaleStep = -this.scaleStep;
            }
            this.scaleText += this.scaleStep;
            this.text.style.fontSize = this.scaleText + "px";
            // this.text.style.left = (this.x - this.text.offsetWidth/2) + "px";
        }
    }

    remove(){
        if(this.back){
            this.back.remove();
            this.text.remove();
        }
        this.sprite.remove();
        clearInterval(this.interval);
    }
}