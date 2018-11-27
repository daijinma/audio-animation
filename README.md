# audio-animation
audio 声波图谱


## install
```
npm install github:daijinma/audio-animation

import AudioAnimation from “audio-animation”
```

## use
```
  am = new AudioAnimation({
                // container   和 ctx  选写一个  优先  ctx
                // 插入自动生成 canvas 的 容器
                container: document.body,
                // 或者 
                ctx:document.querySelector("#canvas").getContext("2d") 
                
                // 画布宽高
                width: w,
                height: h,
                
                url: "./SuperMario.mp3",
                
                // 动画旋律线条 配置
                lines: [
                    [-2, 'rgba(74, 74, 74, 0.2)', 1],
                    [-6, 'rgba(74, 74, 74, 0.4)', 1],
                    [4, 'rgba(74, 74, 74, 0.5)', 1],
                    [2, 'rgba(74, 74, 74, 0.6)', 1],
                    [1, 'rgba(74, 74, 74, 0.5)', 2],
                ] 
            });
   
   // 切换 暂停 && 播放
   am.play()
   
   // H5 或者 pc  resize 之后 需要调用 resize方法 
   am.resize(width:Number, height:Number)
   am.play()
```

