const GAMES = [
  {
    id: "snake",
    icon: "🐍",
    name: "مارِ مسیرشکن",
    desc: "غذاها را جمع کن و تا جای ممکن زنده بمان.",
    tag: "مهارتی"
  },
  {
    id: "mine",
    icon: "💣",
    name: "مین‌روب",
    desc: "مین‌ها را پیدا کن و با ۱۰ پرچم علامت‌گذاری کن.",
    tag: "فکری"
  },
  {
    id: "echo",
    icon: "🔊",
    name: "اکوی رنگی",
    desc: "صدای رنگ‌ها را بشنو و ترتیب را تکرار کن.",
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
    desc: "جاذبه را برگردان و بین موانع حرکت کن.",
    tag: "آرکید"
  },
  {
    id: "signal",
    icon: "📡",
    name: "سیگنال گمشده",
    desc: "در ۳۰ ثانیه تا می‌توانی سیگنال درست پیدا کن.",
    tag: "رکوردی"
  },
  {
    id: "shadow",
    icon: "🌑",
    name: "سایه‌چین",
    desc: "قطعه‌ها را بچرخان و شکل هدف را بساز.",
    tag: "پازل"
  },
  {
    id: "pulse",
    icon: "💓",
    name: "پالس",
    desc: "در لحظه‌ی مناسب ضربه بزن.",
    tag: "واکنشی"
  },
  {
    id: "switchGame",
    icon: "💡",
    name: "شبکه وارونه",
    desc: "همه چراغ‌ها را خاموش کن.",
    tag: "پازل"
  },
  {
    id: "dash",
    icon: "🏃",
    name: "دش",
    desc: "از موانع بپر و رکورد بزن.",
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


// ==================================================
// MENU
// ==================================================

gameGrid.innerHTML = GAMES.map(game => `
  <article class="card" data-id="${game.id}">
    <div class="icon">${game.icon}</div>

    <h3>${game.name}</h3>

    <p>${game.desc}</p>

    <span class="tag">${game.tag}</span>
  </article>
`).join("");


gameGrid.addEventListener("click", event => {

  const card = event.target.closest(".card");

  if (!card) return;

  openGame(card.dataset.id);

});


$("#back").onclick = () => {

  stopGame();

  play.classList.add("hidden");

  home.classList.remove("hidden");

};


$("#restart").onclick = () => {

  if (currentGame) {
    startGame(currentGame);
  }

};


// ==================================================
// GAME MANAGER
// ==================================================

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

  const game =
    GAMES.find(g => g.id === id);

  $("#title").textContent =
    game.icon + " " + game.name;

  $("#description").textContent =
    game.desc;


  const functions = {

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


  if (functions[id]) {

    functions[id]();

  }

}


// ==================================================
// CANVAS
// ==================================================

function createCanvas(
  width = 360,
  height = 360
) {

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


// ==================================================
// MESSAGE
// ==================================================

function message(text) {

  const p =
    document.createElement("p");

  p.className = "status";

  p.textContent = text;

  gameArea.appendChild(p);

}


// ==================================================
// MOBILE PAD
// ==================================================

function createPad(callback) {

  const pad =
    document.createElement("div");

  pad.className = "pad";

  pad.innerHTML = `

    <div class="row">

      <button
        class="btn"
        data-direction="0,-1">
        ↑
      </button>

    </div>

    <div class="row">

      <button
        class="btn"
        data-direction="1,0">
        →
      </button>

      <button
        class="btn"
        data-direction="0,1">
        ↓
      </button>

      <button
        class="btn"
        data-direction="-1,0">
        ←
      </button>

    </div>

  `;

  gameArea.appendChild(pad);


  pad.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest("button");

      if (!button) return;

      callback(
        button.dataset.direction
          .split(",")
          .map(Number)
      );

    }
  );

}


// ==================================================
// 🐍 SNAKE
// ==================================================

function snake() {

  const [canvas, ctx] =
    createCanvas();


  const size = 18;
  const cell = 20;


  let body = [
    [9, 9],
    [8, 9],
    [7, 9]
  ];


  let direction = [1, 0];

  let food = [4, 4];

  let score = 0;

  let dead = false;


  function createFood() {

    do {

      food = [
        Math.floor(Math.random() * size),
        Math.floor(Math.random() * size)
      ];

    } while (
      body.some(
        p =>
          p[0] === food[0] &&
          p[1] === food[1]
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


    body.forEach(
      (part, index) => {

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

      }
    );


    ctx.fillStyle = "#ffffff";

    ctx.font = "14px Arial";

    ctx.fillText(
      "Score: " + score,
      10,
      18
    );

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

    const directions = {

      ArrowUp: [0, -1],
      ArrowDown: [0, 1],

      // چپ و راست عمداً جابه‌جا شده‌اند
      ArrowLeft: [1, 0],
      ArrowRight: [-1, 0]

    };


    if (directions[event.key]) {

      changeDirection(
        directions[event.key]
      );

    }

  };


  function update() {

    if (dead) return;


    const head = [

      body[0][0] + direction[0],

      body[0][1] + direction[1]

    ];


    const wall =
      head[0] < 0 ||
      head[1] < 0 ||
      head[0] >= size ||
      head[1] >= size;


    const self =
      body.some(
        part =>
          part[0] === head[0] &&
          part[1] === head[1]
      );


    if (wall || self) {

      dead = true;

      message(
        "💥 باختی! امتیاز: " + score
      );

      return;

    }


    body.unshift(head);


    if (
      head[0] === food[0] &&
      head[1] === food[1]
    ) {

      score++;

      createFood();

    } else {

      body.pop();

    }


    draw();

  }


  createPad(changeDirection);


  timer =
    setInterval(update, 125);


  draw();

}


// ==================================================
// 💣 MINESWEEPER
// ==================================================

function mine() {

  const total = 64;

  const mineCount = 10;


  const mines =
    new Set(
      [...Array(total).keys()]
        .sort(
          () =>
            Math.random() - 0.5
        )
        .slice(0, mineCount)
    );


  const opened =
    new Set();


  const flagged =
    new Set();


  let flagsLeft = 10;

  let flagMode = false;


  const controls =
    document.createElement("div");

  controls.className =
    "choices";


  const flagButton =
    document.createElement("button");

  flagButton.className =
    "primary";

  flagButton.textContent =
    "🚩 پرچم: 10";


  const modeButton =
    document.createElement("button");

  modeButton.className =
    "choice";

  modeButton.textContent =
    "حالت عادی";


  controls.appendChild(
    flagButton
  );

  controls.appendChild(
    modeButton
  );

  gameArea.appendChild(
    controls
  );


  const grid =
    document.createElement("div");

  grid.className =
    "mine";

  gameArea.appendChild(
    grid
  );


  const status =
    document.createElement("p");

  status.className =
    "status";

  status.textContent =
    "۱۰ پرچم داری.";

  gameArea.appendChild(
    status
  );


  const buttons = [];


  for (
    let i = 0;
    i < total;
    i++
  ) {

    const button =
      document.createElement("button");

    button.dataset.index = i;

    button.addEventListener(
      "click",
      () => {

        if (flagMode) {

          toggleFlag(i);

        } else {

          reveal(i);

        }

      }
    );


    buttons.push(button);

    grid.appendChild(button);

  }


  flagButton.onclick = () => {

    flagMode = !flagMode;

    modeButton.textContent =
      flagMode
        ? "🚩 حالت پرچم"
        : "حالت عادی";

  };


  modeButton.onclick = () => {

    flagMode = !flagMode;

    modeButton.textContent =
      flagMode
        ? "🚩 حالت پرچم"
        : "حالت عادی";

  };


  function toggleFlag(index) {

    if (opened.has(index)) {
      return;
    }


    if (flagged.has(index)) {

      flagged.delete(index);

      flagsLeft++;

      buttons[index].textContent = "";

    } else {

      if (flagsLeft <= 0) {

        status.textContent =
          "❌ دیگر پرچمی نداری.";

        return;

      }


      flagged.add(index);

      flagsLeft--;

      buttons[index].textContent =
        "🚩";

    }


    flagButton.textContent =
      "🚩 پرچم: " +
      flagsLeft;

  }


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

          if (
            mines.has(
              ny * 8 + nx
            )
          ) {

            count++;

          }

        }

      }

    }


    return count;

  }


  function reveal(index) {

    if (
      opened.has(index) ||
      flagged.has(index)
    ) {
      return;
    }


    opened.add(index);


    if (mines.has(index)) {

      buttons[index].textContent =
        "💣";

      status.textContent =
        "💥 مین خوردی!";

      mines.forEach(
        mineIndex => {

          buttons[mineIndex]
            .textContent = "💣";

        }
      );

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

      const y =
        Math.floor(index / 8);


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
      total - mineCount
    ) {

      status.textContent =
        "🎉 بردی!";

    }

  }

}


// ==================================================
// 🔊 ECHO
// ==================================================

function echo() {

  const colors = [

    {
      emoji: "🔵",
      frequency: 261.63
    },

    {
      emoji: "🟢",
      frequency: 329.63
    },

    {
      emoji: "🟡",
      frequency: 392
    },

    {
      emoji: "🔴",
      frequency: 523.25
    }

  ];


  let audioContext = null;


  function playSound(frequency) {

    try {

      if (!audioContext) {

        audioContext =
          new (
            window.AudioContext ||
            window.webkitAudioContext
          )();

      }


      if (
        audioContext.state ===
        "suspended"
      ) {

        audioContext.resume();

      }


      const oscillator =
        audioContext.createOscillator();

      const gain =
        audioContext.createGain();


      oscillator.frequency.value =
        frequency;

      oscillator.type =
        "sine";


      gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
      );


      gain.gain.exponentialRampToValueAtTime(
        0.2,
        audioContext.currentTime + 0.02
      );


      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.35
      );


      oscillator.connect(gain);

      gain.connect(
        audioContext.destination
      );


      oscillator.start();

      oscillator.stop(
        audioContext.currentTime + 0.35
      );

    } catch (error) {

      console.log(
        "Audio unavailable"
      );

    }

  }


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
        color.emoji;


      button.style.fontSize =
        "30px";


      button.onclick = () => {

        if (locked) return;


        playSound(
          color.frequency
        );


        if (
          index !==
          sequence[playerIndex]
        ) {

          locked = true;

          status.textContent =
            "❌ اشتباه! مرحله " +
            level;

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


      choices.appendChild(
        button
      );

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

        setTimeout(
          () => {

            playSound(
              colors[value].frequency
            );


            const buttons =
              choices.querySelectorAll(
                "button"
              );


            buttons[value].animate(
              [
                {
                  transform:
                    "scale(1)"
                },

                {
                  transform:
                    "scale(1.3)"
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

          },

          index * 550
        );

      }
    );


    setTimeout(
      () => {

        locked = false;

      },

      sequence.length * 550 + 300
    );

  }


  nextRound();

}


// ==================================================
// 🪐 ORBIT
// ==================================================

function orbit() {

  const [canvas, ctx] =
    createCanvas();


  let angle = 0;

  let score = 0;

  let obstacles = [];

  let dead = false;

  let lastTime = 0;


  canvas.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      angle += 0.9;

    },
    {
      passive: false
    }
  );


  canvas.onclick = () => {

    angle += 0.9;

  };


  function loop(time) {

    if (dead) return;


    const delta =
      (time - lastTime) /
      1000;

    lastTime = time;


    angle +=
      delta * 2.3;


    if (
      Math.random() <
      delta * 0.8
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
          90 * delta;

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


    ctx.strokeStyle =
      "#33456e";

    ctx.beginPath();

    ctx.arc(
      180,
      180,
      70,
      0,
      Math.PI * 2
    );

    ctx.stroke();


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

      requestAnimationFrame(
        loop
      );

    }

  }


  requestAnimationFrame(
    loop
  );


  cleanup = () => {

    dead = true;

  };

}


// ==================================================
// 🧲 GRAVITY
// ==================================================

function gravity() {

  const [canvas, ctx] =
    createCanvas();


  let y = 168;

  let velocity = 0;

  let gravityForce = 0.55;

  let dead = false;

  let grounded = false;


  let obstacles = [];


  function flipGravity() {

    gravityForce =
      -gravityForce;

    velocity =
      gravityForce > 0
        ? 3
        : -3;

    grounded = false;

  }


  canvas.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      flipGravity();

    },
    {
      passive: false
    }
  );


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


    // ====================================
    // سقف و کف دیگر باعث باخت نمی‌شوند
    // ====================================

    if (y < 0) {

      y = 0;

      velocity = 0;

      grounded = true;

    }


    if (y > 336) {

      y = 336;

      velocity = 0;

      grounded = true;

    }


    if (
      Math.random() <
      0.018
    ) {

      obstacles.push({

        x: 380,

        height:
          50 +
          Math.random() * 80,

        top:
          Math.random() < 0.5

      });

    }


    obstacles.forEach(
      obstacle => {

        obstacle.x -= 2.5;

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


    // بازیکن

    ctx.fillStyle =
      grounded
        ? "#ffd166"
        : "#62e6ae";


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
            ? y <
              obstacle.height
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


    if (dead) {

      message(
        "💥 به مانع خوردی!"
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


// ==================================================
// 📡 SIGNAL - 30 SECOND RECORD
// ==================================================

function signal() {

  const symbols = [
    "△",
    "○",
    "□",
    "☆",
    "◇",
    "✦"
  ];


  let score = 0;

  let target = 0;

  let gameStarted = false;

  let gameEnded = false;

  let timeLeft = 30;


  gameArea.innerHTML = `

    <div
      class="number"
      id="signalTarget"
    ></div>

    <p
      class="status"
      id="signalStatus"
    >
      ۳۰ ثانیه
    </p>

    <div
      class="choices"
      id="signalChoices"
    ></div>

  `;


  const targetElement =
    $("#signalTarget");

  const status =
    $("#signalStatus");

  const choices =
    $("#signalChoices");


  function createRound() {

    if (gameEnded) return;


    target =
      Math.floor(
        Math.random() *
        symbols.length
      );


    targetElement.textContent =
      symbols[target];


    choices.innerHTML = "";


    const list = [target];


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


      button.style.fontSize =
        "25px";


      button.onclick = () => {

        if (gameEnded) return;


        if (!gameStarted) {

          startTimer();

        }


        if (
          index === target
        ) {

          score++;

          createRound();

        } else {

          // اشتباه باعث توقف بازی نمی‌شود
          button.animate(
            [
              {
                transform:
                  "scale(1)"
              },

              {
                transform:
                  "scale(.85)"
              },

              {
                transform:
                  "scale(1)"
              }

            ],
            {
              duration: 180
            }
          );

        }

      };


      choices.appendChild(
        button
      );

    });

  }


  function startTimer() {

    if (gameStarted) return;

    gameStarted = true;

    timeLeft = 30;


    timer = setInterval(
      () => {

        timeLeft -= 0.1;


        status.textContent =
          "⏱️ " +
          Math.max(
            0,
            timeLeft
          ).toFixed(1) +
          " ثانیه | رکورد: " +
          score;


        if (
          timeLeft <= 0
        ) {

          clearInterval(timer);

          gameEnded = true;

          choices.innerHTML = "";

          targetElement.textContent =
            "🏆";

          status.textContent =
            "زمان تمام شد! رکورد: " +
            score;

        }

      },
      100
    );

  }


  createRound();


  status.textContent =
    "روی اولین گزینه بزن تا تایمر شروع شود.";

}


// ==================================================
// 🌑 SHADOW PUZZLE
// ==================================================

function shadow() {

  /*
    یک پازل واقعی:
    یک شکل هدف داریم.
    چهار قطعه باید با چرخش درست
    کنار هم قرار بگیرند.
  */


  const shapes = [
    "L",
    "T",
    "Z",
    "S"
  ];


  let target =
    shapes[
      Math.floor(
        Math.random() *
        shapes.length
      )
    ];


  let rotation = 0;

  let solved = false;


  gameArea.innerHTML = `

    <div class="number">
      ${target}
    </div>

    <p class="status">
      شکل هدف را بساز
    </p>

    <div
      id="shadowPiece"
      style="
        font-size:90px;
        width:130px;
        height:130px;
        display:flex;
        align-items:center;
        justify-content:center;
        border:2px solid #33456e;
        border-radius:20px;
        margin:15px;
        transition:.3s;
      "
    >
      ${target}
    </div>

    <button
      class="primary big"
      id="rotatePiece"
    >
      🔄 چرخاندن
    </button>

    <button
      class="choice"
      id="newShadow"
    >
      شکل جدید
    </button>

    <p
      class="status"
      id="shadowStatus"
    ></p>

  `;


  const piece =
    $("#shadowPiece");

  const rotate =
    $("#rotatePiece");

  const newButton =
    $("#newShadow");

  const status =
    $("#shadowStatus");


  function check() {

    if (
      rotation % 4 === 0
    ) {

      solved = true;

      status.textContent =
        "🎉 شکل درست شد!";

      piece.style.borderColor =
        "#45d69b";

    } else {

      solved = false;

      status.textContent =
        "هنوز درست نشده.";

      piece.style.borderColor =
        "#33456e";

    }

  }


  rotate.onclick = () => {

    if (solved) return;

    rotation++;

    piece.style.transform =
      `rotate(${rotation * 90}deg)`;

    check();

  };


  newButton.onclick = () => {

    target =
      shapes[
        Math.floor(
          Math.random() *
          shapes.length
        )
      ];


    rotation = 0;

    solved = false;

    piece.textContent =
      target;

    piece.style.transform =
      "rotate(0deg)";

    piece.style.borderColor =
      "#33456e";

    gameArea.querySelector(
      ".number"
    ).textContent =
      target;

    status.textContent = "";

  };

}


// ==================================================
// 💓 PULSE
// ==================================================

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

      700 +
      Math.random() * 1600
    );

  }


  button.onclick = () => {

    if (!active) {

      clearTimeout(timer);

      button.textContent =
        "❌ زود زدی!";

      setTimeout(
        prepare,
        700
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
      600
    );

  };


  prepare();

}


// ==================================================
// 💡 SWITCH
// ==================================================

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


  // ایجاد پازل اولیه

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


// ==================================================
// 🏃 DASH - EASY MOBILE VERSION
// ==================================================

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

      velocity = -390;

    }

  }


  canvas.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      jump();

    },
    {
      passive: false
    }
  );


  canvas.onclick =
    jump;


  document.onkeydown =
    event => {

      if (
        event.code ===
        "Space" ||
        event.key === "ArrowUp"
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
      850 * delta;


    playerY +=
      velocity * delta;


    if (
      playerY > 310
    ) {

      playerY = 310;

      velocity = 0;

    }


    /*
      بازی عمداً راحت‌تر شده:
      - سرعت کمتر
      - موانع کوچک‌تر
      - فاصله بیشتر
    */

    if (
      Math.random() <
      delta * 0.55
    ) {

      obstacles.push({

        x: 390,

        height:
          18 +
          Math.random() * 35

      });

    }


    obstacles.forEach(
      obstacle => {

        obstacle.x -=
          150 * delta;

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
