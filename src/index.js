/**
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
 * https://www.jianshu.com/p/7c4f58ee8972
 *  */


 import SirWave from "./sirWave";

export default class auduoMap {
    constructor(params){

        Object.assign(this, params)
        
        this.initlize(this.url);

        this.SW = new SirWave({
            ...params       
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
        let audio = this.audio = new Audio(url);
        audio.crossOrigin = "anonymous";

        this.audio.onended = ()=>{
            this.SW.pause();

            this.onended && this.onended();
        }

    }

    resize(width, height){
        let phase= this.SW.phase
        this.SW.width = width;
        this.SW.height = height;

        this.SW.canvas.setAttribute('width', width*2);
        this.SW.canvas.setAttribute('height', height*2);

        this.SW.canvas.style.width = (width)+"px";
        this.SW.canvas.style.height = (height)+"px";
        this.SW._clear();
        if(!this.SW.run){
            this.SW.drawOnePage();
        }
        this.SW.phase = phase;
    }
}