const {vAdd} = require('vec-la-fp');
const {LAYERS} = require('asc-engine/src/constants');
const {posFromGridIndex} = require('asc-engine/src/util');
const Game = require('asc-engine/src/Game');
const Area = require('asc-engine/src/Area');
const Tile = require('asc-engine/src/Tile');
const Animation = require('asc-engine/src/Animation');

const game = new Game('main', 1000, 700);
const toGameArea = game.createScreenRegion([19*20, 4*20], () => game.area.size);
const toTitleArea = game.createScreenRegion([0, 0], () => game.area.size);
const toScoreArea = game.createScreenRegion([40*20, 0], () => game.area.size);

const title = new Tile('T . E . T . R . I . S', '#f11', LAYERS.HUD);
const score = new Tile('Score: 0', '#0f0', LAYERS.HUD);
score.score = 0;
score.update = x => {
  score.score += x;
  score.char = `Score: ${score.score}`;
};


const PAW = 10;
const PAH = 23;

const createLineAnimation = y => new Animation(
  Array.from({length: PAW+1}, (_, i) => [{
    tile: new Tile('#', '#ffffff', LAYERS.HUD),
    pos: [i, 0]
  }]),
  15,
  [0, y],
  1,
  false
);

const animations = [];

const FRAME_TIME = 16.6;
let lastTime = Date.now();
let currentTime = lastTime;

const moduloAddition = (a, b, c) => {
  if (b < 0) {
    b = c - (Math.abs(b));
  }
  return (a + b) % c;
};

const pieces = [
  [
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
  [
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
  ],
  [
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [1, 1, 1],
      [1, 0, 0],
      [0, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  ],
  [
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    [
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
  ],
  [
    [
      [1, 1, 0],
      [1, 1, 0],
    ],
    [
      [1, 1, 0],
      [1, 1, 0],
    ],
    [
      [1, 1, 0],
      [1, 1, 0],
    ],
    [
      [1, 1, 0],
      [1, 1, 0],
    ],
  ],
  [
    [
      [0, 1],
      [0, 1],
      [0, 1],
      [0, 1],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
    ],
    [
      [0, 1],
      [0, 1],
      [0, 1],
      [0, 1],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
    ],
  ],
  [
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
];

const instanceTiles = [
  new Tile('$', '#ff0000', LAYERS.FG),
  new Tile('%', '#00ff00', LAYERS.FG),
  new Tile('&', '#ff00ff', LAYERS.FG),
]

let nextPiece = pieces[(Math.random()*pieces.length)|0];
let nextTile = instanceTiles[(Math.random()*instanceTiles.length)|0];
const instance = {
  piece: null,
  state: null,
  pos: null,
  tile: null,
  next: () => {
    instance.piece = nextPiece;
    nextPiece = pieces[(Math.random()*pieces.length)|0];
    instance.tile = nextTile;
    nextTile = instanceTiles[(Math.random()*instanceTiles.length)|0];
    instance.pos = [5, 0];
    instance.state = 0;
  }
};
instance.next();

let gameState = Array.from({length:PAH}, () => Array.from({length:PAW}));

const keyStates = {}

const lockedKeyAction = (key, action) => {
  if (game.input.keyIsDown(key) && !keyStates[key]) {
    keyStates[key] = true;
    action();
  }
};

const updateLockStates = () => {
  Object.keys(keyStates).forEach(ks => {
    if (!game.input.keyIsDown(ks)) {
      keyStates[ks] = false;
    }
  });
}

const checkCollision = (pos, state) => {
  let collision = {
    blocked: false,
  };

  instance.piece[state].forEach((row, y) => {
    return row.forEach((cell, x) => {
      if (cell === 0) return;

      const [nx, ny] = vAdd(pos, [x, y]);

      if (nx === 0 || nx === PAW+1) {
        collision.blocked = true;
        return;
      }

      if (ny === PAH || gameState[ny][nx-1]) {
        collision.blocked = true;
      }
    });
  });
  return collision;
}

game.onUpdate = function () {
  let mLeft, mRight, rLeft, rRight;
  lockedKeyAction('z', () => rLeft = true);
  lockedKeyAction('x', () => rRight = true);
  lockedKeyAction('ArrowLeft', () => mLeft = true);
  lockedKeyAction('ArrowRight', () => mRight = true);
  updateLockStates();

  if (mLeft) {
    const nextPos = vAdd(instance.pos, [-1, 0]);
    const collision = checkCollision(nextPos, instance.state);
    if (!collision.blocked) {
      instance.pos = nextPos;
    }
  } else if (mRight) {
    const nextPos = vAdd(instance.pos, [1, 0]);
    const collision = checkCollision(nextPos, instance.state);
    if (!collision.blocked) {
      instance.pos = nextPos;
    }
  } else if (rLeft) {
    const nextState = moduloAddition(instance.state, -1, instance.piece.length);
    const collision = checkCollision(instance.pos, nextState);
    if (!collision.blocked) {
      instance.state = nextState;
    }
  } else if (rRight) {
    const nextState = moduloAddition(instance.state, 1, instance.piece.length);
    const collision = checkCollision(instance.pos, nextState);
    if (!collision.blocked) {
      instance.state = nextState;
    }
  }

  const rate = game.input.keyIsDown('ArrowDown') ? 5 : 30;

  currentTime = Date.now();
  if (currentTime - lastTime >= FRAME_TIME * rate) {
    lastTime = currentTime;

    score.update(30 / rate);

    instance.pos = vAdd(instance.pos, [0, 1]);
    const collision = checkCollision(instance.pos, instance.state);

    if (collision.blocked) {
      instance.piece[instance.state].forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === 1) {
            const [nx, ny] = vAdd(instance.pos, [x, y]);
            gameState[ny-1][nx-1] = instance.tile;
          }
        })
      });
      instance.next();
    }

    let lines = 0;
    for (let i = gameState.length-1; i >= 0; i--) {
      const filled = gameState[i].every(Boolean);
      if (filled) {
        gameState.splice(i, 1);

        const ani = createLineAnimation(i - lines);
        ani.start();
        animations.push(ani);

        lines++;
      }
    }

    if (lines) {
      for (let i = 0; i < lines; i++) {
        gameState.unshift(Array.from({length: PAW}));
      }
      const bonus = lines === 5 ? 500 : 0;
      score.update(Math.round(100 * lines**1.25) + bonus);
    }

    if (gameState[0].some(Boolean)) {
      score.score = 0;
      score.update(0);
      gameState = Array.from({length: PAH}, () => Array.from({length: PAW}));
    }
  }

  for (let i = animations.length - 1; i >= 0; i--) {
    if (!animations[i].active) {
      animations.splice(i, 1);
      continue;
    }
  }
};

game.onDraw = function () {
  this.renderer.clearBackground('#000000');
  this.renderer.setTileSize(this.area.size);

  this.area.grid.forEach((t, i) => {
    const pos = toGameArea(
      posFromGridIndex(i, this.area.width, this.area.height)
    );
    this.renderer.drawTile(t, pos);
  });

  instance.piece[instance.state].forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        const pos = toGameArea(vAdd(instance.pos, [x, y]));
        game.renderer.drawTile(instance.tile, pos);
      }
    })
  });

  gameState.forEach((row, y) =>
    row.forEach((tile, x) => {
      if (tile) game.renderer.drawTile(tile, toGameArea([x+1, y]))
    })
  );

  nextPiece[0].forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        const pos = toGameArea(vAdd([20, 5], [x, y]));
        game.renderer.drawTile(nextTile, pos);
      }
    })
  });

  animations.forEach(a => a.draw(game, toGameArea));

  game.renderer.drawTile(title, toTitleArea([1, 1]));
  game.renderer.drawTile(score, toScoreArea([0, 1]));
}

const S = Tile.from('#', '#999999');
S.addProperty('SOLID');
const F = Tile.from('.', '#333333');
const tiles = [
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,F,F,F,F,F,F,F,F,F,F,S,
  S,S,S,S,S,S,S,S,S,S,S,S,
];

const gameArea = new Area(PAW + 2, PAH + 2, [0, 0], 25);

gameArea.setGrid(tiles);
game.setCurrentArea(gameArea);
game.start();
