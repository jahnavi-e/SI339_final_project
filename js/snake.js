// Variables
var blockSize = 25;
var rows = 20;
var cols = 20;
var gameCanvas;
var context; 
var snakeHead_X = 1 * blockSize;
var snakeHead_Y = 1 * blockSize;
var snakeBody = [];
var snakeVelocity_X = 0;
var snakeVelocity_Y = 0;
var food_exists = false;
var food_X;
var food_Y;
var score = 0;

// Functions
window.addEventListener("load", function() {
    // Game Loop
    setInterval(update, 100);
});

function update() {
    // Initialize game screen
    gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = cols * blockSize;
    gameCanvas.height = rows * blockSize;
    context = gameCanvas.getContext("2d");
    context.fillStyle = "black";
    context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Checking if game over
    if (gameOver()) {
        alert("Game Over");
        snakeHead_X = 1 * blockSize;
        snakeHead_Y = 1 * blockSize;
        snakeBody = [];
        snakeVelocity_X = 0;
        snakeVelocity_Y = 0;
        score = 0;
        return;
    }

    // Generating food
    generateFood();

    // Generating and moving snake
    moveSnake();

    // Updating scoreboard
    document.getElementById("scoreboard").innerHTML = score;
}

document.addEventListener('keydown', function(e) {
    if (e.code == "ArrowUp" && snakeVelocity_Y < 1) {
        snakeVelocity_X = 0;
        snakeVelocity_Y = -1;
    }
    else if (e.code == "ArrowDown" && snakeVelocity_Y > -1) {
        snakeVelocity_X = 0;
        snakeVelocity_Y = 1;
    }
    else if (e.code == "ArrowLeft" && snakeVelocity_X < 1) {
        snakeVelocity_X = -1;
        snakeVelocity_Y = 0;
    }
    else if (e.code == "ArrowRight" && snakeVelocity_X > -1) {
        snakeVelocity_X = 1;
        snakeVelocity_Y = 0;
    }
});

function moveSnake() {
    if (snakeBody.length > 0) {
        snakeBody[0] = [snakeHead_X, snakeHead_Y];
    }
    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    context.fillStyle="lime";
    snakeHead_X += snakeVelocity_X * blockSize;
    snakeHead_Y += snakeVelocity_Y * blockSize;
    context.fillRect(snakeHead_X, snakeHead_Y, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }
}

function appendSnake() {
    snakeBody.push([food_X, food_Y]);
}

function generateFood() {
    context.fillStyle = "red";
    context.fillRect(food_X, food_Y, blockSize, blockSize);
    if (food_exists ==  false) {
        food_X = Math.floor(Math.random() * cols) * blockSize;
        food_Y = Math.floor(Math.random() * rows) * blockSize;
        food_exists = true;
    }
    
    // If snake eats the food
    if (!(snakeHead_X >= food_X + blockSize || food_X >= snakeHead_X + blockSize || snakeHead_Y >= food_Y + blockSize || food_Y >= snakeHead_Y + blockSize)) {
        food_exists = false;
        score += 1;
        appendSnake();
    }
}

function gameOver() {
    // If snake hits edge of canvas
    if (snakeHead_X < 0 || snakeHead_X + blockSize > gameCanvas.width || snakeHead_Y < 0 || snakeHead_Y + blockSize > gameCanvas.height) {
        return true;
    }

    // If snake hits itself
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeHead_X == snakeBody[i][0] && snakeHead_Y == snakeBody[i][1]) {
            return true;
        }
    }
}