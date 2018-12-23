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

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var SirWave =
  /*#__PURE__*/
  function () {
    function SirWave(opt) {
      _classCallCheck(this, SirWave);

      this.opt = opt || {};
      this.dpr = window.devicePixelRatio || 1;
      this.K = 2;
      this.F = 2;
      this.speed = this.opt.speed || 0.1;
      this.noise = this.opt.noise || 0;
      this.phase = this.opt.phase || 0;
      this.lines = this.opt.lines || [[-2, 'rgba(74, 74, 74, 0.2)', 1], [-6, 'rgba(74, 74, 74, 0.4)', 1], [4, 'rgba(74, 74, 74, 0.5)', 1], [2, 'rgba(74, 74, 74, 0.6)', 1], [1, 'rgba(74, 74, 74, 0.5)', 2]];
      this.width = this.dpr * (this.opt.width || 320);
      this.height = this.dpr * (this.opt.height || 100);
      this.MAX = this.height / 2 - 4;

      if (this.opt.ctx) {
        this.ctx = this.opt.ctx;
      } else {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = this.width / this.dpr + 'px';
        this.canvas.style.height = this.height / this.dpr + 'px';
        (this.opt.container || document.body).appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
      }

      this.run = false;
    }

    _createClass(SirWave, [{
      key: "_globalAttenuationFn",
      value: function _globalAttenuationFn(x) {
        return Math.pow(this.K * 4 / (this.K * 4 + Math.pow(x, 4)), this.K * 2);
      }
    }, {
      key: "_drawLine",
      value: function _drawLine(attenuation, color, width) {
        this.ctx.moveTo(0, 0);
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width || 1;
        var x, y;

        for (var i = -this.K; i <= this.K; i += 0.01) {
          x = this.width * ((i + this.K) / (this.K * 2));
          y = this.height / 2 + this.noise * this._globalAttenuationFn(i) * (1 / attenuation) * Math.sin(this.F * i - this.phase);
          this.ctx.lineTo(x, y);
        }

        this.ctx.stroke();
      }
    }, {
      key: "drawOnePage",
      value: function drawOnePage() {
        var _this = this;

        var runing = this.run;
        this.run = true;
        this.phase = this.phase == 0 ? Math.random() * 10 : this.phase;

        this._draw();

        requestAnimationFrame(function () {
          _this.run = runing;
        });
      }
    }, {
      key: "_clear",
      value: function _clear() {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = 'source-over';
      }
    }, {
      key: "_draw",
      value: function _draw() {
        var _this2 = this;

        if (!this.run) return;
        this.phase = (this.phase + this.speed) % (Math.PI * 64);

        this._clear();

        this.lines.forEach(function (line) {
          _this2._drawLine.apply(_this2, line);
        });
        requestAnimationFrame(this._draw.bind(this), 1000);
      }
    }, {
      key: "start",
      value: function start() {
        this.run = true;

        this._draw();
      }
    }, {
      key: "stop",
      value: function stop() {
        this.run = false;

        this._clear();
      }
    }, {
      key: "pause",
      value: function pause() {
        this.run = false;
      }
    }, {
      key: "setNoise",
      value: function setNoise(v) {
        this.noise = Math.min(v, 1) * this.MAX;
      }
    }, {
      key: "setSpeed",
      value: function setSpeed(v) {
        this.speed = v;
      }
    }, {
      key: "set",
      value: function set(noise, speed) {
        this.setNoise(noise);
        this.setSpeed(speed);
      }
    }]);

    return SirWave;
  }();

  var auduoMap =
  /*#__PURE__*/
  function () {
    function auduoMap(params) {
      _classCallCheck(this, auduoMap);

      Object.assign(this, params);
      this.initlize(this.url);
      this.SW = new SirWave(_objectSpread({}, params));
      this.SW.setSpeed(0.2);
      this.SW.setNoise(0.2);
      this.SW.drawOnePage();
    }

    _createClass(auduoMap, [{
      key: "play",
      value: function play() {
        if (this.audio.paused) {
          this.audio.play();
          this.SW.start();
        } else {
          this.audio.pause();
          this.SW.pause();
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.audio.pause();
        this.SW.pause();
      } // 初始化场景

    }, {
      key: "initlize",
      value: function initlize(url) {
        var _this = this;

        var audio = this.audio = new Audio(url); //audio.crossOrigin = "anonymous";

        this.audio.onended = function () {
          _this.SW.pause();

          _this.onended && _this.onended();
        };
      }
    }, {
      key: "resize",
      value: function resize(width, height) {
        var phase = this.SW.phase;
        this.SW.width = width * 2;
        this.SW.height = height * 2;
        this.SW.canvas.setAttribute('width', width * 2);
        this.SW.canvas.setAttribute('height', height * 2);
        this.SW.canvas.style.width = width + "px";
        this.SW.canvas.style.height = height + "px";

        this.SW._clear();

        if (!this.SW.run) {
          this.SW.drawOnePage();
        }

        this.SW.phase = phase;
      }
    }]);

    return auduoMap;
  }();

  return auduoMap;

})));
//# sourceMappingURL=bundle.js.map
