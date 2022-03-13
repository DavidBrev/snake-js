const gridWidth = 20;
const gridHeight = 20;
const baseTimeInterval = 125;
const timeSubstract = 2.5;
const timeLimit = 37.5;
const startingLength = 3;
const startingDir = 1;
const walls = false;

let Game = GenerateGame(gridWidth, gridHeight, baseTimeInterval, timeSubstract, timeLimit, startingLength, startingDir, walls);
let started = false;
let pause = false;

function keydownHandler(e) {
  switch(e.code){
    case "Enter":
      if(!started){
        Game.Start();
        started = true;
      }
      else if(!pause){
        pause = true;
        Game.Pause();
      }
      else{
        pause = false;
        Game.Unpause();
      }
      break;
    case "ArrowUp":
      Game.ChangeDirection(0);
      break;
    case "ArrowRight":
      Game.ChangeDirection(1);
      break;
    case "ArrowDown":
      Game.ChangeDirection(2);
      break;
    case "ArrowLeft":
      Game.ChangeDirection(3);
      break;
    default:
  }
}

$("#newGame").on("click", e => {
  started = false;
  pause = false;
  Game.Destroy();
  Game = GenerateGame(gridWidth, gridHeight, baseTimeInterval, timeSubstract, timeLimit, startingLength, startingDir, walls);
})

document.addEventListener('keydown', keydownHandler);