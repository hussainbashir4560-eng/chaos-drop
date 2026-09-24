
let game = document.querySelector(".game");
let player = document.querySelector(".player");
let scoreText = document.querySelector(".score");
let gameOver = document.querySelector(".gameOver");
let finalScore = document.querySelector("#finalScore");

// PLAYER
let x = 50;
let y = 0;
let velocityY = 0;
let gravity = 0.5;
let jumpPower = 15;
let onGround = true;
let gameRunning = true;

// SCORE
let score = 0;
let currentPlatform = null;

// PLATFORMS
let platformElements = document.querySelectorAll(".platform");
let platforms = [];

platformElements.forEach(function (element, index) {

    let style = getComputedStyle(element);

    platforms.push({
        element: element,
        left: parseFloat(style.left),
        bottom: parseFloat(style.bottom),
        direction: index % 2 === 0 ? 1 : -1,
        speed: 0.8
    });

});

// ==========================
// JUMP FUNCTION
// ==========================

function jump() {

    if (!gameRunning) return;

    velocityY = jumpPower;
    onGround = false;
    currentPlatform = null;

}

// ==========================
// KEYBOARD CONTROLS
// ==========================

document.addEventListener("keydown", function (event) {

    if (!gameRunning) return;

    if (event.key === "ArrowLeft" || event.key === "a") {
        x -= 5;
    }

    if (event.key === "ArrowRight" || event.key === "d") {
        x += 5;
    }

    if (
        event.key === "ArrowUp" ||
        event.key === "w" ||
        event.key === " "
    ) {
        jump();
    }

});

// ==========================
// GAME OVER
// ==========================

function endGame() {

    if (!gameRunning) return;

    gameRunning = false;

    velocityY = 0;

    finalScore.innerText = score;

    gameOver.style.display = "block";

    let mobileControls = document.querySelector(".mobileControls");

    mobileControls.style.setProperty("display", "none", "important");
}

// ==========================
// GAME LOOP
// ==========================

function gameLoop() {

    if (!gameRunning) return;

    let oldY = y;

    // GRAVITY
    velocityY -= gravity;
    y += velocityY;

    // PLAYER LIMIT
    if (x < 3) {
        x = 3;
    }

    if (x > 97) {
        x = 97;
    }

    let gameWidth = game.clientWidth;

    let playerWidth = player.offsetWidth;

    let playerCenter = gameWidth * x / 100;

    let playerLeft = playerCenter - playerWidth / 2;

    let playerRight = playerCenter + playerWidth / 2;

    let oldBottom = 80 + oldY;

    let newBottom = 80 + y;

    let landed = false;

    // ==========================
    // PLATFORM COLLISION
    // ==========================

    if (velocityY <= 0) {

        for (let i = 0; i < platforms.length; i++) {

            let platform = platforms[i];

            let element = platform.element;

            let platformLeft = platform.left;

            let platformRight =
                platformLeft + element.offsetWidth;

            let platformTop =
                platform.bottom + element.offsetHeight;

            let horizontal =
                playerRight > platformLeft &&
                playerLeft < platformRight;

            let vertical =
                oldBottom >= platformTop &&
                newBottom <= platformTop;

            if (horizontal && vertical) {

                y = platformTop - 80;

                velocityY = 0;

                onGround = true;

                landed = true;

                if (currentPlatform !== element) {

                    score++;

                    scoreText.innerText =
                        "Score: " + score;

                    currentPlatform = element;

                }

                break;

            }

        }

    }

    // ==========================
    // GROUND / FALL
    // ==========================

    if (!landed) {

        if (y <= 0) {

            if (velocityY < 0 && oldY > 0) {

                endGame();

                return;

            }

            y = 0;

            velocityY = 0;

            onGround = true;

            currentPlatform = null;

        } else {

            onGround = false;

        }

    }

    // ==========================
    // MOVE PLATFORMS
    // ==========================

    platforms.forEach(function (platform) {

        let element = platform.element;

        // LEFT / RIGHT MOVEMENT
        platform.left +=
            platform.speed * platform.direction;

        if (
            platform.left + element.offsetWidth
            >= gameWidth - 20
        ) {

            platform.left =
                gameWidth -
                element.offsetWidth -
                20;

            platform.direction = -1;

        }

        if (platform.left <= 20) {

            platform.left = 20;

            platform.direction = 1;

        }

        element.style.left =
            platform.left + "px";

        // UPWARD MOVEMENT
        platform.bottom -= 0.8;

        element.style.bottom =
            platform.bottom + "px";

        // BRING PLATFORM BACK
        if (platform.bottom < -50) {

            platform.bottom =
                game.clientHeight + 150;

            platform.left =
                Math.random() *
                (gameWidth - element.offsetWidth);

            element.style.bottom =
                platform.bottom + "px";

            element.style.left =
                platform.left + "px";

        }

    });

    // ==========================
    // PLAYER POSITION
    // ==========================

    player.style.left = x + "%";

    player.style.bottom =
        (80 + y) + "px";

    // EXTRA FALL CHECK
    if (y < -100) {

        endGame();

        return;

    }

    requestAnimationFrame(gameLoop);

}

// ==========================
// START GAME
// ==========================

gameOver.style.display = "none";

player.style.left = x + "%";

player.style.bottom = "80px";

gameLoop();


// ==========================
// MOBILE CONTROLS
// ==========================

let leftBtn =
    document.querySelector("#leftBtn");

let rightBtn =
    document.querySelector("#rightBtn");

let jumpBtn =
    document.querySelector("#jumpBtn");


// LEFT BUTTON
leftBtn.addEventListener(
    "pointerdown",
    function (event) {

        event.preventDefault();

        if (gameRunning) {

            x -= 5;

        }

    }
);


// RIGHT BUTTON
rightBtn.addEventListener(
    "pointerdown",
    function (event) {

        event.preventDefault();

        if (gameRunning) {

            x += 5;

        }

    }
);


// JUMP BUTTON
jumpBtn.addEventListener(
    "pointerdown",
    function (event) {

        event.preventDefault();

        jump();

    }
);