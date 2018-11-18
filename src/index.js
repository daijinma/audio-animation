/**
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
 * https://www.jianshu.com/p/7c4f58ee8972
 *  */


 import SirWave from "./sirWave";

export default class auduoMap {
    constructor(params){
        if(!params.el){
            throw Error("el is required!")
        }

        Object.assign(this, params)
        
        this.initlize(this.url);

        this.SW = new SirWave({
            ctx: this.ctx,
            width: this.width,
            height: this.height,
            lines:this.lines           
        })
        this.SW.setSpeed(0.2);
        
        this.SW.setNoise(0.2);
        this.SW.drawOnePage();
    }

    play(){
        if(this.audio.paused){
            this.audio.play();
            this.SW.start();
        }else{
            this.audio.pause();
            this.SW.pause();
        }
    }
    destroy(){
        this.audio.pause();
        this.SW.pause()
    }

    // 初始化场景
    initlize(url){
        let canvas = this.el;
        this.ctx = this.ctx = canvas.getContext("2d");

        let audio = this.audio = new Audio(url);
        audio.crossOrigin = "anonymous";

        this.audio.onended = ()=>{
            this.SW.pause();
        }

    }

    resize(){
        this.SW.width = 200;
        this.SW.height = 100;
        this.width = 200;
        this.height = 100;
        this.SW.phase = 0;
        this.SW._clear();
        this.SW.drawOnePage();
    }
}