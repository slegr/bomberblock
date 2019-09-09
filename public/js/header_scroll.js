let header_logo = null;
let headerJob  = null;
let header_img_logo = null;
let nav = null;
let header_text = null; 

window.onload = (e) =>{
    header_logo = document.getElementById('header-top');
    headerJob = document.getElementById('header-job');
    header_img_logo = document.getElementById('header-logo');
    nav = document.getElementById('navLinks');
    header_text = document.getElementById('header-text');
}

function resizeHeaderOnScroll() {
    const distanceY = window.pageYOffset || document.documentElement.scrollTop,
        shrinkOn = 100;
    if (headerJob){
        if (distanceY > shrinkOn) {
            headerJob.style.display = "None";
            header_logo.style.float = "left";
            header_logo.style.margin = "0px 0px 0px 0px";
            header_img_logo.style.height = 50+"px";
            nav.style.margin = "0px 0px 0px 0px";
            $(".green-border").css({"border":"none", "text-align":"left"});
        } else {
            headerJob.style.display = "inline-block";
            header_logo.style.float = "none";
            header_img_logo.style.height = 80 + "px";
            header_logo.style.margin = "20px 0px 0px 0px";
            nav.style.margin = "20px 0px 0px 0px";
            $(".green-border").css({"border":"3px solid rgb(25, 83, 54)", "text-align":"center"});
        }
    }
}

window.addEventListener('scroll', resizeHeaderOnScroll);