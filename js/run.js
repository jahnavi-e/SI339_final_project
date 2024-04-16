// Variables
var runCanvas;
var context; 
var startGame = false;
var critterImg;
var critter_Y = 200;
var critterVelocity_Y = 0;
var critterHitbox_Y = 214;
var critterHittboxVelocity_Y = 0;
var noObject = true;
var obstacles = [];
var obstacleVelocity_X = -1.2;
var obstacle_X = 700;
var obstacleImg;
var obstacle = {
    x : obstacle_X,
    img : obstacleImg
}
var gravity = 0.05;
var score = 0;

// Functions
window.addEventListener("load", function() {
    // Initialize game screen
    runCanvas = document.getElementById("runCanvas");
    runCanvas.width = 750;
    runCanvas.height = 250;
    context = runCanvas.getContext("2d");

    // Critter hitbox
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(30, 214, 52, 36);

    // Initialize  and draw critter
    critterImg = new Image();
    critterImg.src = "./images/critter-run/hedgehog-4.png";
    critterImg.onload = function() {context.drawImage(critterImg, 0, 200, 100, 100);}

    // Initialize obstacles
    obstacleImg = new Image();
    obstacleImg.src = "./images/critter-run/tree.png";

    // Initialize scoreboard
    document.getElementById("scoreboard").innerHTML = Math.floor(score);

    // Game Loop
    setInterval(update, 0);
});

function update() {
    if (startGame) {
    // Resetting canvas
    context.clearRect(0, 0, runCanvas.width, runCanvas.height);

    // Checking if game over
    if (gameOver()) {
        alert("Game Over");
        context.fillStyle = "rgba(255, 255, 255, 0.5)";
        context.fillRect(30, 214, 52, 36);
        context.drawImage(critterImg, 0, 200, 100, 100);
        obstacles.shift();
        noObject = true;
        startGame = false;
        score = 0;
        return;
    }

    // Generating obstacles
    generateObstacles();
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x += obstacleVelocity_X;
        context.drawImage(obstacleImg, obstacles[i].x, 150, 100, 100);
    }

    // Moving the critter
    moveCritter();

    // Updating scoreboard
    score += 0.03;
    document.getElementById("scoreboard").innerHTML = Math.floor(score);
    }
}

document.addEventListener('keydown', function(e) {
    if (e.code == "Space") {
        startGame = true;
    }
    if (e.code == "Space" && critter_Y == 200) {
        critterVelocity_Y = -3.75;
        critterHittboxVelocity_Y = -3.75;
    }
});

function moveCritter() {
    critterHittboxVelocity_Y += gravity;
    critterHitbox_Y = Math.min(critterHitbox_Y + critterHittboxVelocity_Y, 214);
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(30, critterHitbox_Y, 52, 36);

    critterVelocity_Y += gravity;
    critter_Y = Math.min(critter_Y + critterVelocity_Y, 200);
    context.drawImage(critterImg, 0, critter_Y, 100, 100);
}

function generateObstacles() {
    let randomChance = Math.random();
    if (randomChance < 0.003 && noObject == true) {
        let temp = obstacle;
        temp.x = 700;
        obstacles.push(temp);
        noObject = false;
    }
    if (obstacles.length > 0 && obstacles[0].x < -50) {
        obstacles.shift();
        noObject = true;
    }
}

function gameOver() {
    // If critter hits an obstacle
    for (let i = 0; i < obstacles.length; i++) {
        if(!(obstacles[i].x+25 < 30 || obstacles[i].x+25 > 82) && (critterHitbox_Y > 150)) {
            return true;
        }
    }
}