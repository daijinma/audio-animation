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

  var SirWave =
  /*#__PURE__*/
  function () {
    function SirWave(opt) {
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
      this.lines = this.opt.lines || [[-2, 'rgba(74, 74, 74, 0.2)', 1], [-6, 'rgba(74, 74, 74, 0.4)', 1], [4, 'rgba(74, 74, 74, 0.5)', 1], [2, 'rgba(74, 74, 74, 0.6)', 1], [1, 'rgba(74, 74, 74, 0.5)', 2]];
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
    }

    _createClass(SirWave, [{
      key: "drawOnePage",
      value: function drawOnePage() {
        var _this2 = this;

        var runing = this.run;
        this.run = true;
        this.phase = this.phase == 0 ? Math.random() * 10 : this.phase;

        this._draw();

        requestAnimationFrame(function () {
          _this2.run = runing;
        });
      }
    }]);

    return SirWave;
  }();

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

        var canvas = this.el;
        this.ctx = this.ctx = canvas.getContext("2d");
        var audio = this.audio = new Audio(url);
        audio.crossOrigin = "anonymous";

        this.audio.onended = function () {
          _this.SW.pause();
        };
      }
    }, {
      key: "resize",
      value: function resize() {
        this.SW.width = 200;
        this.SW.height = 100;
        this.width = 200;
        this.height = 100;
        this.SW.phase = 0;

        this.SW._clear();

        this.SW.drawOnePage();
      }
    }]);

    return auduoMap;
  }();

  return auduoMap;

})));
//# sourceMappingURL=bundle.js.map
