(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.AudioMap = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var SirWave = function SirWave(opt) {
    var _this = this;

    _classCallCheck(this, SirWave);

    _defineProperty(this, "_globalAttenuationFn", function (x) {
      return Math.pow(_this.K * 4 / (_this.K * 4 + Math.pow(x, 4)), _this.K * 2);
    });

    _defineProperty(this, "_drawLine", function (attenuation, color, width) {
      _this.ctx.moveTo(0, 0);

      _this.ctx.beginPath();

      _this.ctx.strokeStyle = color;
      _this.ctx.lineWidth = width || 1;
      var x, y;

      for (var i = -_this.K; i <= _this.K; i += 0.01) {
        x = _this.width * ((i + _this.K) / (_this.K * 2));
        y = _this.height / 2 + _this.noise * _this._globalAttenuationFn(i) * (1 / attenuation) * Math.sin(_this.F * i - _this.phase);

        _this.ctx.lineTo(x, y);
      }

      _this.ctx.stroke();
    });

    _defineProperty(this, "_clear", function () {
      _this.ctx.globalCompositeOperation = 'destination-out';

      _this.ctx.fillRect(0, 0, _this.width, _this.height);

      _this.ctx.globalCompositeOperation = 'source-over';
    });

    _defineProperty(this, "_draw", function () {
      if (!_this.run) return;
      _this.phase = (_this.phase + _this.speed) % (Math.PI * 64);

      _this._clear();

      _this.lines.forEach(function (line) {
        _this._drawLine.apply(_this, line);
      });

      requestAnimationFrame(_this._draw.bind(_this), 1000);
    });

    _defineProperty(this, "start", function () {
      _this.phase = 0;
      _this.run = true;

      _this._draw();
    });

    _defineProperty(this, "stop", function () {
      _this.run = false;

      _this._clear();
    });

    _defineProperty(this, "pause", function () {
      _this.run = false;
    });

    _defineProperty(this, "setNoise", function (v) {
      _this.noise = Math.min(v, 1) * _this.MAX;
    });

    _defineProperty(this, "setSpeed", function (v) {
      _this.speed = v;
    });

    _defineProperty(this, "set", function (noise, speed) {
      _this.setNoise(noise);

      _this.setSpeed(speed);
    });

    this.opt = opt || {};
    this.K = 2;
    this.F = 2;
    this.speed = this.opt.speed || 0.1;
    this.noise = this.opt.noise || 0;
    this.phase = this.opt.phase || 0;
    this.lines = this.opt.lines || [[-2, 'rgba(255,255,255, 0.1)'], [-6, 'rgba(255,255,255,0.2)'], [4, 'rgba(255,255,255,0.4)'], [2, 'rgba(255,255,255,0.6)'], [1, 'rgba(255,255,255,1)', 1.5]];
    if (!devicePixelRatio) devicePixelRatio = 1;
    this.width = devicePixelRatio * (this.opt.width || 320);
    this.height = devicePixelRatio * (this.opt.height || 100);
    this.MAX = this.height / 2 - 4;

    if (this.opt.ctx) {
      this.ctx = this.opt.ctx;
    } else {
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas.style.width = this.width / devicePixelRatio + 'px';
      this.canvas.style.height = this.height / devicePixelRatio + 'px';
      (this.opt.container || document.body).appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
    }

    this.run = false;
  };

  var auduoMap =
  /*#__PURE__*/
  function () {
    function auduoMap(params) {
      _classCallCheck(this, auduoMap);

      if (!params.el) {
        throw Error("el is required!");
      }

      Object.assign(this, params);
      this.initlize(this.url);
      this.SW = new SirWave({
        ctx: this.ctx,
        width: this.width,
        height: this.height,
        lines: this.lines
      });
      this.SW.setSpeed(0.2);
      this.SW.start();
      this.SW.setNoise(0.2);
    }

    _createClass(auduoMap, [{
      key: "play",
      value: function play() {
        if (this.audio.paused) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.audio.pause();
      } // 初始化场景

    }, {
      key: "initlize",
      value: function initlize(url) {
        var canvas = this.el;
        this.ctx = this.ctx = canvas.getContext("2d");
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var audio = this.audio = new Audio(url);
        audio.crossOrigin = "anonymous";
        this.source = audioCtx.createMediaElementSource(audio);
        this.analyser = audioCtx.createAnalyser(); //连接：source → analyser → destination

        this.source.connect(this.analyser);
        this.analyser.connect(audioCtx.destination);
        this.bufferLength = 360;
      }
    }, {
      key: "playFun",
      value: function playFun() {}
    }, {
      key: "drawColumn",
      value: function drawColumn(ctx, output) {
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.lineWidth = 2;
        ctx.beginPath();
        var bufferLength = this.bufferLength;
        var barWidth = this.width / bufferLength * 2.5;
        var barHeight;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {
          barHeight = output[i] / 2;
          ctx.fillStyle = '#000';
          ctx.fillRect(x, this.height - barHeight / 2, barWidth, barHeight);
          x += barWidth + 1;
        }
      }
    }, {
      key: "drawCircle",
      value: function drawCircle(ctx, output) {
        var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
        ctx.clearRect(0, 0, this.width, this.height); //画线条

        var centerX = this.width / 2;
        var centerY = this.height / 2;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(centerX, centerY);

        for (var i = 0; i < 360; i++) {
          var value = output[i]; //<===获取数据
          //R * cos (PI/180*一次旋转的角度数) ,-R * sin (PI/180*一次旋转的角度数)

          ctx.lineTo(Math.cos(i * 1 / 180 * Math.PI) * (r + value) + centerX, -Math.sin(i * 1 / 180 * Math.PI) * (r + value) + centerY);
        }

        ctx.stroke(); //画一个小圆，将线条覆盖
        // ctx.beginPath();
        // ctx.lineWidth = 1;
        // ctx.arc(centerX, centerY, r, 0, 2 * Math.PI, false);
        // ctx.fillStyle = "#fff";
        // ctx.stroke();
        // ctx.fill();
      }
    }]);

    return auduoMap;
  }();

  return auduoMap;

})));
//# sourceMappingURL=bundle.js.map
