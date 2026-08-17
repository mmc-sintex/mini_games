const GAMES = [
  {
    id: "snake",
    icon: "🐍",
    name: "مارِ مسیرشکن",
    desc: "مار را هدایت کن و غذاها را جمع کن.",
    tag: "مهارتی"
  },
  {
    id: "mine",
    icon: "💣",
    name: "مین‌روب",
    desc: "مین‌ها را پیدا کن و منفجر نشو.",
    tag: "فکری"
  },
  {
    id: "echo",
    icon: "🔊",
    name: "اکوی رنگی",
    desc: "ترتیب رنگ‌ها را به خاطر بسپار.",
    tag: "حافظه"
  },
  {
    id: "orbit",
    icon: "🪐",
    name: "مدار فراری",
    desc: "در مدار حرکت کن و از موانع فرار کن.",
    tag: "واکنشی"
  },
  {
    id: "gravity",
    icon: "🧲",
    name: "جاذبه‌برگردان",
    desc: "با تغییر جاذبه از موانع عبور کن.",
    tag: "آرکید"
  },
  {
    id: "signal",
    icon: "📡",
    name: "سیگنال گمشده",
    desc: "سیگنال درست را پیدا کن.",
    tag: "دقت"
  },
  {
    id: "shadow",
    icon: "🌑",
    name: "سایه‌چین",
    desc: "شکل درست را پیدا کن.",
    tag: "پازل"
  },
  {
    id: "pulse",
    icon: "💓",
    name: "پالس",
    desc: "در لحظه‌ی مناسب ضربه بزن.",
    tag: "رکوردی"
  },
  {
    id: "switchGame",
    icon: "💡",
    name: "شبکه وارونه",
    desc: "همه‌ی چراغ‌ها را خاموش کن.",
    tag: "پازل"
  },
  {
    id: "dash",
    icon: "🏃",
    name: "دش",
    desc: "تا جایی که می‌توانی از موانع فرار کن.",
    tag: "آرکید"
  }
];

const $ = selector => document.querySelector(selector);

const home = $("#home");
const play = $("#play");
const gameArea = $("#game");
const gameGrid = $("#gameGrid");

let currentGame = null;
let timer = null;
let cleanup = () => {};


// ========================================
// ساخت منوی بازی‌ها
// ========================================

gameGrid.innerHTML = GAMES.map(game => `
  <article class="card" data-id="${game.id}">
    <div class="icon">${game.icon}</div>

    <h3>${game.name}</h3>

    <p>${game.desc}</p>

    <span class="tag">
      ${game.tag}
    </span>
  </article>
`).join("");


// ========================================
// کلیک روی بازی
// ========================================

gameGrid.addEventListener("click", event => {

  const card = event.target.closest(".card");

  if (!card) return;

  openGame(card.dataset.id);

});


// ========================================
// بازگشت
// ========================================

$("#back").onclick = () => {

  stopGame();

  play.classList.add("hidden");

  home.classList.remove("hidden");

};


// ========================================
// شروع دوباره
// ========================================

$("#restart").onclick = () => {

  if (currentGame) {
    startGame(currentGame);
  }

};


// ========================================
// مدیریت بازی
// ========================================

function openGame(id) {

  currentGame = id;

  home.classList.add("hidden");

  play.classList.remove("hidden");

  startGame(id);

}


function stopGame() {

  clearInterval(timer);
  clearTimeout(timer);

  timer = null;

  cleanup();

  cleanup = () => {};

  document.onkeydown = null;

  gameArea.innerHTML = "";

}


function startGame(id) {

  stopGame();

  const game = GAMES.find(g => g.id === id);

  $("#title").textContent =
    game.icon + " " + game.name;

  $("#description").textContent =
    game.desc;

  const gameFunctions = {

    snake,
    mine,
    echo,
    orbit,
    gravity,
    signal,
    shadow,
    pulse,
    switchGame,
    dash

  };

  if (gameFunctions[id]) {

    gameFunctions[id]();

  }

}


// ========================================
// ابزار Canvas
// ========================================

function createCanvas(width = 360, height = 360) {

  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  canvas.className = "canvas";

  gameArea.appendChild(canvas);

  return [
    canvas,
    canvas.getContext("2d")
  ];

}


// ========================================
// پیام
// ========================================

function message(text) {

  const p =
    document.createElement("p");

  p.className = "status";

  p.textContent = text;

  gameArea.appendChild(p);

}


// ========================================
// کنترل لمسی مار
// ========================================

function createSnakePad(callback) {

  const pad =
    document.createElement("div");

  pad.className = "pad";

  pad.innerHTML = `

    <div class="row">

      <button
        class="btn"
        data-direction="0,-1"
      >
        ↑
      </button>

    </div>

    <div class="row">

      <button
        class="btn"
        data-direction="-1,0"
      >
        ←
      </button>

      <button
        class="btn"
        data-direction="0,1"
      >
        ↓
      </button>

      <button
        class="btn"
        data-direction="1,0"
      >
        →
      </button>

    </div>

  `;

  gameArea.appendChild(pad);

  pad.onclick = event => {

    const button =
      event.target.closest("button");

    if (!button) return;

    const direction =
      button.dataset.direction
        .split(",")
        .map(Number);

    callback(direction);

  };

}


// ========================================
// بازی ۱ - مار
// ========================================

function snake() {

  const [canvas, ctx] =
    createCanvas();

  const size = 18;
  const cell = 20;

  let snakeBody = [
    [9, 9],
    [8, 9],
    [7, 9]
  ];

  let direction = [1, 0];

  let food = [
    4,
    4
  ];

  let score = 0;

  let gameOver = false;


  function createFood() {

    do {

      food = [
        Math.floor(Math.random() * size),
        Math.floor(Math.random() * size)
      ];

    } while (
      snakeBody.some(
        part =>
          part[0] === food[0] &&
          part[1] === food[1]
      )
    );

  }


  function draw() {

    ctx.fillStyle = "#070b15";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    // خطوط زمین

    ctx.strokeStyle = "#111c32";

    for (
      let i = 0;
      i <= canvas.width;
      i += cell
    ) {

      ctx.beginPath();

      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);

      ctx.stroke();

      ctx.beginPath();

      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);

      ctx.stroke();

    }


    // غذا

    ctx.fillStyle = "#ff5577";

    ctx.beginPath();

    ctx.arc(
      food[0] * cell + 10,
      food[1] * cell + 10,
      7,
      0,
      Math.PI * 2
    );

    ctx.fill();


    // مار

    snakeBody.forEach((part, index) => {

      ctx.fillStyle =
        index === 0
          ? "#ffffff"
          : "#61e6ad";

      ctx.fillRect(
        part[0] * cell + 1,
        part[1] * cell + 1,
        cell - 2,
        cell - 2
      );

    });


    ctx.fillStyle = "#ffffff";

    ctx.font = "14px Arial";

    ctx.fillText(
      "Score: " + score,
      10,
      18
    );

  }


  function update() {

    if (gameOver) return;

    const head = [

      snakeBody[0][0] + direction[0],

      snakeBody[0][1] + direction[1]

    ];


    const hitWall =
      head[0] < 0 ||
      head[1] < 0 ||
      head[0] >= size ||
      head[1] >= size;


    const hitBody =
      snakeBody.some(
        part =>
          part[0] === head[0] &&
          part[1] === head[1]
      );


    if (hitWall || hitBody) {

      gameOver = true;

      message(
        "💥 باختی! امتیاز: " + score
      );

      return;

    }


    snakeBody.unshift(head);


    if (
      head[0] === food[0] &&
      head[1] === food[1]
    ) {

      score++;

      createFood();

    } else {

      snakeBody.pop();

    }


    draw();

  }


  function changeDirection(newDirection) {

    if (
      newDirection[0] === -direction[0] &&
      newDirection[1] === -direction[1]
    ) {

      return;

    }

    direction = newDirection;

  }


  document.onkeydown = event => {

    const keys = {

      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0]

    };

    if (keys[event.key]) {

      changeDirection(
        keys[event.key]
      );

    }

  };


  createSnakePad(changeDirection);

  timer = setInterval(
    update,
    120
  );

  draw();

}


// ========================================
// بازی ۲ - مین روب
// ========================================

function mine() {

  const totalCells = 64;

  const mineCount = 10;

  const mines = new Set(
    [...Array(totalCells).keys()]
      .sort(() => Math.random() - 0.5)
      .slice(0, mineCount)
  );

  const opened = new Set();


  const grid =
    document.createElement("div");

  grid.className = "mine";

  gameArea.appendChild(grid);


  const status =
    document.createElement("p");

  status.className = "status";

  gameArea.appendChild(status);


  const buttons = [];


  for (
    let i = 0;
    i < totalCells;
    i++
  ) {

    const button =
      document.createElement("button");

    button.textContent = "";

    button.onclick = () => reveal(i);

    grid.appendChild(button);

    buttons.push(button);

  }


  status.textContent =
    "۱۰ مین در زمین پنهان شده.";


  function countMines(index) {

    const x = index % 8;

    const y = Math.floor(index / 8);

    let count = 0;


    for (
      let dy = -1;
      dy <= 1;
      dy++
    ) {

      for (
        let dx = -1;
        dx <= 1;
        dx++
      ) {

        if (
          dx === 0 &&
          dy === 0
        ) continue;


        const nx = x + dx;

        const ny = y + dy;


        if (
          nx >= 0 &&
          ny >= 0 &&
          nx < 8 &&
          ny < 8
        ) {

          const index2 =
            ny * 8 + nx;

          if (mines.has(index2)) {

            count++;

          }

        }

      }

    }


    return count;

  }


  function reveal(index) {

    if (opened.has(index)) return;

    opened.add(index);


    if (mines.has(index)) {

      buttons[index].textContent =
        "💣";

      status.textContent =
        "💥 باختی!";

      mines.forEach(mineIndex => {

        buttons[mineIndex].textContent =
          "💣";

      });

      return;

    }


    const count =
      countMines(index);

    buttons[index].textContent =
      count || "";

    buttons[index].style.background =
      "#18233e";


    if (count === 0) {

      const x = index % 8;

      const y = Math.floor(index / 8);


      for (
        let dy = -1;
        dy <= 1;
        dy++
      ) {

        for (
          let dx = -1;
          dx <= 1;
          dx++
        ) {

          const nx = x + dx;

          const ny = y + dy;


          if (
            nx >= 0 &&
            ny >= 0 &&
            nx < 8 &&
            ny < 8
          ) {

            reveal(
              ny * 8 + nx
            );

          }

        }

      }

    }


    if (
      opened.size ===
      totalCells - mineCount
    ) {

      status.textContent =
        "🎉 همه مین‌ها را پیدا کردی!";

    }

  }

}


// ========================================
// بازی ۳ - اکوی رنگی
// ========================================

function echo() {

  const colors = [
    "🔵",
    "🟢",
    "🟡",
    "🔴"
  ];


  let sequence = [];

  let level = 0;

  let playerIndex = 0;

  let locked = true;


  gameArea.innerHTML = `

    <p
      class="status"
      id="echoStatus"
    >
      آماده...
    </p>

    <div
      class="choices"
      id="echoChoices"
    ></div>

  `;


  const status =
    $("#echoStatus");

  const choices =
    $("#echoChoices");


  colors.forEach(
    (color, index) => {

      const button =
        document.createElement("button");

      button.className =
        "choice";

      button.textContent =
        color;


      button.onclick = () => {

        if (locked) return;

        if (
          index !==
          sequence[playerIndex]
        ) {

          status.textContent =
            "❌ اشتباه! رسیدی به مرحله " +
            level;

          locked = true;

          return;

        }


        playerIndex++;


        if (
          playerIndex ===
          sequence.length
        ) {

          locked = true;

          setTimeout(
            nextRound,
            500
          );

        }

      };


      choices.appendChild(button);

    }
  );


  function nextRound() {

    level++;

    playerIndex = 0;

    sequence.push(
      Math.floor(
        Math.random() *
        colors.length
      )
    );


    status.textContent =
      "مرحله " + level;


    locked = true;


    sequence.forEach(
      (value, index) => {

        setTimeout(() => {

          const buttons =
            choices.querySelectorAll(
              "button"
            );

          const button =
            buttons[value];

          button.animate(
            [
              {
                transform:
                  "scale(1)"
              },
              {
                transform:
                  "scale(1.35)"
              },
              {
                transform:
                  "scale(1)"
              }
            ],
            {
              duration: 350
            }
          );


        }, index * 500);

      }
    );


    setTimeout(() => {

      locked = false;

    }, sequence.length * 500 + 300);

  }


  nextRound();

}


// ========================================
// بازی ۴ - مدار فراری
// ========================================

function orbit() {

  const [canvas, ctx] =
    createCanvas();

  let angle = 0;

  let score = 0;

  let obstacles = [];

  let dead = false;

  let lastTime = 0;


  canvas.onclick = () => {

    angle += 0.9;

  };


  function loop(time) {

    if (dead) return;


    const delta =
      (time - lastTime) / 1000;

    lastTime = time;


    angle +=
      delta * 2.3;


    if (
      Math.random() <
      delta * 0.9
    ) {

      obstacles.push({

        angle:
          Math.random() *
          Math.PI *
          2,

        radius: 390

      });

    }


    obstacles.forEach(
      obstacle => {

        obstacle.radius -=
          100 * delta;

      }
    );


    obstacles =
      obstacles.filter(
        obstacle =>
          obstacle.radius > 20
      );


    ctx.fillStyle =
      "#080d1c";

    ctx.fillRect(
      0,
      0,
      360,
      360
    );


    // مدار

    ctx.strokeStyle =
      "#33456e";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
      180,
      180,
      70,
      0,
      Math.PI * 2
    );

    ctx.stroke();


    // مرکز

    ctx.fillStyle =
      "#ffd166";

    ctx.beginPath();

    ctx.arc(
      180,
      180,
      15,
      0,
      Math.PI * 2
    );

    ctx.fill();


    // بازیکن

    const playerX =
      180 +
      Math.cos(angle) * 70;

    const playerY =
      180 +
      Math.sin(angle) * 70;


    ctx.fillStyle =
      "#62e6ae";

    ctx.beginPath();

    ctx.arc(
      playerX,
      playerY,
      9,
      0,
      Math.PI * 2
    );

    ctx.fill();


    // موانع

    obstacles.forEach(
      obstacle => {

        const x =
          180 +
          Math.cos(
            obstacle.angle
          ) *
          obstacle.radius;

        const y =
          180 +
          Math.sin(
            obstacle.angle
          ) *
          obstacle.radius;


        ctx.fillStyle =
          "#ff5577";

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          7,
          0,
          Math.PI * 2
        );

        ctx.fill();


        if (
          Math.hypot(
            x - playerX,
            y - playerY
          ) < 16
        ) {

          dead = true;

          message(
            "💥 برخورد! امتیاز: " +
            score.toFixed(1)
          );

        }

      }
    );


    score += delta;


    ctx.fillStyle =
      "#ffffff";

    ctx.font =
      "14px Arial";

    ctx.fillText(
      "Score: " +
      score.toFixed(1),
      10,
      20
    );


    if (!dead) {

      requestAnimationFrame(loop);

    }

  }


  requestAnimationFrame(loop);


  cleanup = () => {

    dead = true;

  };

}


// ========================================
// بازی ۵ - جاذبه برگردان
// ========================================

function gravity() {

  const [canvas, ctx] =
    createCanvas();


  let y = 180;

  let velocity = 0;

  let gravityForce = 0.55;

  let dead = false;

  let obstacles = [

    {
      x: 360,
      height: 80,
      top: false
    },

    {
      x: 560,
      height: 110,
      top: true
    }

  ];


  function flipGravity() {

    gravityForce =
      -gravityForce;

    velocity =
      gravityForce > 0
        ? 7
        : -7;

  }


  canvas.onclick =
    flipGravity;


  document.onkeydown =
    event => {

      if (
        event.code ===
        "Space"
      ) {

        flipGravity();

      }

    };


  function loop() {

    if (dead) return;


    velocity +=
      gravityForce;

    y += velocity;


    if (Math.random() < 0.025) {

      obstacles.push({

        x: 500,

        height:
          50 +
          Math.random() * 100,

        top:
          Math.random() < 0.5

      });

    }


    obstacles.forEach(
      obstacle => {

        obstacle.x -= 3;

      }
    );


    obstacles =
      obstacles.filter(
        obstacle =>
          obstacle.x > -50
      );


    ctx.fillStyle =
      "#080d1c";

    ctx.fillRect(
      0,
      0,
      360,
      360
    );


    // بازیکن

    ctx.fillStyle =
      "#62e6ae";

    ctx.fillRect(
      55,
      y,
      24,
      24
    );


    // موانع

    ctx.fillStyle =
      "#ff5577";


    obstacles.forEach(
      obstacle => {

        if (obstacle.top) {

          ctx.fillRect(
            obstacle.x,
            0,
            30,
            obstacle.height
          );

        } else {

          ctx.fillRect(
            obstacle.x,
            360 -
              obstacle.height,
            30,
            obstacle.height
          );

        }


        const collisionX =
          55 + 24 >
            obstacle.x &&
          55 <
            obstacle.x + 30;


        const collisionY =
          obstacle.top
            ? y < obstacle.height
            : y + 24 >
              360 -
                obstacle.height;


        if (
          collisionX &&
          collisionY
        ) {

          dead = true;

        }

      }
    );


    if (
      y < 0 ||
      y > 360
    ) {

      dead = true;

    }


    if (dead) {

      message(
        "💥 بازی تمام شد!"
      );

      return;

    }


    requestAnimationFrame(loop);

  }


  requestAnimationFrame(loop);


  cleanup = () => {

    dead = true;

  };

}


// ========================================
// بازی ۶ - سیگنال گمشده
// ========================================

function signal() {

  const symbols = [
    "△",
    "○",
    "□",
    "☆",
    "◇",
    "✦"
  ];


  let target =
    Math.floor(
      Math.random() *
      symbols.length
    );


  let score = 0;


  gameArea.innerHTML = `

    <div
      class="number"
      id="signalTarget"
    ></div>

    <p class="status">
      همان علامت را انتخاب کن
    </p>

    <div
      class="choices"
      id="signalChoices"
    ></div>

  `;


  const targetElement =
    $("#signalTarget");

  const choices =
    $("#signalChoices");


  function createRound() {

    target =
      Math.floor(
        Math.random() *
        symbols.length
      );


    targetElement.textContent =
      symbols[target];


    choices.innerHTML = "";


    let list = [
      target
    ];


    while (
      list.length < 6
    ) {

      const random =
        Math.floor(
          Math.random() *
          symbols.length
        );


      if (
        !list.includes(random)
      ) {

        list.push(random);

      }

    }


    list.sort(
      () =>
        Math.random() - 0.5
    );


    list.forEach(index => {

      const button =
        document.createElement(
          "button"
        );

      button.className =
        "choice";

      button.textContent =
        symbols[index];


      button.onclick = () => {

        if (
          index === target
        ) {

          score++;

          createRound();

        } else {

          message(
            "❌ اشتباه! امتیاز: " +
            score
          );

        }

      };


      choices.appendChild(
        button
      );

    });

  }


  createRound();

}


// ========================================
// بازی ۷ - سایه چین
// ========================================

function shadow() {

  const shapes = [
    "◼",
    "◻",
    "◆",
    "◇"
  ];


  let target =
    shapes[
      Math.floor(
        Math.random() *
        shapes.length
      )
    ];


  let rotation = 0;


  gameArea.innerHTML = `

    <div
      class="number"
      id="shadowTarget"
    >
      ${target}
    </div>

    <p class="status">
      قطعه را بچرخان تا شکل درست شود.
    </p>

    <button
      class="primary big"
      id="shadowButton"
    >
      چرخش ↻
    </button>

    <p
      class="status"
      id="shadowResult"
    ></p>

  `;


  const button =
    $("#shadowButton");

  const result =
    $("#shadowResult");


  button.onclick = () => {

    rotation++;

    const index =
      (
        shapes.indexOf(target) +
        rotation
      ) %
      shapes.length;


    if (
      shapes[index] ===
      target
    ) {

      result.textContent =
        "🎉 درست شد!";

      button.disabled = true;

    } else {

      result.textContent =
        "هنوز درست نشده...";

    }

  };

}


// ========================================
// بازی ۸ - پالس
// ========================================

function pulse() {

  const button =
    document.createElement(
      "button"
    );

  button.className =
    "primary big";

  button.textContent =
    "صبر کن...";

  gameArea.appendChild(
    button
  );


  let active = false;

  let startTime = 0;

  let round = 0;


  function prepare() {

    active = false;

    button.textContent =
      "صبر کن...";


    timer = setTimeout(
      () => {

        active = true;

        startTime =
          performance.now();

        button.textContent =
          "الان بزن! ⚡";

      },

      800 +
      Math.random() * 1800
    );

  }


  button.onclick = () => {

    if (!active) {

      clearTimeout(timer);

      button.textContent =
        "❌ زود زدی!";

      setTimeout(
        prepare,
        800
      );

      return;

    }


    const reaction =
      Math.round(
        performance.now() -
        startTime
      );


    round++;


    button.textContent =
      reaction +
      " ms — دور " +
      round;


    active = false;


    setTimeout(
      prepare,
      700
    );

  };


  prepare();

}


// ========================================
// بازی ۹ - شبکه وارونه
// ========================================

function switchGame() {

  const board =
    document.createElement(
      "div"
    );


  board.style.display =
    "grid";

  board.style.gridTemplateColumns =
    "repeat(5, 45px)";

  board.style.gap =
    "5px";


  gameArea.appendChild(
    board
  );


  const status =
    document.createElement(
      "p"
    );

  status.className =
    "status";

  status.textContent =
    "همه چراغ‌ها را خاموش کن.";

  gameArea.appendChild(
    status
  );


  const cells =
    Array(25).fill(false);


  const buttons = [];


  function draw() {

    buttons.forEach(
      (button, index) => {

        button.textContent =
          cells[index]
            ? "💡"
            : "·";

      }
    );


    if (
      cells.every(
        value => !value
      )
    ) {

      status.textContent =
        "🎉 بردی!";

    }

  }


  function toggle(index) {

    const x =
      index % 5;

    const y =
      Math.floor(index / 5);


    const positions = [

      [0, 0],

      [1, 0],

      [-1, 0],

      [0, 1],

      [0, -1]

    ];


    positions.forEach(
      ([dx, dy]) => {

        const nx =
          x + dx;

        const ny =
          y + dy;


        if (
          nx >= 0 &&
          ny >= 0 &&
          nx < 5 &&
          ny < 5
        ) {

          const target =
            ny * 5 + nx;

          cells[target] =
            !cells[target];

        }

      }
    );


    draw();

  }


  for (
    let i = 0;
    i < 25;
    i++
  ) {

    const button =
      document.createElement(
        "button"
      );

    button.className =
      "choice";

    button.style.padding =
      "0";

    button.style.width =
      "45px";

    button.style.height =
      "45px";


    button.onclick =
      () => toggle(i);


    buttons.push(button);

    board.appendChild(
      button
    );

  }


  // ساخت پازل اولیه

  for (
    let i = 0;
    i < 12;
    i++
  ) {

    toggle(
      Math.floor(
        Math.random() * 25
      )
    );

  }


  draw();

}


// ========================================
// بازی ۱۰ - دش
// ========================================

function dash() {

  const [canvas, ctx] =
    createCanvas();


  let playerY = 310;

  let velocity = 0;

  let obstacles = [];

  let score = 0;

  let dead = false;

  let lastTime = 0;


  function jump() {

    if (
      playerY >= 309
    ) {

      velocity = -430;

    }

  }


  canvas.onclick = jump;


  document.onkeydown =
    event => {

      if (
        event.code ===
        "Space"
      ) {

        jump();

      }

    };


  function loop(time) {

    if (dead) return;


    const delta =
      Math.min(
        0.03,
        (time - lastTime) /
          1000 || 0.016
      );


    lastTime = time;


    velocity +=
      1100 * delta;


    playerY +=
      velocity * delta;


    if (
      playerY > 310
    ) {

      playerY = 310;

      velocity = 0;

    }


    if (
      Math.random() <
      delta * 0.9
    ) {

      obstacles.push({

        x: 370,

        height:
          25 +
          Math.random() * 55

      });

    }


    obstacles.forEach(
      obstacle => {

        obstacle.x -=
          230 * delta;

      }
    );


    obstacles =
      obstacles.filter(
        obstacle =>
          obstacle.x > -40
      );


    ctx.fillStyle =
      "#080d1c";

    ctx.fillRect(
      0,
      0,
      360,
      360
    );


    // زمین

    ctx.fillStyle =
      "#26365c";

    ctx.fillRect(
      0,
      335,
      360,
      25
    );


    // بازیکن

    ctx.fillStyle =
      "#62e6ae";

    ctx.fillRect(
      55,
      playerY,
      25,
      25
    );


    // موانع

    ctx.fillStyle =
      "#ff5577";


    obstacles.forEach(
      obstacle => {

        ctx.fillRect(
          obstacle.x,
          335 -
            obstacle.height,
          22,
          obstacle.height
        );


        const collisionX =
          55 + 25 >
            obstacle.x &&
          55 <
            obstacle.x + 22;


        const collisionY =
          playerY + 25 >
          335 -
            obstacle.height;


        if (
          collisionX &&
          collisionY
        ) {

          dead = true;

        }

      }
    );


    score += delta;


    ctx.fillStyle =
      "#ffffff";

    ctx.font =
      "14px Arial";

    ctx.fillText(
      "Score: " +
      score.toFixed(1),
      10,
      20
    );


    if (dead) {

      message(
        "💥 برخورد! رکورد: " +
        score.toFixed(1) +
        " ثانیه"
      );

      return;

    }


    requestAnimationFrame(
      loop
    );

  }


  requestAnimationFrame(
    loop
  );


  cleanup = () => {

    dead = true;

  };

}
