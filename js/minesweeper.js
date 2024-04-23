// Variables
var startGame = false;
var gameOverState = 0;
var mineCanvas = [];
var tileSize = 48;
var rows = 10;
var cols = 10;
var numMines = 15;
var numFlags = 15;
var clickedTiles = 0;
var score = 0;
var numClicks = 0;
var timer = null;

// Functions
window.addEventListener("load", function() {
    // Initialize game board
    initializeGameBoard();

    // Game loop
    setInterval(update, 0);
});

function update() {
    if(startGame){
        // Checking if game over
        if (gameOverState != 0) {
            if (gameOverState == 1) {
                alert("Game Lost 😔");
            }
            if (gameOverState == 2) {
                alert("Game Won 🥳");
            }
            startGame = false;
            gameOverState = 0;
            mineCanvas = [];
            numMines = 10;
            numFlags = 10;
            clickedTiles = 0;
            score = 0;
            location.reload();
            return;
        }

        // Updating availble flags
        document.getElementById("numFlags").innerHTML = numFlags;

        // Updating scoreboard
        score += 0.01;
        document.getElementById("scoreboard").innerHTML = Math.floor(score);
    }
}

document.addEventListener('click', function(e) {
    if (startGame == false){
        startGame = true;
    }
    numClicks++;
    if (numClicks == 1) {
        timer = setTimeout(function() {
            clickTiles(e.target);
            numClicks = 0; 
        }, 200);
    }

    if (numClicks == 2) {
        clearTimeout(timer);
        placeFlag(e.target);
        numClicks = 0;
    }
});

document.addEventListener('mousedown', function(e) {
    if (e.detail > 1) {
      e.preventDefault();
    }
});

function initializeGameBoard() {
    if (mineCanvas.length == 0) {
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < cols; j++) {
                let tile = document.createElement("div");
                tile.name = i.toString() + "-" + j.toString();
                tile.id = "blankTile";
                document.getElementById("mineCanvas").append(tile);
                row.push(tile);
            }
            mineCanvas.push(row);
        }
    }
    let minesGenerated = 0;
    while (minesGenerated < numMines) {
        let mineRow = Math.floor(Math.random() * rows);
        let mineCol = Math.floor(Math.random() * cols);
        if (mineCanvas[mineRow][mineCol].id != "mine") {
            mineCanvas[mineRow][mineCol].id = "mine";
            minesGenerated++;
        }
    }
}

function clickTiles(tile) {
    gameOver(tile.id);
    let tileLocation = tile.name.split("-");
    let tileRow = parseInt(tileLocation[0]);
    let tileCol = parseInt(tileLocation[1]);
    revealTiles(tileRow, tileCol);
}

function placeFlag(tile) {
    if (numFlags > 0 && tile.innerText != "🚩"){
        tile.innerText = "🚩";
        numFlags--;
    }
    else if (tile.innerText == "🚩"){
        tile.id = "blankTile";
        tile.innerText = "";
        numFlags++;
    }
}

// revealTiles function referenced from checkMine function taken from https://github.com/ImKennyYip/Minesweeper/blob/master/minesweeper.js
function revealTiles(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return;
    }
    if (mineCanvas[r][c].classList.contains("revealedTile")) {
        return;
    }
    mineCanvas[r][c].classList.add("revealedTile");
    clickedTiles += 1;
    let minesFound = check(r-1, c-1) + check(r-1, c) + check(r-1, c+1) + check(r, c-1) + check(r, c+1) + check(r+1, c-1) + check(r+1, c) + check(r+1, c+1);
    if (minesFound > 0) {
        mineCanvas[r][c].innerText = minesFound;
    }
    else {
        mineCanvas[r][c].innerText = "";
        revealTiles(r-1, c-1);
        revealTiles(r-1, c);
        revealTiles(r-1, c+1);
        revealTiles(r, c-1);
        revealTiles(r, c+1);
        revealTiles(r+1, c-1);
        revealTiles(r+1, c);
        revealTiles(r+1, c+1);
    }
    gameOver(mineCanvas[r][c].id);
}

function check(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return 0;
    }
    else if (mineCanvas[r][c].id == "mine") {
        return 1;
    }
    else {
        return 0;
    }
}

function gameOver(tileID) {
    // Game lost condition
    if (tileID == "mine") {
        // Reveal mines
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (mineCanvas[i][j].id == "mine") {
                    mineCanvas[i][j].innerText = "💣";
                    mineCanvas[i][j].style.backgroundColor = "red";
                }
            }
        }
        gameOverState = 1;
    }
    // Game won condition
    else if (clickedTiles >= 100 - numMines) {
        // Reveal mines
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (mineCanvas[i][j].id == "mine") {
                    mineCanvas[i][j].innerText = "💣";
                    mineCanvas[i][j].style.backgroundColor = "red";
                }
            }
        }
        gameOverState = 2;
    }
}