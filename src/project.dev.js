window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  1: [ function(require, module, exports) {
    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || void 0;
    }
    module.exports = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.emit = function(type) {
      var er, handler, len, args, i, listeners;
      this._events || (this._events = {});
      if ("error" === type && (!this._events.error || isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) throw er;
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
        err.context = er;
        throw err;
      }
      handler = this._events[type];
      if (isUndefined(handler)) return false;
      if (isFunction(handler)) switch (arguments.length) {
       case 1:
        handler.call(this);
        break;

       case 2:
        handler.call(this, arguments[1]);
        break;

       case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

       default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }
      return true;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      var m;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      this._events || (this._events = {});
      this._events.newListener && this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
      this._events[type] ? isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener;
      if (isObject(this._events[type]) && !this._events[type].warned) {
        m = isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners;
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          "function" === typeof console.trace && console.trace();
        }
      }
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function(type, listener) {
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      var fired = false;
      function g() {
        this.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }
      g.listener = listener;
      this.on(type, g);
      return this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var list, position, length, i;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      if (!this._events || !this._events[type]) return this;
      list = this._events[type];
      length = list.length;
      position = -1;
      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        this._events.removeListener && this.emit("removeListener", type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0; ) if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
        if (position < 0) return this;
        if (1 === list.length) {
          list.length = 0;
          delete this._events[type];
        } else list.splice(position, 1);
        this._events.removeListener && this.emit("removeListener", type, listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      var key, listeners;
      if (!this._events) return this;
      if (!this._events.removeListener) {
        0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type];
        return this;
      }
      if (0 === arguments.length) {
        for (key in this._events) {
          if ("removeListener" === key) continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this;
      }
      listeners = this._events[type];
      if (isFunction(listeners)) this.removeListener(type, listeners); else if (listeners) while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      delete this._events[type];
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var ret;
      ret = this._events && this._events[type] ? isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
      return ret;
    };
    EventEmitter.prototype.listenerCount = function(type) {
      if (this._events) {
        var evlistener = this._events[type];
        if (isFunction(evlistener)) return 1;
        if (evlistener) return evlistener.length;
      }
      return 0;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      return emitter.listenerCount(type);
    };
    function isFunction(arg) {
      return "function" === typeof arg;
    }
    function isNumber(arg) {
      return "number" === typeof arg;
    }
    function isObject(arg) {
      return "object" === typeof arg && null !== arg;
    }
    function isUndefined(arg) {
      return void 0 === arg;
    }
  }, {} ],
  bullet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5a59baA5N1AGqU47ijZGEEn", "bullet");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        direction: 1
      },
      onLoad: function onLoad() {
        this.node.x = this.node.x + 50;
        this.node.y = this.node.y + 50;
        var action = cc.moveBy(.1, cc.v2(1e3 * this.direction, 0)).repeatForever();
        this.node.runAction(action);
      },
      start: function start() {},
      onCollisionEnter: function onCollisionEnter(ortherCol, selfCol) {
        "monter<BoxCollider>" == ortherCol.name && this.node.destroy();
        if ("fire<BoxCollider>" == ortherCol.name) {
          ortherCol.node.destroy();
          this.node.destroy();
        }
      },
      update: function update(dt) {}
    });
    cc._RF.pop();
  }, {} ],
  controller: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f8395FhuStL/ryQBz/kItVV", "controller");
    "use strict";
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        Emitter.instance.registerEvent("gameOver", this.gameOver.bind(this));
      },
      gameOver: function gameOver() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
      },
      onKeyDown: function onKeyDown(evt) {
        switch (evt.keyCode) {
         case cc.macro.KEY.left:
          Emitter.instance.emit("move", "left");
          break;

         case cc.macro.KEY.right:
          Emitter.instance.emit("move", "right");
          break;

         case cc.macro.KEY.up:
          Emitter.instance.emit("jump");
          break;

         case cc.macro.KEY.space:
          Emitter.instance.emit("shoot");
        }
      },
      onKeyUp: function onKeyUp(evt) {
        switch (evt.keyCode) {
         case cc.macro.KEY.left:
         case cc.macro.KEY.right:
          Emitter.instance.emit("dontMove");
          break;

         case cc.macro.KEY.up:
          Emitter.instance.emit("dontJump");
          break;

         case cc.macro.KEY.space:
          Emitter.instance.emit("dontShoot");
        }
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ],
  mEmitter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a3e16T3PzdI8q/fUwkryca4", "mEmitter");
    "use strict";
    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          "value" in descriptor && (descriptor.writable = true);
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        protoProps && defineProperties(Constructor.prototype, protoProps);
        staticProps && defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var EventEmitter = require("events");
    var mEmitter = function() {
      function mEmitter() {
        _classCallCheck(this, mEmitter);
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
      }
      _createClass(mEmitter, [ {
        key: "emit",
        value: function emit() {
          var _emiter;
          (_emiter = this._emiter).emit.apply(_emiter, arguments);
        }
      }, {
        key: "registerEvent",
        value: function registerEvent(event, listener) {
          this._emiter.on(event, listener);
        }
      }, {
        key: "registerOnce",
        value: function registerOnce(event, listener) {
          this._emiter.once(event, listener);
        }
      }, {
        key: "removeEvent",
        value: function removeEvent(event, listener) {
          this._emiter.removeListener(event, listener);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this._emiter.removeAllListeners();
          this._emiter = null;
          mEmitter.instance = null;
        }
      } ]);
      return mEmitter;
    }();
    mEmitter.instance = null == mEmitter.instance ? new mEmitter() : mEmitter.instance;
    module.exports = mEmitter;
    cc._RF.pop();
  }, {
    events: 1
  } ],
  monter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b0384/oqD1EepA1sWjgRkZ3", "monter");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        hpMonterProgress: cc.Component,
        _actionCollider: null,
        _isDead: false,
        bulletFire: cc.Prefab,
        spineBoy: cc.Component,
        breakSound: {
          default: null,
          type: cc.AudioClip
        },
        _intervalCreateFire: null,
        marginRight: cc.Component
      },
      playSoundBreak: function playSoundBreak() {
        cc.audioEngine.playEffect(this.breakSound, false);
      },
      onLoad: function onLoad() {
        var _this = this;
        this._isDead = false;
        this._intervalCreateFire = setInterval(function() {
          _this.shootFire();
        }, 2e3);
      },
      shootFire: function shootFire() {
        var item = cc.instantiate(this.bulletFire);
        item.parent = this.node.parent;
        item.x = this.node.x - 80;
        item.y = this.node.y + 70;
        var action = cc.moveTo(2, this.spineBoy.node.x, this.spineBoy.node.y);
        item.runAction(action);
        cc.log(this.spineBoy);
      },
      start: function start() {},
      onCollisionEnter: function onCollisionEnter(ortherCol, selfCol) {
        if ("bullet<BoxCollider>" == ortherCol.name) {
          this.hpMonterProgress.getComponent(cc.ProgressBar).progress -= .1;
          this.bingo();
          var actionSound = cc.callFunc(this.playSoundBreak, this);
          this.node.runAction(actionSound);
        }
        if (this.hpMonterProgress.getComponent(cc.ProgressBar).progress <= 0 && false == this._isDead) {
          this.node.opacity = 255;
          this.node.angle = -90;
          this._isDead = true;
          clearInterval(this._intervalCreateFire);
          this.marginRight.node.active = true;
          this.node.destroy();
        }
      },
      onCollisionStay: function onCollisionStay() {
        this.bingo();
      },
      onCollisionExit: function onCollisionExit() {
        this.node.opacity = 255;
      },
      bingo: function bingo() {
        var action1 = cc.blink(1, 50);
        var action2 = cc.tintTo(.5, 255, 0, 0);
        this._actionCollider = cc.sequence(cc.spawn(action1, action2), cc.tintTo(2, 255, 255, 255));
        this.node.runAction(this._actionCollider);
      }
    });
    cc._RF.pop();
  }, {} ],
  spinboy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "11addvrHQ9MiI6EKFBJYy0U", "spinboy");
    "use strict";
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        _action: null,
        _handleMove: null,
        _handleDontMove: null,
        _handleJump: null,
        _handleDontJump: null,
        _handleShoot: null,
        spinboy: sp.Skeleton,
        hpProgressBar: cc.Component,
        prefabBullet: cc.Prefab,
        score: cc.Component,
        winTheeGame: cc.Component,
        loseTheeGame: cc.Component,
        reloadGame: cc.Component,
        animWin: cc.Component,
        deathSound: {
          default: null,
          type: cc.AudioClip
        },
        shotSound: {
          default: null,
          type: cc.AudioClip
        },
        winSound: {
          default: null,
          type: cc.AudioClip
        },
        _isMove: true,
        _isJump: true,
        _scaleX: 0,
        _worldX: 0,
        _worldY: 0,
        _actionCollider: null,
        _isDead: false,
        _isWin: false,
        _score: 0
      },
      onLoad: function onLoad() {
        var _this = this;
        this._isMove = true;
        this._isJump = true;
        this._isWin = false;
        this._score = 99;
        var fl = cc.follow(this.hpProgressBar.node, cc.rect(0, 0, 300, 15));
        this.node.runAction(fl);
        this._scaleX = this.node.scaleX;
        this.registerEmitter();
        this.spinboy.setAnimation(0, "portal", false);
        this.spinboy.setMix("run", "idle", .3);
        this.spinboy.setMix("portal", "run", .3);
        this.spinboy.setMix("run", "jump", .1);
        this.spinboy.setMix("jump", "idle", .1);
        this.spinboy.setMix("idle", "jump", .1);
        this.spinboy.setMix("jump", "run", .1);
        this.spinboy.setMix("jump", "shoot", .1);
        this.spinboy.setMix("jump", "death", .1);
        this.spinboy.setMix("run", "death", .1);
        this.spinboy.setMix("jump", "hoverboard", .3);
        this.spinboy.setMix("run", "hoverboard", .3);
        this.spinboy.setCompleteListener(function(vl) {
          if (vl.animationEnd >= 3.59) {
            _this._isJump = false;
            _this._isMove = false;
            var actions = [ cc.callFunc(function() {
              if (1 == _this._score) {
                cc.log(_this._isJump, _this._isMove);
                _this.loseGame();
              }
              if (_this._isDead) return;
              if (_this._isWin) return;
              _this._score -= 1;
            }), cc.delayTime(.5), cc.callFunc(function() {
              var unit = _this._score % 10;
              _this.score.string = "<color=#00ff00>" + (_this._score - _this._score % 10) / 10 + "</c><color=#0fffff>" + unit + "</color>";
            }) ];
            _this.node.runAction(cc.repeat(cc.sequence(actions), 99));
            var manager = cc.director.getCollisionManager();
            manager.enabled = true;
          }
        });
      },
      playSoundDeath: function playSoundDeath() {
        cc.audioEngine.playEffect(this.deathSound, false);
      },
      playSoundShot: function playSoundShot() {
        cc.audioEngine.playEffect(this.shotSound, false);
      },
      playSoundWin: function playSoundWin() {
        cc.audioEngine.playEffect(this.winSound, false);
      },
      registerEmitter: function registerEmitter() {
        this._handleMove = this.handleMove.bind(this);
        Emitter.instance.registerEvent("move", this._handleMove);
        this._handleDontMove = this.handleDontMove.bind(this);
        Emitter.instance.registerEvent("dontMove", this._handleDontMove);
        this._handleJump = this.handleJump.bind(this);
        Emitter.instance.registerEvent("jump", this._handleJump);
        this._handleDontJump = this.handleDontJump.bind(this);
        Emitter.instance.registerEvent("dontJump", this._handleDontJump);
        this._handleShoot = this.handleShoot.bind(this);
        Emitter.instance.registerEvent("shoot", this._handleShoot);
      },
      handleShoot: function handleShoot() {
        if (this._isWin) return;
        this.spinboy.setAnimation(1, "shoot", false);
        var item = cc.instantiate(this.prefabBullet);
        item.parent = this.node;
        var direction = 1;
        this.node.scaleX < 0 && (direction = -1);
        item.getComponent("bullet").direction = direction;
        item.y = this.node.y / 2 + this._worldY - 100;
        item.x = this.node.x + this._worldX + 200;
        var actionSound = cc.callFunc(this.playSoundShot, this);
        this.node.runAction(actionSound);
      },
      handleDontJump: function handleDontJump() {
        var _this2 = this;
        this.spinboy.setEventListener(function(vl1) {
          if (vl1.animationEnd >= 1.3) {
            _this2._isJump = false;
            if (true == _this2._isMove) _this2.spinboy.setAnimation(0, "run", true); else {
              _this2.spinboy.setToSetupPose();
              _this2.spinboy.setAnimation(0, "idle", false);
              _this2.node.stopAction(_this2._action);
              _this2.node.stopAction(_this2._actionCollider);
            }
          }
        });
      },
      handleJump: function handleJump() {
        if (true == this._isJump) return;
        this._isJump = true;
        this.spinboy.setAnimation(0, "jump", true);
      },
      handleDontMove: function handleDontMove() {
        var _this3 = this;
        if (true == this._isJump) {
          this._isMove = false;
          this.spinboy.setEventListener(function(vl1) {
            _this3._isJump = false;
            if (vl1.animationEnd >= 1) {
              _this3.spinboy.setToSetupPose();
              _this3.spinboy.setAnimation(0, "idle", false);
              _this3.node.stopAction(_this3._action);
              _this3.node.stopAction(_this3._actionCollider);
            }
          });
        } else {
          this.spinboy.setToSetupPose();
          this.spinboy.setAnimation(0, "idle", false);
          this._isMove = false;
          this._isJump = false;
          this.node.stopAction(this._action);
          this.node.stopAction(this._actionCollider);
        }
      },
      handleDead: function handleDead() {
        var _this4 = this;
        this._isMove = true;
        this._isJump = true;
        this.spinboy.setCompleteListener(function(vl) {
          if (vl.animationEnd <= 1.7) {
            _this4.node.opacity = 255;
            _this4.node.stopAllActions();
            _this4.spinboy.clearTracks();
            _this4.spinboy.setToSetupPose();
            _this4.spinboy.setAnimation(0, "death", false);
          }
        });
      },
      spinBoyTurn: function spinBoyTurn(act) {
        cc.log(act);
        var direction = 1;
        if ("right" == act) this.node.scaleX = this._scaleX; else {
          this.node.scaleX = -this._scaleX;
          direction = -1;
        }
        return direction;
      },
      handleMove: function handleMove(act) {
        if (this._isJump) return;
        if (true == this._isMove) return;
        this._isMove = true;
        this.spinboy.setAnimation(0, "run", true);
        var turn = this.spinBoyTurn(act);
        this._action = cc.moveBy(.8, cc.v2(300 * turn, 0)).repeatForever();
        this.node.runAction(this._action);
      },
      start: function start() {},
      update: function update(dt) {
        this._worldX = this.spinboy.findBone("torso3").worldX;
        this._worldY = this.spinboy.findBone("torso3").worldY;
        this.node.getComponent(cc.BoxCollider).offset = cc.v2(this._worldX, this._worldY);
      },
      onCollisionEnter: function onCollisionEnter(orther, self) {
        if ("fire<BoxCollider>" == orther.name) {
          var hp = this.hpProgressBar.getComponent(cc.ProgressBar);
          hp.progress -= .01;
          orther.node.destroy();
        }
        if ("marginRight" == orther.node.name) {
          this.winGame();
          this._isWin = true;
          this.node.stopAction(this._action);
          this.node.stopAction(this._actionCollider);
          this.spinboy.setAnimation(1, "hoverboard", true);
          return;
        }
        if (orther.name.indexOf("margin") >= 0 && this.node.scaleX < 0) {
          this.node.stopAction(this._action);
          this.node.stopAction(this._actionCollider);
          return;
        }
        if (true == this._isDead) return;
        this.node.stopAction(this._actionCollider);
        this._actionHeart();
      },
      _actionHeart: function _actionHeart() {
        var _this5 = this;
        var action1 = cc.blink(1, 20);
        var action2 = cc.tintTo(.5, 255, 0, 0);
        var action3 = cc.callFunc(function() {
          _this5.node.opacity = 255;
        });
        this._actionCollider = cc.spawn(action1, action2, action3);
        this.node.runAction(this._actionCollider);
      },
      onCollisionStay: function onCollisionStay(orther, self) {
        if (orther.name.indexOf("margin") >= 0 && this.node.scaleX < 0) {
          this.node.stopAction(this._action);
          this.node.stopAction(this._actionCollider);
          return;
        }
        var hp = this.hpProgressBar.getComponent(cc.ProgressBar);
        hp.progress -= .01;
        if (hp.progress <= 0 && false == this._isDead) {
          cc.log(1);
          this._isDead = true;
          this.handleDead();
          this.loseGame();
          return;
        }
        this._actionHeart();
      },
      onCollisionExit: function onCollisionExit(orther) {
        if (orther.name.indexOf("margin") >= 0) return;
        this.node.opacity = 255;
        this.node.stopAction(this._actionCollider);
        this._actionCollider = cc.tintTo(1, 255, 255, 255);
        this.node.runAction(this._actionCollider);
      },
      winGame: function winGame() {
        var _this6 = this;
        this.winTheeGame.node.active = true;
        this._isJump = true;
        this._isMove = true;
        var score = 0;
        var actions = [ cc.callFunc(function() {
          score += 1;
        }), cc.delayTime(.01), cc.callFunc(function() {
          _this6.winTheeGame.node.getChildByName("scoreWin").getComponent(cc.Label).string = score;
          cc.log(_this6.score.string);
        }), cc.callFunc(this.playSoundWin, this) ];
        this.node.runAction(cc.repeat(cc.sequence(actions), this._score));
        this.reloadGame.node.active = false;
        this.animWin.node.active = true;
      },
      loseGame: function loseGame() {
        this.loseTheeGame.node.active = true;
        this.reloadGame.node.active = false;
        var actionSound = cc.callFunc(this.playSoundDeath, this);
        this.node.runAction(actionSound);
        Emitter.instance.emit("gameOver");
      },
      resetGame: function resetGame() {
        cc.director.loadScene("game");
      }
    });
    cc._RF.pop();
  }, {
    mEmitter: "mEmitter"
  } ]
}, {}, [ "bullet", "controller", "mEmitter", "monter", "spinboy" ]);