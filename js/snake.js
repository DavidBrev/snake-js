/**
 * @class generateGame will return a snake game object
 * @param {number} gridWidth must be above 5
 * @param {number} gridHeight must be above 5
 * @param {number} baseTimeInterval starting time between each update in ms
 * @param {number} timeSubstract time that will will be substracted for each point in ms
 * @param {number} timeLimit minimum wanted time between each update in ms
 * @param {number} startingLength initial snake length
 * @param {number} startingDir intial startingDirection {0: up, 1: right, 2: down, 3: left}
 * @param {boolean} walls wether walls are solid or portals
 */
const GenerateGame = (gridWidth, gridHeight, baseTimeInterval, timeSubstract, timeLimit, startingLength, startingDir, walls) => {
  /* Initialization */
  
  //Checking rules
  if(isNaN(gridWidth) || gridWidth <= 5){
    throw "The grid width must be a number above 5";
  }
  if(isNaN(gridHeight)  || gridHeight <= 5){
    throw "The grid height must be a number above 5";
  }
  if(isNaN(baseTimeInterval) || baseTimeInterval <= 0){
    throw "The base time interval between each upgrade must be a positive number";
  }
  if(isNaN(timeSubstract) || timeSubstract <= 0){
    throw "The substracted time for each point must be a positive number";
  }
  else if(timeSubstract >= baseTimeInterval){
    throw "The substracted time must be lesser than the base time interval";
  }
  if(isNaN(timeLimit) || timeLimit <= 0){
    throw "The time limit must be a positive number";
  }
  else if(timeLimit >= baseTimeInterval){
    throw "The time limit must be lesser than the base time interval";
  }
  if(isNaN(startingLength) || startingLength > 5 || startingLength < 1){
    throw "The starting length of the snake must be a number lesser than 5 and greater than 0";
  }
  if(isNaN(startingDir) || startingDir > 3 || startingDir < 0){
    throw "The starting direction of the snake must be a number between 0 and 3 (up to left in clockwise order)";
  }
  
  //Initializing grid
  const grid = $("#grid");
  grid.empty();
  for(let i=0; i<gridHeight; i++){
    const row = $(`<tr id=r${i}></tr>`);
    for(let j=0; j<gridWidth; j++){
      const square = $(`<td id=${coordToArrayId(j, i)} class="square"></td>`);
      row.append(square);
    }
    grid.append(row);
  }

  //Initializing snake position
  const snake = [];
  if(startingDir === 0){
    for(let i=0; i<startingLength; i++){
      let square = coordToArrayId(1, gridHeight-2-i);
      snake.push(square);
    }
  }
  else if(startingDir === 1){
    for(let i=0; i<startingLength; i++){
      let square = coordToArrayId(1+i, 1);
      snake.push(square);
    }
  }
  else if(startingDir === 2){
    for(let i=0; i<startingLength; i++){
      let square = coordToArrayId(gridWidth-2, 1+i);
      snake.push(square);
    }
  }
  else if(startingDir === 3){
    for(let i=0; i<startingLength; i++){
      let square = coordToArrayId(gridWidth-2-i, gridHeight-2);
      snake.push(square);
    }
  }

  //Initializing first fruit
  let fruit = generateNewFruit();

  //Initializing other properties
  let direction = startingDir;
  let timeInterval = baseTimeInterval;
  let interval = null;
  let points = 0;
  let started = false;
  let pause = false;
  let ended = false;
  const inputCache = [];

  //Initializing UI
  for(let i=0; i<snake.length; i++){
    $(`#${snake[i]}`).css("background-color", "green");
  }
  $(`#${fruit}`).css("background-color", "red");
  $("#gameData").text('Press Enter to start');
  $('#points').text(points);

  /* Private Methods */
  
  function coordToArrayId (x, y) {
    return y*gridWidth+x;
  }

  function generateNewFruit(){
    let fruit = null;
    do{
      fruit = Math.floor(Math.random()*gridWidth*gridHeight);
    }while(snake.includes(fruit));
    return fruit;
  }

  function update(){
    const firstSquare = snake[snake.length-1];
    let newSquare = null;
    const actualDir = getActualDir();
    if(inputCache.length > 0){
      const newDir = inputCache.shift();
      if(newDir + 2 !== actualDir && newDir - 2 !== actualDir) direction = newDir;
    }
    if(direction === 0){
      newSquare = firstSquare - gridWidth;
      if(walls && newSquare < 0) return endGame();
      else if(!walls && newSquare < 0) newSquare += (gridWidth*gridHeight);
    }
    else if(direction === 1){
      let actualRow = Math.floor(firstSquare/gridWidth);
      newSquare = firstSquare+1;
      let newRow = Math.floor(newSquare/gridWidth);
      if(walls && actualRow !== newRow) return endGame();
      else if(!walls && actualRow !== newRow) newSquare -= gridWidth;
    }
    else if(direction === 2){
      newSquare = firstSquare + gridWidth;
      if(walls && newSquare > gridHeight*gridWidth-1) return endGame();
      else if(!walls && newSquare > gridHeight*gridWidth-1) newSquare -= (gridWidth*gridHeight);
    }
    else if(direction === 3){
      let actualRow = Math.floor(firstSquare/gridWidth);
      newSquare = firstSquare-1;
      let newRow = Math.floor(newSquare/gridWidth);
      if(walls && actualRow !== newRow) return endGame();
      else if(!walls && actualRow !== newRow) newSquare += gridWidth;
    }
    const lastSquare = snake.shift();
    if(snake.includes(newSquare)) return endGame();
    snake.push(newSquare);
    updateUI(lastSquare, newSquare);
    if(newSquare === fruit) gainPoint(lastSquare);
  }

  function gainPoint(lastSquare){
    clearInterval(interval);
    points++;
    $('#points').text(points);
    snake.unshift(lastSquare);
    fruit = generateNewFruit();
    $(`#${lastSquare}`).css("background-color", "green");
    $(`#${fruit}`).css("background-color", "red");
    if(timeInterval > timeLimit){
      timeInterval -= timeSubstract;
      if(timeInterval < timeLimit) timeInterval = timeLimit;
    }
    interval = setInterval(update, timeInterval);
  }

  function getActualDir(){
    switch(snake[snake.length-1]-snake[snake.length-2]){
      case (gridWidth*gridHeight)-gridWidth:
        return 0;
      case -gridWidth+1:
        return 1;
      case -(gridWidth*gridHeight)+gridWidth:
        return 2;
      case gridWidth-1:
        return 3;
      case -gridWidth:
        return 0;
      case 1:
        return 1;
      case gridWidth:
        return 2;
      case -1:
        return 3;
    }
  }

  function updateUI(lastSquare, newSquare){
    $(`#${lastSquare}`).css("background-color", "white");
    $(`#${newSquare}`).css("background-color", "green");
  }

  function endGame(){
    ended = true;
    $("#gameData").text('Game Over');
    clearInterval(interval);
  }

  /* Public Methods */

  const game = {};

  game.Start = () => {
    if(!started){
      started = true;
      $('#gameData').text("Press enter to pause : Running...");
      interval = setInterval(update, timeInterval);
    }
  }

  game.Pause = () => {
    if(!pause && started && !ended){
      pause = true;
      clearInterval(interval);
      $('#gameData').text("Press enter to unpause");
    }
  }

  game.Unpause = () => {
    if(pause && started && !ended){
      pause = false;
      interval = setInterval(update, timeInterval);
      $('#gameData').text("Press enter to pause : Running...");
    }
  }

  game.ChangeDirection = (newDir) => {
    if(isNaN(newDir) || newDir > 3 || newDir < 0){
      throw "The direction of the snake must be a number between 0 and 3 (up to left in clockwise order)";
    }
    else if(!pause) inputCache.push(newDir);
  }
  
  game.Destroy = () => {
    clearInterval(interval);
    delete game;
  }

  return game;
}