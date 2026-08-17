// ======================================================
// MINI GAME COLLECTION
// Mobile First - Pure JavaScript
// ======================================================

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
    name: "جاذبه‌گردان",
    desc: "جاذبه را عوض کن و از موانع عبور کن.",
    tag: "آرکید"
  },

  {
    id: "signal",
    icon: "📡",
    name: "سیگنال گمشده",
    desc: "در ۳۰ ثانیه بیشترین سیگنال را پیدا کن.",
    tag: "رکوردی"
  },

  {
    id: "bridge",
    icon: "🌈",
    name: "پل رنگی",
    desc: "خانه‌های درست را به ترتیب پیدا کن.",
    tag: "پازل"
  },

  {
    id: "pulse",
    icon: "💓",
    name: "پالس",
    desc: "در لحظه مناسب ضربه بزن.",
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
    id: "lightHunter",
    icon: "✨",
    name: "شکارچی نور",
    desc: "نورها را جمع کن و از موانع فرار کن.",
    tag: "آرکید"
  }

];


// ======================================================
// ELEMENTS
// ======================================================

const $ = selector =>
  document.querySelector(selector);

const home =
  $("#home");

const play =
  $("#play");

const gameArea =
  $("#game");

const gameGrid =
  $("#gameGrid");


let currentGame = null;

let timer = null;

let cleanup = () => {};


// ======================================================
// MENU
// ======================================================

gameGrid.innerHTML =
  GAMES.map(game => `

    <article
      class="card"
      data-id="${game.id}"
    >

      <div class="icon">
        ${game.icon}
      </div>

      <h3>
        ${game.name}
      </h3>

      <p>
        ${game.desc}
      </p>

      <span class="tag">
        ${game.tag}
      </span>

    </article>

  `).join("");


gameGrid.addEventListener(
  "click",
  event => {

    const card =
      event.target.closest(".card");

    if (!card) return;

    openGame(
      card.dataset.id
    );

  }
);


// ======================================================
// BACK
// ======================================================

$("#back").onclick = () => {

  stopGame();

  play.classList.add("hidden");

  home.classList.remove("hidden");

};


// ======================================================
// RESTART
// ======================================================

$("#restart").onclick = () => {

  if (currentGame) {

    startGame(
      currentGame
    );

  }

};


// ======================================================
// OPEN GAME
// ======================================================

function openGame(id) {

  currentGame = id;

  home.classList.add(
    "hidden"
  );

  play.classList.remove(
    "hidden"
  );

  startGame(id);

}


// ======================================================
// STOP GAME
// ======================================================

function stopGame() {

  clearInterval(timer);

  clearTimeout(timer);

  timer = null;

  cleanup();

  cleanup = () => {};

  document.onkeydown = null;

  gameArea.innerHTML = "";

}


// ======================================================
// START GAME
// ======================================================

function startGame(id) {

  stopGame();

  const game =
    GAMES.find(
      g => g.id === id
    );

  if (!game) return;

  $("#title").textContent =
    game.icon +
    " " +
    game.name;

  $("#description").textContent =
    game.desc;


  const games = {

    snake,

    mine,

    echo,

    orbit,

    gravity,

    signal,

    bridge,

    pulse,

    switchGame,

    lightHunter

  };


  if (games[id]) {

    games[id]();

  }

}


// ======================================================
// CANVAS
// ======================================================

function createCanvas(
  width = 360,
  height = 360
) {

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    width;

  canvas.height =
    height;

  canvas.className =
    "canvas";

  canvas.style.maxWidth =
    "100%";

  canvas.style.height =
    "auto";

  canvas.style.touchAction =
    "none";

  gameArea.appendChild(
    canvas
  );

  return [
    canvas,
    canvas.getContext("2d")
  ];

}


// ======================================================
// MESSAGE
// ======================================================

function message(text) {

  const p =
    document.createElement(
      "p"
    );

  p.className =
    "status";

  p.textContent =
    text;

  gameArea.appendChild(
    p
  );

}


// ======================================================
// MOBILE PAD
// ======================================================

function createPad(callback) {

  const pad =
    document.createElement(
      "div"
    );

  pad.className =
    "pad";


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
        data-direction="-1,0">
        ←
      </button>

      <button
        class="btn"
        data-direction="0,1">
        ↓
      </button>

      <button
        class="btn"
        data-direction="1,0">
        →
      </button>

    </div>

  `;


  gameArea.appendChild(
    pad
  );


  pad.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "button"
        );

      if (!button) return;

      callback(
        button.dataset
          .direction
          .split(",")
          .map(Number)
      );

    }
  );

}


// ======================================================
// 🐍 SNAKE
// ======================================================

function snake() {

  const [
    canvas,
    ctx
  ] = createCanvas();


  const size = 18;

  const cell = 20;


  let body = [

    [9, 9],

    [8, 9],

    [7, 9]

  ];


  let direction = [
    1,
    0
  ];


  let food = [
    4,
    4
  ];


  let score = 0;

  let dead = false;


  function createFood() {

    do {

      food = [

        Math.floor(
          Math.random() *
          size
        ),

        Math.floor(
          Math.random() *
          size
        )

      ];

    }

    while (
      body.some(
        p =>
          p[0] === food[0] &&
          p[1] === food[1]
      )
    );

  }


  function changeDirection(
    newDirection
  ) {

    if (
      newDirection[0] ===
        -direction[0] &&
      newDirection[1] ===
        -direction[1]
    ) {

      return;

    }


    direction =
      newDirection;

  }


  document.onkeydown =
    event => {

      const directions = {

        ArrowUp: [
          0,
          -1
        ],

        ArrowDown: [
          0,
          1
        ],

        // چپ و راست طبق درخواست قبلی جابه‌جا هستند

        ArrowLeft: [
          1,
          0
        ],

        ArrowRight: [
          -1,
          0
        ]

      };


      if (
        directions[event.key]
      ) {

        changeDirection(
          directions[event.key]
        );

      }

    };


  function draw() {

    ctx.fillStyle =
      "#070b15";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    ctx.strokeStyle =
      "#111c32";


    for (
      let i = 0;
      i <= canvas.width;
      i += cell
    ) {

      ctx.beginPath();

      ctx.moveTo(
        i,
        0
      );

      ctx.lineTo(
        i,
        canvas.height
      );

      ctx.stroke();


      ctx.beginPath();

      ctx.moveTo(
        0,
        i
      );

      ctx.lineTo(
        canvas.width,
        i
      );

      ctx.stroke();

    }


    ctx.fillStyle =
      "#ff5577";

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


    ctx.fillStyle =
      "#ffffff";

    ctx.font =
      "14px Arial";

    ctx.fillText(
      "Score: " + score,
      10,
      18
    );

  }


  function update() {

    if (dead) return;


    const head = [

      body[0][0] +
        direction[0],

      body[0][1] +
        direction[1]

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


    if (
      wall ||
      self
    ) {

      dead = true;

      message(
        "💥 باختی! امتیاز: " +
        score
      );

      return;

    }


    body.unshift(
      head
    );


    if (
      head[0] === food[0] &&
      head[1] === food[1]
    ) {

      score++;

      createFood();

    }

    else {

      body.pop();

    }


    draw();

  }


  createPad(
    changeDirection
  );


  timer =
    setInterval(
      update,
      125
    );


  draw();

}


// ======================================================
// 💣 MINESWEEPER
// ======================================================

function mine() {

  const total = 64;

  const mineCount = 10;


  const mines =
    new Set(

      [...Array(total).keys()]
        .sort(
          () =>
            Math.random() -
            0.5
        )
        .slice(
          0,
          mineCount
        )

    );


  const opened =
    new Set();


  const flagged =
    new Set();


  let flagsLeft = 10;

  let flagMode = false;


  const controls =
    document.createElement(
      "div"
    );

  controls.className =
    "choices";


  const flagButton =
    document.createElement(
      "button"
    );

  flagButton.className =
    "primary";


  flagButton.textContent =
    "🚩 پرچم: 10";


  const modeButton =
    document.createElement(
      "button"
    );

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
    document.createElement(
      "div"
    );

  grid.className =
    "mine";


  gameArea.appendChild(
    grid
  );


  const status =
    document.createElement(
      "p"
    );

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
      document.createElement(
        "button"
      );


    button.dataset.index =
      i;


    button.addEventListener(
      "click",
      () => {

        if (flagMode) {

          toggleFlag(i);

        }

        else {

          reveal(i);

        }

      }
    );


    buttons.push(
      button
    );


    grid.appendChild(
      button
    );

  }


  function toggleFlag(index) {

    if (
      opened.has(index)
    ) return;


    if (
      flagged.has(index)
    ) {

      flagged.delete(
        index
      );

      flagsLeft++;

      buttons[index]
        .textContent = "";

    }

    else {

      if (
        flagsLeft <= 0
      ) {

        status.textContent =
          "❌ دیگر پرچمی نداری.";

        return;

      }


      flagged.add(
        index
      );

      flagsLeft--;

      buttons[index]
        .textContent =
        "🚩";

    }


    flagButton.textContent =
      "🚩 پرچم: " +
      flagsLeft;

  }


  flagButton.onclick =
    () => {

      flagMode =
        !flagMode;

      modeButton.textContent =
        flagMode
          ? "🚩 حالت پرچم"
          : "حالت عادی";

    };


  modeButton.onclick =
    () => {

      flagMode =
        !flagMode;

      modeButton.textContent =
        flagMode
          ? "🚩 حالت پرچم"
          : "حالت عادی";

    };


  function countMines(
    index
  ) {

    const x =
      index % 8;

    const y =
      Math.floor(
        index / 8
      );


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


        const nx =
          x + dx;

        const ny =
          y + dy;


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


  function reveal(
    index
  ) {

    if (
      opened.has(index) ||
      flagged.has(index)
    ) return;


    opened.add(
      index
    );


    if (
      mines.has(index)
    ) {

      buttons[index]
        .textContent =
        "💣";


      mines.forEach(
        mineIndex => {

          buttons[mineIndex]
            .textContent =
            "💣";

        }
      );


      status.textContent =
        "💥 مین پیدا شد!";

      return;

    }


    const count =
      countMines(index);


    buttons[index]
      .textContent =
      count || "";


    buttons[index]
      .style.background =
      "#18233e";


    if (
      count === 0
    ) {

      const x =
        index % 8;

      const y =
        Math.floor(
          index / 8
        );


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

          const nx =
            x + dx;

          const ny =
            y + dy;


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


// ======================================================
// 🔊 ECHO
// ======================================================

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


  function playSound(
    frequency
  ) {

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
        audioContext
          .createOscillator();


      const gain =
        audioContext
          .createGain();


      oscillator.frequency.value =
        frequency;


      oscillator.type =
        "sine";


      gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
      );


      gain.gain
        .exponentialRampToValueAtTime(
          0.2,
          audioContext.currentTime +
            0.02
        );


      gain.gain
        .exponentialRampToValueAtTime(
          0.0001,
          audioContext.currentTime +
            0.35
        );


      oscillator.connect(
        gain
      );

      gain.connect(
        audioContext.destination
      );


      oscillator.start();

      oscillator.stop(
        audioContext.currentTime +
          0.35
      );

    }

    catch (error) {

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
        document.createElement(
          "button"
        );


      button.className =
        "choice";


      button.textContent =
        color.emoji;


      button.style.fontSize =
        "30px";


      button.onclick =
        () => {

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
      "مرحله " +
      level;


    locked = true;


    sequence.forEach(
      (value, index) => {

        setTimeout(
          () => {

            playSound(
              colors[value]
                .frequency
            );


            const buttons =
              choices
                .querySelectorAll(
                  "button"
                );


            buttons[value]
              .animate(
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

      sequence.length *
        550 +
        300
    );

  }


  nextRound();

}


// ======================================================
// 🪐 ORBIT
// ======================================================

function orbit() {

  const [
    canvas,
    ctx
  ] = createCanvas();


  let angle = 0;

  let score = 0;

  let obstacles = [];

  let dead = false;

  let lastTime = 0;


  function rotate() {

    angle += 0.9;

  }


  canvas.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      rotate();

    },
    {
      passive: false
    }
  );


  canvas.onclick =
    rotate;


  function loop(time) {

    if (dead) return;


    const delta =
      Math.min(
        0.03,
        (time - lastTime) /
          1000 || 0.016
      );


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
      Math.cos(angle) *
      70;


    const playerY =
      180 +
      Math.sin(angle) *
      70;


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

          obstacle.radius +=
            25;

        }

      }
    );


    score +=
      delta;


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


// ======================================================
// 🧲 GRAVITY TURN
// ======================================================

function gravity() {

  const [
    canvas,
    ctx
  ] = createCanvas();


  const W =
    canvas.width;

  const H =
    canvas.height;


  let x = 60;

  let y = 170;


  let velocityY = 0;


  let gravityForce =
    0.55;


  let velocityX =
    1.6;


  let dead = false;


  let score = 0;


  let lastTime = 0;


  const obstacles = [];


  // --------------------------------------------------
  // ساخت مانع
  // --------------------------------------------------

  function createObstacle() {

    const gapY =
      50 +
      Math.random() *
      190;


    obstacles.push({

      x: 390,

      width: 30,

      gapY,

      gapHeight: 105,

      passed: false

    });

  }


  // --------------------------------------------------
  // تغییر جاذبه
  // --------------------------------------------------

  function flipGravity() {

    gravityForce =
      -gravityForce;


    velocityY =
      gravityForce > 0
        ? 2.5
        : -2.5;

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
        "Space" ||
        event.key ===
        "ArrowUp"
      ) {

        flipGravity();

      }

    };


  // --------------------------------------------------
  // حلقه بازی
  // --------------------------------------------------

  function loop(time) {

    if (dead) return;


    const delta =
      Math.min(
        0.03,
        (time - lastTime) /
          1000 || 0.016
      );


    lastTime =
      time;


    // حرکت عمودی

    velocityY +=
      gravityForce *
      delta *
      60;


    y +=
      velocityY *
      delta *
      60;


    // حرکت افقی

    x +=
      velocityX *
      delta *
      60;


    // ------------------------------------------------
    // مهم:
    // برخورد با سقف و کف دیگر باخت نیست.
    // بازیکن روی سطح می‌ایستد.
    // ------------------------------------------------

    if (
      y < 0
    ) {

      y = 0;

      velocityY = 0;

    }


    if (
      y > H - 24
    ) {

      y =
        H - 24;

      velocityY = 0;

    }


    // ------------------------------------------------
    // ساخت موانع
    // ------------------------------------------------

    if (
      obstacles.length === 0 ||
      obstacles[
        obstacles.length - 1
      ].x < 220
    ) {

      createObstacle();

    }


    obstacles.forEach(
      obstacle => {

        obstacle.x -=
          115 *
          delta;

      }
    );


    // ------------------------------------------------
    // بررسی برخورد
    // ------------------------------------------------

    obstacles.forEach(
      obstacle => {

        const playerRight =
          x + 24;


        const playerBottom =
          y + 24;


        const obstacleRight =
          obstacle.x +
          obstacle.width;


        const hitsX =
          playerRight >
            obstacle.x &&
          x <
            obstacleRight;


        const hitsTop =
          y <
          obstacle.gapY;


        const hitsBottom =
          playerBottom >
          obstacle.gapY +
            obstacle.gapHeight;


        if (
          hitsX &&
          (hitsTop ||
            hitsBottom)
        ) {

          /*
            برخورد با جسم = باخت نیست.

            بازیکن کمی عقب زده می‌شود
            و سرعتش کم می‌شود.
          */

          x =
            obstacle.x -
            27;


          velocityX =
            0.8;


          velocityY =
            -gravityForce *
            2;


          /*
            اگر بازیکن بعد از برخورد
            مجبور شود از سمت چپ صفحه
            خارج شود، باخت.
          */

          if (
            x + 24 < 0
          ) {

            dead = true;

          }

        }


        // امتیاز عبور

        if (
          !obstacle.passed &&
          obstacle.x +
            obstacle.width <
            x
        ) {

          obstacle.passed =
            true;

          score++;

          velocityX =
            Math.min(
              3,
              velocityX +
                0.05
            );

        }

      }
    );


    // ------------------------------------------------
    // قانون خروج از صفحه
    // ------------------------------------------------

    if (
      x > W + 20 ||
      x + 24 < -20
    ) {

      dead = true;

    }


    // ------------------------------------------------
    // رسم
    // ------------------------------------------------

    ctx.fillStyle =
      "#070b15";


    ctx.fillRect(
      0,
      0,
      W,
      H
    );


    // خط وسط

    ctx.strokeStyle =
      "#182642";


    ctx.setLineDash(
      [6, 8]
    );


    ctx.beginPath();

    ctx.moveTo(
      0,
      H / 2
    );

    ctx.lineTo(
      W,
      H / 2
    );

    ctx.stroke();


    ctx.setLineDash([]);


    // موانع

    obstacles.forEach(
      obstacle => {

        ctx.fillStyle =
          "#ff5577";


        // بالا

        ctx.fillRect(

          obstacle.x,

          0,

          obstacle.width,

          obstacle.gapY

        );


        // پایین

        ctx.fillRect(

          obstacle.x,

          obstacle.gapY +
            obstacle.gapHeight,

          obstacle.width,

          H -
            (
              obstacle.gapY +
              obstacle.gapHeight
            )

        );

      }
    );


    // بازیکن

    ctx.fillStyle =
      "#62e6ae";


    ctx.fillRect(
      x,
      y,
      24,
      24
    );


    ctx.fillStyle =
      "#ffffff";


    ctx.font =
      "14px Arial";


    ctx.fillText(
      "Score: " +
      score,
      10,
      20
    );


    if (dead) {

      message(
        "💥 از صفحه خارج شدی! رکورد: " +
        score
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


// ======================================================
// 📡 SIGNAL 30 SECOND
// ======================================================

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

  let gameStarted =
    false;

  let gameEnded =
    false;

  let timeLeft =
    30;


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

    if (gameEnded)
      return;


    target =
      Math.floor(
        Math.random() *
        symbols.length
      );


    targetElement.textContent =
      symbols[target];


    choices.innerHTML =
      "";


    const list = [
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
        !list.includes(
          random
        )
      ) {

        list.push(
          random
        );

      }

    }


    list.sort(
      () =>
        Math.random() -
        0.5
    );


    list.forEach(
      index => {

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


        button.onclick =
          () => {

            if (
              gameEnded
            ) return;


            if (
              !gameStarted
            ) {

              startTimer();

            }


            if (
              index ===
              target
            ) {

              score++;

              createRound();

            }

          };


        choices.appendChild(
          button
        );

      }
    );

  }


  function startTimer() {

    if (
      gameStarted
    ) return;


    gameStarted =
      true;


    timeLeft =
      30;


    timer =
      setInterval(
        () => {

          timeLeft -=
            0.1;


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

            clearInterval(
              timer
            );


            gameEnded =
              true;


            choices.innerHTML =
              "";


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


// ======================================================
// 🌈 BRIDGE
// جایگزین Shadow
// ======================================================

function bridge() {

  const colors = [

    "🟦",
    "🟩",
    "🟨",
    "🟥"

  ];


  let sequence = [];

  let playerStep = 0;

  let level = 0;

  let locked = true;

  let mistakes = 0;


  gameArea.innerHTML = `

    <div
      class="number"
      id="bridgeLevel"
    >
      مرحله 1
    </div>

    <p
      class="status"
      id="bridgeStatus"
    >
      ترتیب خانه‌ها را حفظ کن.
    </p>

    <div
      id="bridgeBoard"
      style="
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:8px;
        width:min(320px,100%);
        margin:auto;
      "
    ></div>

  `;


  const board =
    $("#bridgeBoard");


  const status =
    $("#bridgeStatus");


  const levelText =
    $("#bridgeLevel");


  const buttons = [];


  for (
    let i = 0;
    i < 16;
    i++
  ) {

    const button =
      document.createElement(
        "button"
      );


    button.className =
      "choice";


    button.style.height =
      "58px";


    button.textContent =
      "•";


    button.onclick =
      () => {

        if (
          locked
        ) return;


        if (
          i ===
          sequence[playerStep]
        ) {

          playerStep++;


          button.textContent =
            "✓";


          if (
            playerStep ===
            sequence.length
          ) {

            locked = true;

            setTimeout(
              nextLevel,
              600
            );

          }

        }

        else {

          mistakes++;

          button.textContent =
            "✕";


          status.textContent =
            "❌ اشتباه! دوباره تلاش کن.";

        }

      };


    buttons.push(
      button
    );


    board.appendChild(
      button
    );

  }


  function resetBoard() {

    buttons.forEach(
      button => {

        button.textContent =
          "•";

        button.style.transform =
          "scale(1)";

      }
    );

  }


  function showSequence() {

    locked = true;

    resetBoard();


    sequence.forEach(
      (cell, index) => {

        setTimeout(
          () => {

            const button =
              buttons[cell];


            button.textContent =
              colors[
                index %
                colors.length
              ];


            button.style.transform =
              "scale(1.12)";


            setTimeout(
              () => {

                button.textContent =
                  "•";

                button.style.transform =
                  "scale(1)";

              },
              350
            );

          },

          index * 500

        );

      }
    );


    setTimeout(
      () => {

        locked = false;

        playerStep = 0;

        status.textContent =
          "حالا همان ترتیب را لمس کن.";

      },

      sequence.length *
        500 +
        400
    );

  }


  function nextLevel() {

    level++;


    levelText.textContent =
      "مرحله " +
      level;


    playerStep = 0;


    sequence.push(
      Math.floor(
        Math.random() *
        16
      )
    );


    showSequence();

  }


  // شروع

  sequence.push(
    Math.floor(
      Math.random() *
      16
    )
  );


  showSequence();

}


// ======================================================
// 💓 PULSE
// ======================================================

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


    timer =
      setTimeout(
        () => {

          active = true;


          startTime =
            performance.now();


          button.textContent =
            "الان بزن! ⚡";

        },

        700 +
        Math.random() *
        1600
      );

  }


  button.onclick =
    () => {

      if (!active) {

        clearTimeout(
          timer
        );


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


// ======================================================
// 💡 SWITCH
// ======================================================

function switchGame() {

  const board =
    document.createElement(
      "div"
    );


  board.style.display =
    "grid";


  board.style.gridTemplateColumns =
    "repeat(5,45px)";


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
    Array(25).fill(
      false
    );


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
        value =>
          !value
      )
    ) {

      status.textContent =
        "🎉 بردی!";

    }

  }


  function toggle(
    index
  ) {

    const x =
      index % 5;


    const y =
      Math.floor(
        index / 5
      );


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


    buttons.push(
      button
    );


    board.appendChild(
      button
    );

  }


  for (
    let i = 0;
    i < 12;
    i++
  ) {

    toggle(
      Math.floor(
        Math.random() *
        25
      )
    );

  }


  draw();

}


// ======================================================
// ✨ LIGHT HUNTER
// جایگزین Dash
// ======================================================

function lightHunter() {

  const [
    canvas,
    ctx
  ] = createCanvas();


  const W =
    canvas.width;

  const H =
    canvas.height;


  let player = {

    x: 70,

    y: 180,

    radius: 12

  };


  let lights = [];

  let obstacles = [];

  let particles = [];


  let score = 0;

  let combo = 0;

  let lives = 3;


  let dead = false;


  let lastTime = 0;

  let spawnTimer = 0;

  let obstacleTimer = 0;


  let targetY =
    player.y;


  // --------------------------------------------------
  // لمس صفحه برای حرکت عمودی
  // --------------------------------------------------

  function moveToTouch(
    event
  ) {

    event.preventDefault();


    const rect =
      canvas.getBoundingClientRect();


    const touch =
      event.touches[0];


    if (!touch) return;


    const scaleY =
      H /
      rect.height;


    targetY =
      (touch.clientY -
        rect.top) *
      scaleY;

  }


  canvas.addEventListener(
    "touchstart",
    moveToTouch,
    {
      passive: false
    }
  );


  canvas.addEventListener(
    "touchmove",
    moveToTouch,
    {
      passive: false
    }
  );


  canvas.addEventListener(
    "mousemove",
    event => {

      const rect =
        canvas.getBoundingClientRect();


      targetY =
        (event.clientY -
          rect.top) *
        H /
        rect.height;

    }
  );


  document.onkeydown =
    event => {

      if (
        event.key ===
        "ArrowUp"
      ) {

        targetY -= 35;

      }


      if (
        event.key ===
        "ArrowDown"
      ) {

        targetY += 35;

      }

    };


  // --------------------------------------------------
  // نور جدید
  // --------------------------------------------------

  function spawnLight() {

    lights.push({

      x: W + 20,

      y:
        30 +
        Math.random() *
        (H - 60),

      radius:
        7 +
        Math.random() *
        5,

      speed:
        90 +
        Math.random() *
        50

    });

  }


  // --------------------------------------------------
  // مانع جدید
  // --------------------------------------------------

  function spawnObstacle() {

    const gap =
      110;


    const gapY =
      30 +
      Math.random() *
      (H -
        gap -
        60);


    obstacles.push({

      x: W + 40,

      width: 25,

      gapY,

      gap,

      speed:
        105 +
        score * 0.5

    });

  }


  // --------------------------------------------------
  // ذرات
  // --------------------------------------------------

  function explosion(
    x,
    y
  ) {

    for (
      let i = 0;
      i < 12;
      i++
    ) {

      particles.push({

        x,

        y,

        vx:
          (Math.random() -
            0.5) *
          100,

        vy:
          (Math.random() -
            0.5) *
          100,

        life: 0.5

      });

    }

  }


  // --------------------------------------------------
  // حلقه
  // --------------------------------------------------

  function loop(time) {

    if (dead)
      return;


    const delta =
      Math.min(
        0.03,
        (time - lastTime) /
          1000 || 0.016
      );


    lastTime =
      time;


    // ------------------------------------------------
    // حرکت نرم بازیکن
    // ------------------------------------------------

    targetY =
      Math.max(
        15,
        Math.min(
          H - 15,
          targetY
        )
      );


    player.y +=
      (
        targetY -
        player.y
      ) *
      Math.min(
        1,
        delta * 8
      );


    // ------------------------------------------------
    // تولید نور
    // ------------------------------------------------

    spawnTimer +=
      delta;


    if (
      spawnTimer > 0.55
    ) {

      spawnTimer = 0;

      spawnLight();

    }


    // ------------------------------------------------
    // تولید مانع
    // ------------------------------------------------

    obstacleTimer +=
      delta;


    const obstacleDelay =
      Math.max(
        1.1,
        2 -
        score / 50
      );


    if (
      obstacleTimer >
      obstacleDelay
    ) {

      obstacleTimer = 0;

      spawnObstacle();

    }


    // ------------------------------------------------
    // حرکت نورها
    // ------------------------------------------------

    lights.forEach(
      light => {

        light.x -=
          light.speed *
          delta;

      }
    );


    obstacles.forEach(
      obstacle => {

        obstacle.x -=
          obstacle.speed *
          delta;

      }
    );


    // ------------------------------------------------
    // جمع کردن نور
    // ------------------------------------------------

    lights.forEach(
      (light, index) => {

        const distance =
          Math.hypot(
            player.x -
              light.x,
            player.y -
              light.y
          );


        if (
          distance <
          player.radius +
            light.radius
        ) {

          score++;

          combo++;


          explosion(
            light.x,
            light.y
          );


          lights.splice(
            index,
            1
          );

        }

      }
    );


    // ------------------------------------------------
    // برخورد با موانع
    // ------------------------------------------------

    obstacles.forEach(
      obstacle => {

        const insideX =

          player.x +
            player.radius >
            obstacle.x &&

          player.x -
            player.radius <
            obstacle.x +
              obstacle.width;


        const outsideGap =

          player.y -
            player.radius <
            obstacle.gapY ||

          player.y +
            player.radius >
            obstacle.gapY +
              obstacle.gap;


        if (
          insideX &&
          outsideGap
        ) {

          lives--;

          combo = 0;


          explosion(
            player.x,
            player.y
          );


          // بازیکن به محل امن برمی‌گردد

          player.x = 70;


          targetY =
            H / 2;


          if (
            lives <= 0
          ) {

            dead = true;

          }

        }

      }
    );


    // ------------------------------------------------
    // حذف اشیا
    // ------------------------------------------------

    lights =
      lights.filter(
        light =>
          light.x > -30
      );


    obstacles =
      obstacles.filter(
        obstacle =>
          obstacle.x >
          -50
      );


    // ------------------------------------------------
    // ذرات
    // ------------------------------------------------

    particles.forEach(
      particle => {

        particle.x +=
          particle.vx *
          delta;


        particle.y +=
          particle.vy *
          delta;


        particle.life -=
          delta;

      }
    );


    particles =
      particles.filter(
        particle =>
          particle.life > 0
      );


    // ------------------------------------------------
    // پس زمینه
    // ------------------------------------------------

    ctx.fillStyle =
      "#050913";


    ctx.fillRect(
      0,
      0,
      W,
      H
    );


    // ستاره‌ها

    ctx.fillStyle =
      "#182642";


    for (
      let i = 0;
      i < 35;
      i++
    ) {

      const sx =
        (i * 73 -
          time * 0.02) %
        W;


      const sy =
        (i * 47) %
        H;


      ctx.fillRect(
        sx < 0
          ? sx + W
          : sx,
        sy,
        2,
        2
      );

    }


    // ------------------------------------------------
    // موانع
    // ------------------------------------------------

    obstacles.forEach(
      obstacle => {

        ctx.fillStyle =
          "#ff5577";


        ctx.fillRect(

          obstacle.x,

          0,

          obstacle.width,

          obstacle.gapY

        );


        ctx.fillRect(

          obstacle.x,

          obstacle.gapY +
            obstacle.gap,

          obstacle.width,

          H -
            obstacle.gapY -
            obstacle.gap

        );

      }
    );


    // ------------------------------------------------
    // نورها
    // ------------------------------------------------

    lights.forEach(
      light => {

        const gradient =
          ctx.createRadialGradient(

            light.x,
            light.y,
            1,

            light.x,
            light.y,
            20

          );


        gradient.addColorStop(
          0,
          "#ffffff"
        );


        gradient.addColorStop(
          1,
          "rgba(255,255,255,0)"
        );


        ctx.fillStyle =
          gradient;


        ctx.beginPath();

        ctx.arc(
          light.x,
          light.y,
          20,
          0,
          Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
          "#ffe66d";


        ctx.beginPath();

        ctx.arc(
          light.x,
          light.y,
          light.radius,
          0,
          Math.PI * 2
        );

        ctx.fill();

      }
    );


    // ------------------------------------------------
    // بازیکن
    // ------------------------------------------------

    ctx.fillStyle =
      "#62e6ae";


    ctx.beginPath();

    ctx.arc(
      player.x,
      player.y,
      player.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();


    // ------------------------------------------------
    // ذرات
    // ------------------------------------------------

    particles.forEach(
      particle => {

        ctx.globalAlpha =
          Math.max(
            0,
            particle.life * 2
          );


        ctx.fillStyle =
          "#ffe66d";


        ctx.fillRect(
          particle.x,
          particle.y,
          4,
          4
        );


        ctx.globalAlpha =
          1;

      }
    );


    // ------------------------------------------------
    // UI
    // ------------------------------------------------

    ctx.fillStyle =
      "#ffffff";


    ctx.font =
      "14px Arial";


    ctx.fillText(
      "✨ نور: " +
      score,
      10,
      20
    );


    ctx.fillText(
      "❤️ " +
      lives,
      10,
      42
    );


    ctx.fillText(
      "🔥 Combo: " +
      combo,
      10,
      64
    );


    // ------------------------------------------------
    // Game Over
    // ------------------------------------------------

    if (dead) {

      message(
        "💥 بازی تمام شد! نور جمع‌شده: " +
        score
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
