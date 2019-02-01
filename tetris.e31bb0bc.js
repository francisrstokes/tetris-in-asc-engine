// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/vec-la-fp/dist/vec.module.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// curry :: (a -> b -> ... -> n) -> (a -> b) -> (b -> ...) -> (... -> n)
var curry = function curry(fn) {
  var curried = function curried() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length >= fn.length) {
      return fn.apply(undefined, args);
    }
    return function () {
      for (var _len2 = arguments.length, argsNext = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        argsNext[_key2] = arguments[_key2];
      }

      return curried.apply(undefined, args.concat(argsNext));
    };
  };
  return curried;
};

// pipe :: (a -> b) -> (b -> ...) -> (... -> n)
var pipe = function pipe(fn1) {
  for (var _len3 = arguments.length, functions = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    functions[_key3 - 1] = arguments[_key3];
  }

  return function () {
    return functions.reduce(function (acc, fn) {
      return fn(acc);
    }, fn1.apply(undefined, arguments));
  };
};

// compose :: (... -> n) -> (b -> ...) -> (a -> b)
var compose = function compose() {
  for (var _len4 = arguments.length, functions = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    functions[_key4] = arguments[_key4];
  }

  return pipe.apply(undefined, _toConsumableArray(functions.reverse()));
};

// vAdd :: Vector -> Vector -> Vector
var vAdd = curry(function (v, v2) {
  return [v[0] + v2[0], v[1] + v2[1]];
});

// vAdd3 :: Vector -> Vector -> Vector -> Vector
var vAdd3 = curry(function (v, v2, v3) {
  return [v[0] + v2[0] + v3[0], v[1] + v2[1] + v3[1]];
});

// vAddAll :: [Vector] -> Vector
var vAddAll = function vAddAll(vs) {
  return vs.reduce(vAdd, [0, 0]);
};

// vSub :: Vector -> Vector -> Vector
var vSub = curry(function (v, v2) {
  return [v[0] - v2[0], v[1] - v2[1]];
});

// vSub3 :: Vector -> Vector -> Vector -> Vector
var vSub3 = curry(function (v, v2, v3) {
  return [v[0] - v2[0] - v3[0], v[1] - v2[1] - v3[1]];
});

// vSubAll :: [Vector] -> Vector
var vSubAll = function vSubAll(vs) {
  return vs.slice(1).reduce(vSub, vs.slice(0, 1)[0]);
};

// vMag :: Vector -> Number
var vMag = function vMag(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
};

// vNormal :: Vector -> Vector
var vNormal = function vNormal(v) {
  return [-v[1], v[0]];
};

// vScale :: Number -> Vector
var vScale = curry(function (sc, v) {
  return [v[0] * sc, v[1] * sc];
});

// vTowards :: Number -> Vector -> Vector -> Vector
var vTowards = curry(function (t, v1, v2) {
  var d = vSub(v2, v1);
  var sc = vMag(d) * t;
  return vAdd(v1, vScale(sc, vNorm(d)));
});

// vLerp :: Vector -> Vector -> Number -> Vector
var vLerp = curry(function (v1, v2, t) {
  return vTowards(t, v1, v2);
});

// vNorm :: Vector -> Vector
var vNorm = function vNorm(v) {
  var mag = vMag(v);
  return [v[0] / mag, v[1] / mag];
};

// mId :: Matrix
var mId = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);

// vCreateMatrix :: Number -> Number -> Number -> Number -> Number -> Number -> Matrix
var vCreateMatrix = function vCreateMatrix() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var tx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var ty = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  return [a, c, tx, b, d, ty, 0, 0, 1];
};

// vTransform :: Matrix -> Vector -> Vector
var vTransform = curry(function (m, v) {
  return [v[0] * m[0] + v[1] * m[1] + m[2], v[0] * m[3] + v[1] * m[4] + m[5]];
});

// mCompose :: Matrix -> Matrix -> Matrix
var mCompose = curry(function (m, m2) {
  return [m[0] * m2[0] + m[1] * m2[3] + m[2] * m2[6], m[0] * m2[1] + m[1] * m2[4] + m[2] * m2[7], m[0] * m2[2] + m[1] * m2[5] + m[2] * m2[8], m[3] * m2[0] + m[4] * m2[3] + m[5] * m2[6], m[3] * m2[1] + m[4] * m2[4] + m[5] * m2[7], m[3] * m2[2] + m[4] * m2[5] + m[5] * m2[8], m[6] * m2[0] + m[7] * m2[3] + m[8] * m2[6], m[6] * m2[1] + m[7] * m2[4] + m[8] * m2[7], m[6] * m2[2] + m[7] * m2[5] + m[8] * m2[8]];
});

// mRotate :: Number -> Matrix -> Matrix
var mRotate = function mRotate(a) {
  return mCompose([Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1]);
};

// mTranslate :: Vector -> Matrix -> Matrix
var mTranslate = function mTranslate(v) {
  return mCompose([1, 0, v[0], 0, 1, v[1], 0, 0, 1]);
};

// mScale :: Vector -> Matrix -> Matrix
var mScale = function mScale(v) {
  return mCompose([v[0], 0, 0, 0, v[1], 0, 0, 0, 1]);
};

// mShear :: Vector -> Matrix -> Matrix
var mShear = function mShear(v) {
  return mCompose([1, v[0], 0, v[1], 1, 0, 0, 0, 1]);
};

// vRotate :: Number -> Vector -> Vector
var vRotate = curry(function (a, v) {
  return [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
});

// vRotatePointAround :: Number -> Vector -> Vector -> Vector
var vRotatePointAround = curry(function (a, cp, v) {
  var v2 = vSub(v, cp);
  return vAdd(cp, [v2[0] * Math.cos(a) - v2[1] * Math.sin(a), v2[0] * Math.sin(a) + v2[1] * Math.cos(a)]);
});

// vMidpoint :: Vector -> Vector -> Vector
var vMidpoint = curry(function (v, v2) {
  return vScale(0.5, vAdd(v, v2));
});

// vAngle :: Number -> Vector
var vAngle = function vAngle(a) {
  return [Math.cos(a), Math.sin(a)];
};

// vAlongAngle :: Number -> Number -> Vector
var vAlongAngle = curry(function (a, r, v) {
  return compose(vAdd(v), vScale(r), vAngle)(a);
});

// vFastDist :: Vector -> Vector -> Number
var vFastDist = curry(function (v, v2) {
  return Math.pow(v2[0] - v[0], 2) + Math.pow(v2[1] - v[1], 2);
});

// vDist :: Vector -> Vector -> Number
var vDist = curry(function (v, v2) {
  return Math.hypot(v2[0] - v[0], v2[1] - v[1]);
});

// vDot :: Vector -> Vector -> Number
var vDot = curry(function (v, v2) {
  return v[0] * v2[0] + v[1] * v2[1];
});

// vDet :: Matrix -> Number
var vDet = function vDet(m) {
  return m[0] * m[4] - m[3] * m[1];
};

var vec = {
  add: vAdd,
  add3: vAdd3,
  addAll: vAddAll,
  sub: vSub,
  sub3: vSub3,
  subAll: vSubAll,
  mag: vMag,
  normal: vNormal,
  scale: vScale,
  towards: vTowards,
  lerp: vLerp,
  norm: vNorm,
  mId: mId,
  createMatrix: vCreateMatrix,
  transform: vTransform,
  mCompose: mCompose,
  mRotate: mRotate,
  mTranslate: mTranslate,
  mScale: mScale,
  mShear: mShear,
  rotate: vRotate,
  rotatePointAround: vRotatePointAround,
  midpoint: vMidpoint,
  angle: vAngle,
  alongAngle: vAlongAngle,
  fastDist: vFastDist,
  dist: vDist,
  dot: vDot,
  det: vDet
};

/* start exports */
exports.default = vec;
exports.vec = vec;
exports.vAdd = vAdd;
exports.vAdd3 = vAdd3;
exports.vAddAll = vAddAll;
exports.vSub = vSub;
exports.vSub3 = vSub3;
exports.vSubAll = vSubAll;
exports.vMag = vMag;
exports.vNormal = vNormal;
exports.vScale = vScale;
exports.vTowards = vTowards;
exports.vLerp = vLerp;
exports.vNorm = vNorm;
exports.mId = mId;
exports.vCreateMatrix = vCreateMatrix;
exports.vTransform = vTransform;
exports.mCompose = mCompose;
exports.mRotate = mRotate;
exports.mTranslate = mTranslate;
exports.mScale = mScale;
exports.mShear = mShear;
exports.vRotate = vRotate;
exports.vRotatePointAround = vRotatePointAround;
exports.vMidpoint = vMidpoint;
exports.vAngle = vAngle;
exports.vAlongAngle = vAlongAngle;
exports.vFastDist = vFastDist;
exports.vDist = vDist;
exports.vDot = vDot;
exports.vDet = vDet;
/* end exports */
},{}],"node_modules/asc-engine/src/constants.js":[function(require,module,exports) {
const LAYERS = Object.freeze({
  HUD: 0,
  BG : 1,
  MG : 2,
  FG : 3
});

module.exports = Object.freeze({
  LAYERS
});

},{}],"node_modules/asc-engine/src/util.js":[function(require,module,exports) {
const posToGridIndex = ([x, y], gw) => {
  return x + gw * y;
};

const posFromGridIndex = (i, gw) => [(i % gw)|0, (i / gw)|0];

const pick = (props, obj) => {
  const out = {};
  for (const p of props) {
    out[p] = obj[p];
  }
  return out;
};

const fromify = cons => (...args) => new cons(...args);

module.exports = {
  posToGridIndex,
  posFromGridIndex,
  pick,
  fromify
};

},{}],"node_modules/asc-engine/src/GameState.js":[function(require,module,exports) {
class GameState {
  constructor() {
    this.state = {};
  }

  load(state) {
    this.state = state;
  }

  serialize() {
    return this.state;
  }
}

module.exports = GameState;

},{}],"node_modules/asc-engine/src/Input.js":[function(require,module,exports) {
class Input {
  constructor() {
    this.keyStates = {};
    const keydownHandler = e => {
      if (!this.keyStates[e.key]) {
        this.keyStates[e.key] = {
          state: true,
          downThisFrame: true,
          upThisFrame: false
        };
        return;
      }

      this.keyStates[e.key].state = true;
      this.keyStates[e.key].downThisFrame = true;
      this.keyStates[e.key].upThisFrame = false;
    };

    const keyupHandler = e => {
      if (!this.keyStates[e.key]) {
        this.keyStates[e.key] = {
          state: false,
          downThisFrame: false,
          upThisFrame: true
        };
        return;
      }

      this.keyStates[e.key].state = false;
      this.keyStates[e.key].downThisFrame = false;
      this.keyStates[e.key].upThisFrame = true;
    };

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    this.cleanup = () => {
      document.removeEventListener('keydown', keydownHandler);
      document.removeEventListener('keyup', keyupHandler);
    };
  }

  keyIsDown(key) {
    if (!(key in this.keyStates)) {
      this.keyStates[key] = {
        state: false,
        downThisFrame: false,
        upThisFrame: false
      };
      return false;
    }
    return this.keyStates[key].state;
  }

  keyPressed(key) {
    return this.keyIsDown(key) && this.keyStates.downThisFrame;
  }

  keyReleased(key) {
    return !this.keyIsDown(key) && this.keyStates.upThisFrame;
  }

  update() {
    Object.values(this.keyStates).forEach(ks => {
      ks.downThisFrame = false;
      ks.upThisFrame = false;
    });
  }
}

module.exports = Input;
},{}],"node_modules/asc-engine/src/PubSub.js":[function(require,module,exports) {
class PubSub {
  constructor() {
    this.topics = {};
    this._nextId = 0;
  }

  nextId() {
    return this._nextId++;
  }

  subscribe(topic, handler) {
    if (!(topic in this.topics)) {
      this.topics[topic] = {};
    }

    const fixedId = this.nextId();
    this.topics[topic][fixedId] = handler;

    return () => {
      delete this.topics[topic][fixedId];
    }
  }

  publish(topic, data) {
    if (topic in this.topics) {
      Object.values(this.topics[topic]).forEach(fn => fn(data));
    }
  }
}

module.exports = PubSub;

},{}],"node_modules/asc-engine/src/Renderer.js":[function(require,module,exports) {
const {pick} = require('./util');

const FONT = `'Source Code Pro', monospace`;

class Renderer {
  constructor(canvas, canvasWidth, canvasHeight) {
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;

    this._styleStack = [];
    this.ctx = canvas.getContext('2d');
    this.ctx.textBaseline = 'top';

    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.setTileSize(20);

    this.buffers = [ [], [], [], [] ];
  }

  commit() {
    this.pushStyle();
    for (let i = 0; i < this.buffers.length; i++) {
      while (this.buffers[i].length) {
        const {pos, color, char, draw} = this.buffers[i].pop();
        if (draw) {
          this.ctx.fillStyle = color;
          this.ctx.fillText(char, pos[0], pos[1]);
        }
      }
    }
    this.popStyle();
  }

  pushStyle() {
    const props = ['fillStyle', 'strokeStyle', 'font', 'filter', 'lineWidth'];
    this._styleStack.push(pick(props, this.ctx));
  }

  popStyle() {
    if (this._styleStack.length > 0) {
      const entries = Object.entries(this._styleStack.pop());
      for (const [key, value] of entries) {
        this.ctx[key] = value;
      }
    } else {
      throw new RangeError(`No styles to pop in the stack`);
    }
  }

  setTileSize(size) {
    if (size !== this.size) {
      this.size = size;
      this.ctx.font = `${this.size}px ${FONT}`;
    }
  }

  clearBackground(col) {
    this.pushStyle();
    this.ctx.fillStyle = col;
    this.ctx.beginPath()
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fill();
    this.ctx.closePath();
    this.popStyle();
  }

  drawTile({char, color, zPos}, pos) {
    this.buffers[zPos].unshift({
      pos,
      char,
      color,
      draw: true
    });
  }

  drawRect(fill, stroke, [x, y], w, h, strokeWeight = 1) {
    this.pushStyle();
    this.ctx.fillStyle = fill;
    this.ctx.strokeStyle = stroke;
    this.ctx.lineWidth = strokeWeight;

    this.ctx.fillRect(x, y, w, h);
    this.ctx.rect(x, y, w, h);
    this.ctx.stroke();
    this.popStyle();
  }

  drawCircle(fill, stroke, [x, y], r, strokeWeight = 1) {
    this.pushStyle();
    this.ctx.fillStyle = fill;
    this.ctx.strokeStyle = stroke;
    this.ctx.lineWidth = strokeWeight;

    this.ctx.beginPath();
    this.ctx.ellipse(x, y, r, r, 0, 0, Math.PI*2, false);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();

    this.popStyle();
  }
}

module.exports = Renderer;

},{"./util":"node_modules/asc-engine/src/util.js"}],"node_modules/asc-engine/src/Game.js":[function(require,module,exports) {
const {vAdd, vScale} = require('vec-la-fp');

const GameState = require('./GameState');
const Input = require('./Input');
const PubSub = require('./PubSub');
const Renderer = require('./Renderer');
const {posToGridIndex} = require('./util');

class Game {
  constructor(canvasId, canvasWidth, canvasHeight) {
    const events = new PubSub();
    this.subscribe = events.subscribe.bind(events);
    this.publish = events.publish.bind(events);

    const canvas = document.getElementById(canvasId);
    this.renderer = new Renderer(canvas, canvasWidth, canvasHeight);

    this.area = null;

    this.input = new Input();
    this.state = new GameState();

    this.deltaTime = 0;
    this.lastTime = Date.now();
    this.frames = 0;
    this.boundDraw = this.draw.bind(this);

    this.onUpdate = () => {};
    this.onDraw = () => {};
  }

  createScreenRegion(pos, getTileSize) {
    return tileXY => vAdd(vScale(getTileSize(), tileXY), pos);
  }

  setCurrentArea(area) {
    this.area = area;
    this.renderer.setTileSize(area.size);
  }

  getTile(pos) {
    const [x, y] = pos;
    const {width:w, height:h} = this.area;
    if (x >= w || y >= h || x < 0 || y < 0) return null;
    const index = posToGridIndex(pos, w)
    return this.area.grid[index];
  }

  start() {
    requestAnimationFrame(this.boundDraw);
  }

  draw() {
    this.deltaTime += Date.now() - this.lastTime;
    if (this.deltaTime >= 16) {
      this.deltaTime = 0;
      this.frames++;

      this.publish('@@FRAME_BEFORE_UPDATE');
      this.onUpdate();

      this.publish('@@FRAME_BEFORE_DRAW');
      this.onDraw();

      this.publish('@@FRAME_BEFORE_RENDER_COMMIT');
      this.renderer.commit();

      // Reset the frame values for input
      this.input.update();

      this.publish('@@FRAME_COMPLETE');
    }

    requestAnimationFrame(this.boundDraw);
  }
}

module.exports = Game;

},{"vec-la-fp":"node_modules/vec-la-fp/dist/vec.module.js","./GameState":"node_modules/asc-engine/src/GameState.js","./Input":"node_modules/asc-engine/src/Input.js","./PubSub":"node_modules/asc-engine/src/PubSub.js","./Renderer":"node_modules/asc-engine/src/Renderer.js","./util":"node_modules/asc-engine/src/util.js"}],"node_modules/asc-engine/src/Area.js":[function(require,module,exports) {
const {posToGridIndex, fromify} = require('./util');

class Area {
  constructor(width, height, offset, size) {
    this.width = width;
    this.height = height;
    this.offset = offset;
    this.size = size;

    this.grid = [];

    this.actors = [];

    this.items = [];

    this.handlers = {};
  }

  setGrid(grid) {
    this.grid = grid;
  }

  setGridAtPos(tile, pos) {
    const i = posToGridIndex(pos, this.width);
    if (i >= this.grid.length) {
      throw new RangeError(`Can't set out of range index ${i} (${x}, ${y}) on grid with only ${this.grid.length} tiles`);
    }
    this.grid[i] = tile;
  }
}

Area.from = fromify(Area);

module.exports = Area;

},{"./util":"node_modules/asc-engine/src/util.js"}],"node_modules/asc-engine/src/Tile.js":[function(require,module,exports) {
const {fromify} = require('./util');
const {LAYERS} = require('./constants');

class Tile {
  constructor(char, color, zPos = LAYERS.BG) {
    this.char = char;
    this.color = color;
    this.zPos = zPos;
    this.properties = [];
  }

  hasProperty(prop) {
    return this.properties.includes(prop);
  }

  addProperty(prop) {
    this.properties.push(prop);
    return this;
  }
}

Tile.from = fromify(Tile);

module.exports = Tile;

},{"./util":"node_modules/asc-engine/src/util.js","./constants":"node_modules/asc-engine/src/constants.js"}],"node_modules/asc-engine/src/Animation.js":[function(require,module,exports) {
const {vAdd} = require('vec-la-fp');

class Animation {
  constructor(timeline, animationLength, pos, times = 1, loop = false) {
    this.timeline = timeline;
    this.active = false;
    this.pos = pos;
    this.frame = 0;
    this.animationLength = animationLength;
    this.loop = loop;
    this.times = times;
    this.onComplete = null;
  }

  start() {
    this.active = true;
  }

  stop() {
    this.active = false;
  }

  reset() {
    this.active = false;
    this.frame = 0;
  }

  draw(game, tileToScreen) {
    if (this.active) {
      const ai = Math.floor(this.frame / (this.animationLength / (this.timeline.length * this.times))) % this.timeline.length;

      const frame = this.timeline[ai];
      frame.forEach(({tile, pos}) => {
        const screenPos = tileToScreen(vAdd(pos, this.pos));
        game.renderer.drawTile(tile, screenPos);
      });

      this.frame++;
      if (this.frame >= this.animationLength) {
        if (this.loop) {
          this.frame = 0;
        } else {
          this.reset();
          if (typeof this.onComplete === 'function') {
            this.onComplete();
          }
        }
      }
    }
  }

  clone() {
    return new Animation(
      this.timeline,
      this.animationLength,
      this.pos,
      this.loop
    );
  }
}

module.exports = Animation;

},{"vec-la-fp":"node_modules/vec-la-fp/dist/vec.module.js"}],"index.js":[function(require,module,exports) {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('vec-la-fp'),
    vAdd = _require.vAdd;

var _require2 = require('asc-engine/src/constants'),
    LAYERS = _require2.LAYERS;

var _require3 = require('asc-engine/src/util'),
    posFromGridIndex = _require3.posFromGridIndex;

var Game = require('asc-engine/src/Game');

var Area = require('asc-engine/src/Area');

var Tile = require('asc-engine/src/Tile');

var Animation = require('asc-engine/src/Animation');

var game = new Game('main', 1000, 700);
var toGameArea = game.createScreenRegion([19 * 20, 4 * 20], function () {
  return game.area.size;
});
var toTitleArea = game.createScreenRegion([0, 0], function () {
  return game.area.size;
});
var toScoreArea = game.createScreenRegion([40 * 20, 0], function () {
  return game.area.size;
});
var title = new Tile('T . E . T . R . I . S', '#f11', LAYERS.HUD);
var score = new Tile('Score: 0', '#0f0', LAYERS.HUD);
score.score = 0;

score.update = function (x) {
  score.score += x;
  score.char = "Score: ".concat(score.score);
};

var PAW = 10;
var PAH = 23;

var createLineAnimation = function createLineAnimation(y) {
  return new Animation(Array.from({
    length: PAW + 1
  }, function (_, i) {
    return [{
      tile: new Tile('#', '#ffffff', LAYERS.HUD),
      pos: [i, 0]
    }];
  }), 15, [0, y], 1, false);
};

var animations = [];
var FRAME_TIME = 16.6;
var lastTime = Date.now();
var currentTime = lastTime;

var moduloAddition = function moduloAddition(a, b, c) {
  if (b < 0) {
    b = c - Math.abs(b);
  }

  return (a + b) % c;
};

var pieces = [[[[1, 1, 0], [0, 1, 1]], [[0, 0, 1], [0, 1, 1], [0, 1, 0]], [[1, 1, 0], [0, 1, 1]], [[0, 1, 0], [1, 1, 0], [1, 0, 0]]], [[[0, 1, 1], [1, 1, 0]], [[1, 0, 0], [1, 1, 0], [0, 1, 0]], [[0, 1, 1], [1, 1, 0]], [[0, 1, 0], [0, 1, 1], [0, 0, 1]]], [[[0, 1, 0], [0, 1, 0], [0, 1, 1]], [[1, 1, 1], [1, 0, 0], [0, 0, 0]], [[1, 1, 0], [0, 1, 0], [0, 1, 0]], [[0, 0, 1], [1, 1, 1], [0, 0, 0]]], [[[0, 1, 0], [0, 1, 0], [1, 1, 0]], [[1, 1, 1], [0, 0, 1]], [[0, 1, 1], [0, 1, 0], [0, 1, 0]], [[1, 0, 0], [1, 1, 1]]], [[[1, 1, 0], [1, 1, 0]], [[1, 1, 0], [1, 1, 0]], [[1, 1, 0], [1, 1, 0]], [[1, 1, 0], [1, 1, 0]]], [[[0, 1], [0, 1], [0, 1], [0, 1]], [[0, 0, 0, 0], [1, 1, 1, 1]], [[0, 1], [0, 1], [0, 1], [0, 1]], [[0, 0, 0, 0], [1, 1, 1, 1]]], [[[0, 1, 0], [1, 1, 1]], [[0, 1, 0], [0, 1, 1], [0, 1, 0]], [[1, 1, 1], [0, 1, 0]], [[0, 1, 0], [1, 1, 0], [0, 1, 0]]]];
var instanceTiles = [new Tile('$', '#ff0000', LAYERS.FG), new Tile('%', '#00ff00', LAYERS.FG), new Tile('&', '#ff00ff', LAYERS.FG)];
var nextPiece = pieces[Math.random() * pieces.length | 0];
var nextTile = instanceTiles[Math.random() * instanceTiles.length | 0];
var instance = {
  piece: null,
  state: null,
  pos: null,
  tile: null,
  next: function next() {
    instance.piece = nextPiece;
    nextPiece = pieces[Math.random() * pieces.length | 0];
    instance.tile = nextTile;
    nextTile = instanceTiles[Math.random() * instanceTiles.length | 0];
    instance.pos = [5, 0];
    instance.state = 0;
  }
};
instance.next();
var gameState = Array.from({
  length: PAH
}, function () {
  return Array.from({
    length: PAW
  });
});
var keyStates = {};

var lockedKeyAction = function lockedKeyAction(key, action) {
  if (game.input.keyIsDown(key) && !keyStates[key]) {
    keyStates[key] = true;
    action();
  }
};

var updateLockStates = function updateLockStates() {
  Object.keys(keyStates).forEach(function (ks) {
    if (!game.input.keyIsDown(ks)) {
      keyStates[ks] = false;
    }
  });
};

var checkCollision = function checkCollision(pos, state) {
  var collision = {
    blocked: false
  };
  instance.piece[state].forEach(function (row, y) {
    return row.forEach(function (cell, x) {
      if (cell === 0) return;

      var _vAdd = vAdd(pos, [x, y]),
          _vAdd2 = _slicedToArray(_vAdd, 2),
          nx = _vAdd2[0],
          ny = _vAdd2[1];

      if (nx === 0 || nx === PAW + 1) {
        collision.blocked = true;
        return;
      }

      if (ny === PAH || gameState[ny][nx - 1]) {
        collision.blocked = true;
      }
    });
  });
  return collision;
};

game.onUpdate = function () {
  var mLeft, mRight, rLeft, rRight;
  lockedKeyAction('z', function () {
    return rLeft = true;
  });
  lockedKeyAction('x', function () {
    return rRight = true;
  });
  lockedKeyAction('ArrowLeft', function () {
    return mLeft = true;
  });
  lockedKeyAction('ArrowRight', function () {
    return mRight = true;
  });
  updateLockStates();

  if (mLeft) {
    var nextPos = vAdd(instance.pos, [-1, 0]);
    var collision = checkCollision(nextPos, instance.state);

    if (!collision.blocked) {
      instance.pos = nextPos;
    }
  } else if (mRight) {
    var _nextPos = vAdd(instance.pos, [1, 0]);

    var _collision = checkCollision(_nextPos, instance.state);

    if (!_collision.blocked) {
      instance.pos = _nextPos;
    }
  } else if (rLeft) {
    var nextState = moduloAddition(instance.state, -1, instance.piece.length);

    var _collision2 = checkCollision(instance.pos, nextState);

    if (!_collision2.blocked) {
      instance.state = nextState;
    }
  } else if (rRight) {
    var _nextState = moduloAddition(instance.state, 1, instance.piece.length);

    var _collision3 = checkCollision(instance.pos, _nextState);

    if (!_collision3.blocked) {
      instance.state = _nextState;
    }
  }

  var rate = game.input.keyIsDown('ArrowDown') ? 5 : 30;
  currentTime = Date.now();

  if (currentTime - lastTime >= FRAME_TIME * rate) {
    lastTime = currentTime;
    score.update(30 / rate);
    instance.pos = vAdd(instance.pos, [0, 1]);

    var _collision4 = checkCollision(instance.pos, instance.state);

    if (_collision4.blocked) {
      instance.piece[instance.state].forEach(function (row, y) {
        row.forEach(function (cell, x) {
          if (cell === 1) {
            var _vAdd3 = vAdd(instance.pos, [x, y]),
                _vAdd4 = _slicedToArray(_vAdd3, 2),
                nx = _vAdd4[0],
                ny = _vAdd4[1];

            gameState[ny - 1][nx - 1] = instance.tile;
          }
        });
      });
      instance.next();
    }

    var lines = 0;

    for (var i = gameState.length - 1; i >= 0; i--) {
      var filled = gameState[i].every(Boolean);

      if (filled) {
        gameState.splice(i, 1);
        var ani = createLineAnimation(i - lines);
        ani.start();
        animations.push(ani);
        lines++;
      }
    }

    if (lines) {
      for (var _i2 = 0; _i2 < lines; _i2++) {
        gameState.unshift(Array.from({
          length: PAW
        }));
      }

      var bonus = lines === 5 ? 500 : 0;
      score.update(Math.round(100 * Math.pow(lines, 1.25)) + bonus);
    }

    if (gameState[0].some(Boolean)) {
      score.score = 0;
      score.update(0);
      gameState = Array.from({
        length: PAH
      }, function () {
        return Array.from({
          length: PAW
        });
      });
    }
  }

  for (var _i3 = animations.length - 1; _i3 >= 0; _i3--) {
    if (!animations[_i3].active) {
      animations.splice(_i3, 1);
      continue;
    }
  }
};

game.onDraw = function () {
  var _this = this;

  this.renderer.clearBackground('#000000');
  this.renderer.setTileSize(this.area.size);
  this.area.grid.forEach(function (t, i) {
    var pos = toGameArea(posFromGridIndex(i, _this.area.width, _this.area.height));

    _this.renderer.drawTile(t, pos);
  });
  instance.piece[instance.state].forEach(function (row, y) {
    row.forEach(function (cell, x) {
      if (cell === 1) {
        var pos = toGameArea(vAdd(instance.pos, [x, y]));
        game.renderer.drawTile(instance.tile, pos);
      }
    });
  });
  gameState.forEach(function (row, y) {
    return row.forEach(function (tile, x) {
      if (tile) game.renderer.drawTile(tile, toGameArea([x + 1, y]));
    });
  });
  nextPiece[0].forEach(function (row, y) {
    row.forEach(function (cell, x) {
      if (cell === 1) {
        var pos = toGameArea(vAdd([20, 5], [x, y]));
        game.renderer.drawTile(nextTile, pos);
      }
    });
  });
  animations.forEach(function (a) {
    return a.draw(game, toGameArea);
  });
  game.renderer.drawTile(title, toTitleArea([1, 1]));
  game.renderer.drawTile(score, toScoreArea([0, 1]));
};

var S = Tile.from('#', '#999999');
S.addProperty('SOLID');
var F = Tile.from('.', '#333333');
var tiles = [S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, F, F, F, F, F, F, F, F, F, F, S, S, S, S, S, S, S, S, S, S, S, S, S];
var gameArea = new Area(PAW + 2, PAH + 2, [0, 0], 25);
gameArea.setGrid(tiles);
game.setCurrentArea(gameArea);
game.start();
},{"vec-la-fp":"node_modules/vec-la-fp/dist/vec.module.js","asc-engine/src/constants":"node_modules/asc-engine/src/constants.js","asc-engine/src/util":"node_modules/asc-engine/src/util.js","asc-engine/src/Game":"node_modules/asc-engine/src/Game.js","asc-engine/src/Area":"node_modules/asc-engine/src/Area.js","asc-engine/src/Tile":"node_modules/asc-engine/src/Tile.js","asc-engine/src/Animation":"node_modules/asc-engine/src/Animation.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57768" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/tetris.e31bb0bc.map