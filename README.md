# Snake-js

This is a simple snake game project.
The game is available with 2 game modes : classic and portals.

## Classic mode

In classic mode, you start in a grid of 30 by 20.
Press Enter to start the game and use the arrow keys to move.
Your purpose is to eat as much fruit as possible. 
When you eat a fruit, your score and snake length is increased by 1.
Your snake's speed will also increase for each fruit you eat.
If you hit a wall or your own tail, it is Game Over!

## Portals mode

In portals mode, the rules are the same as classic mode with 2 differences.
You start in a grid of 20 by 20 and instead of killing you, the walls teleport you to the other side of the grid.

## Tweaking the game

If you feel like creating your own rules, feel free to modify the values of the 2 different game modes by modifying the 8 first lines of the `./{classic|portals}/js/index.js` files.