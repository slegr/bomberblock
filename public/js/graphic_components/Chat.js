class Chat{
    constructor(){
        this.panel_chat = null;
        this.btn_chat_toggle = null;
        this.panel_chat_msgctn = null;
        this.panel_chat_topctn = null;
        this.input_chat = null;

        this.createPanel();
        this.addListener();
        $(".panelChat-topctn").hide();
    }

    update(data){
        let msg = null;
        let id = null;
        let username = null;
        let color = null;

        if(!(data instanceof Array)){
            id = data.id;
            username = null;
            color = null;
            try {
                username = playersConnected[id].username;
                color = playersConnected[id].color;
            } catch (e) {
                username = myPlayer.username;
                color = myPlayer.color;
            }
            this.addNewLine(username, color, data.msg);
        }
        else{
            for (let i = 0; i < data.length; i++) {
                msg = data[i].msg;
                id = data[i].id;
                username = null;
                color = null;
                try{
                    username = playersConnected[id].username;
                    color = playersConnected[id].color;
                } catch( e){
                    username = myPlayer.username;
                    color = myPlayer.color;
                }
                
                this.addNewLine(username, color, msg);
            }   
        }
    }

    addNewLine(username, color, msg){
        let line = document.createElement("p");
        line.style.width = "100%";
        line.style.overflowWrap = "break-word";
        line.style.marginTop = "5px";
        line.style.padding = "0px";


        let span_name = document.createElement("span");
        span_name.textContent = username + " : ";
        span_name.style.color = color;
        // span_name.style.width = "100px";
        span_name.style.textOverflow = "ellipsis";
        span_name.style.overflow = "hidden";

        let span_msg = document.createElement("span");
        span_msg.textContent = msg;

        line.appendChild(span_name);
        line.appendChild(span_msg);

        this.panel_chat_msgctn.appendChild(line);

        this.panel_chat_msgctn.scrollTop = this.panel_chat_msgctn.scrollHeight - this.panel_chat_msgctn.clientHeight;
    }

    createPanel(){
        this.panel_chat = document.createElement("div");
        this.panel_chat.className = "panelChat";

        this.panel_chat_topctn = document.createElement("div");
        this.panel_chat_topctn.className = "panelChat-topctn";

        this.panel_chat_msgctn = document.createElement("div");
        this.panel_chat_msgctn.className = "panelChat-msgctn";

        this.input_chat = document.createElement("input");
        this.input_chat.className = "input-chat";
        this.input_chat.setAttribute("type", "text");
        this.input_chat.setAttribute("placeholder", "your message...");

        this.panel_chat_topctn.appendChild(this.panel_chat_msgctn);
        this.panel_chat_topctn.appendChild(this.input_chat);

        this.btn_chat_toggle = document.createElement("div");
        this.btn_chat_toggle.className = "panelChat-btn-toggle";
        this.btn_chat_toggle.textContent = "CHAT...";

        this.panel_chat.appendChild(this.panel_chat_topctn);
        this.panel_chat.appendChild(this.btn_chat_toggle);

        document.body.appendChild(this.panel_chat);
    }

    addListener(){
        if(this.btn_chat_toggle){
            this.btn_chat_toggle.onclick = (e) =>{
                this.toggleChat();
            }
        }

        if(this.input_chat){
            this.input_chat.onfocus = (e)=>{
                disableGameKeys();
            }
            this.input_chat.onblur = (e) => {
                enableGameKeys();
            }
            this.input_chat.onkeypress = (e) =>{
                if(e.which == 13){
                    // Add message to waiting messages
                    if (this.input_chat.value.length > 0){
                        this.sendMessage(this.input_chat.value);
                        this.input_chat.value = "";
                        this.input_chat.blur();
                    }
                    else{
                        this.toggleChat();
                    }
                }
            }
            document.onkeypress = (e) =>{
                if (this.input_chat !== document.activeElement && $(".panelChat-topctn").is(":visible")) {
                    this.input_chat.focus();
                }
            }
        }
    }

    toggleChat(){
        $(".panelChat-topctn").toggle(250);
    }

    sendMessage(msg){
        let data = {
            time : Date.now(),
            msg : msg,
            id : myPlayer.id
        };
        client.newMessage(data);
    }

    remove(){
        this.panel_chat.remove();
    }
}