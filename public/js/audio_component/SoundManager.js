class SoundManager{
    constructor(){
        this.audio_music = {};
        this.currentMusic = null;
        this.currentMusicIndex = -1;
        
        this.music_property = {
            mute : false,
            volume : 1.0
        };

        this.audio_effect = {};
    }
    
    init(){

        // this.audio_music['Questing'] = game.add.audio('Questing');
        this.audio_music['desert'] = game.add.audio('desert');
        this.audio_music['western_37s'] = game.add.audio('western_37s');
        this.audio_music['western_15'] = game.add.audio('western_15');
        this.audio_music['rpg'] = game.add.audio('rpg');
        this.audio_music['ABetterWorld'] = game.add.audio('ABetterWorld');
        // this.audio_music['thrust'] = game.add.audio('thrust');
        this.audio_music['DNB5'] = game.add.audio('DNB5');
        this.audio_music['DNB4'] = game.add.audio('DNB4');
        // this.audio_music['FoxieEpic'] = game.add.audio('FoxieEpic');
        // this.audio_music['DarkWinds'] = game.add.audio('DarkWinds');
        // this.audio_music['DarkAmbiant'] = game.add.audio('DarkAmbiant');

        this.audio_effect['gunshot'] = game.add.audio('gunshot');

        this.addListeners();
    }

    addListeners(){
        window.addEventListener('sm_connectionmenu', (e) => {
            this.nextMusic();

        });
        window.addEventListener('sm_mainmenu', (e)=>{
            // this.nextMusic();

        });

        window.addEventListener('sm_lobby', (e) => {
            // this.nextMusic();
        });

        window.addEventListener('sm_game', (e) => {
            this.nextMusic();
        });

        window.addEventListener('sm_music_mute', (e) => {
            this.mute();
        });

        window.addEventListener('sm_music_volume', (e) => {
            this.changeVolume(e.detail);
        });

        window.addEventListener('sm_gunshot', (e) => {
            this.gunshot();
        });
    }

    nextMusic(sound=null){
        let musicKeys = Object.keys(this.audio_music);
        this.musicFadeOut(()=>{
            this.currentMusicIndex++;
            if (this.currentMusicIndex >= this.audio_music.length) {
                this.currentMusicIndex = 0;
            }
            if (musicKeys[this.currentMusicIndex]) {
                this.currentMusic = this.audio_music[musicKeys[this.currentMusicIndex]];
                this.currentMusic.onStop.add(this.nextMusic, this);
                this.currentMusic.onPlay.add(this.checkProprety, this);
                this.currentMusic.play();
                console.log("new music playing");
                console.log(this.currentMusic);
            }
        });
    }

    checkProprety(sound) {
        sound.volume = this.music_property.volume;
        if (this.music_property.mute) {
            sound.mute = this.music_property.mute;
        }
    }

    musicFadeOut(callback){
        if (this.currentMusic) {
            let interval = setInterval(()=>{
                if(this.currentMusic.volume > 0){
                    this.currentMusic.volume -= 0.1;
                }
                else{
                    this.currentMusic.pause();
                    this.currentMusic = null;
                    clearInterval(interval);
                    callback();
                }
            },120);
        }
        else{
            callback();
        }
    }

    mute(){
        this.music_property.mute = !this.music_property.mute;
        this.checkProprety(this.currentMusic);
    }

    changeVolume(value) {
        this.music_property.volume = value;
        this.checkProprety(this.currentMusic);
    }

    gunshot(){
        this.audio_effect['gunshot'].play();
    }
}