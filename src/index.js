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
        this.SW.start();
        this.SW.setNoise(0.2);
    }

    play(){
        if(this.audio.paused){
            this.audio.play();
        }else{
            this.audio.pause();
        }
        
    }
    destroy(){
        this.audio.pause();
    }

    // 初始化场景
    initlize(url){
        let canvas = this.el;
        this.ctx = this.ctx = canvas.getContext("2d");

        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let audio = this.audio = new Audio(url);
        audio.crossOrigin = "anonymous";

        this.source = audioCtx.createMediaElementSource(audio);
        this.analyser = audioCtx.createAnalyser();

        //连接：source → analyser → destination
        this.source.connect(this.analyser);
        this.analyser.connect(audioCtx.destination);
        this.bufferLength = 360;

    }

    playFun(){
        
    }

    drawColumn(ctx, output){
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.lineWidth = 2;
        ctx.beginPath();

        let bufferLength = this.bufferLength;
        var barWidth = (this.width / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {
            barHeight = output[i]/2;
    
            ctx.fillStyle = '#000';
            ctx.fillRect(x,this.height-barHeight/2,barWidth,barHeight);

            x += barWidth + 1;
        }

    }

    drawCircle(ctx, output , r=100){
        ctx.clearRect(0, 0, this.width, this.height);
        //画线条
        let centerX = this.width/2;
        let centerY = this.height/2;

        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.moveTo(centerX, centerY);

        for (var i = 0; i <360 ; i++) {
            var value = output[i];//<===获取数据
            //R * cos (PI/180*一次旋转的角度数) ,-R * sin (PI/180*一次旋转的角度数)
            ctx.lineTo(Math.cos((i * 1) / 180 * Math.PI) * (r + value) + centerX, (- Math.sin((i * 1) / 180 * Math.PI) * (r + value) + centerY));
            
        }
        ctx.stroke();

        //画一个小圆，将线条覆盖
        // ctx.beginPath();
        // ctx.lineWidth = 1;
        // ctx.arc(centerX, centerY, r, 0, 2 * Math.PI, false);
        // ctx.fillStyle = "#fff";
        // ctx.stroke();
        // ctx.fill();
    }
}