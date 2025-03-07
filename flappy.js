//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipes
//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;

let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //used for drawing on the board

  // context.fillStyle= "green"; //set a color
  // context.fillRect(bird.x,bird.y,bird.width,bird.height); //set the positions

  //load images
  birdImg = new Image();
  birdImg.src = "./images/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); // draw the flappy img on the context
  };
  //pipe
  topPipeImg = new Image();
  topPipeImg.src = "./images/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./images/bottompipe.png";

  // topPipeImg.onload = function(){;
  // context.drawImage(topPipeImg,pipeX,pipeY,pipeWidth,pipeHeight)};

  requestAnimationFrame(update);
  setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);
};

// document.addEventListener("keypress", function(event){
//     if(event="space"){
//         bird.y-=5
//     }
// })

function update(e) {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, boardWidth, boardHeight);
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  bird.y += velocityY;

  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }
  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }
    // clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
      pipeArray.shift();
    }
    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  //score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("GAME OVER", 5, 90);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    velocityY = -6;

    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
