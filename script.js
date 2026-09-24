let game = document.querySelector(".game");
let player = document.querySelector(".player");
let scoreText = document.querySelector(".score");
let gameOver = document.querySelector(".gameOver");
let finalScore = document.querySelector("#finalScore");

let leftBtn = document.querySelector("#leftBtn");
let rightBtn = document.querySelector("#rightBtn");
let jumpBtn = document.querySelector("#jumpBtn");


// PLAYER

let x = 50;
let y = 0;

let velocityY = 0;
let gravity = 0.5;
let jumpPower = 16;

let gameRunning = true;
let onGround = true;

let score = 0;
let currentPlatform = null;

// PLATFORMS

let platformElements = document.querySelectorAll(".platform");
let platforms = [];

let platformPositions = [
    { left: 40, bottom: 180 },
    { left: 60, bottom: 300 },
    { left: 30, bottom: 420 },
    { left: 65, bottom: 540 },
    { left: 40, bottom: 660 },
    { left: 70, bottom: 780 }
];

platformElements.forEach(function (element, index) {

    let position = platformPositions[index];

    let leftPosition =
        game.clientWidth * position.left / 100;

    element.style.left =
        leftPosition + "px";

    element.style.bottom =
        position.bottom + "px";

    platforms.push({

        element: element,

        left: leftPosition,

        bottom: position.bottom,

        direction: index % 2 === 0 ? 1 : -1,

        speed: 2.0

    });

});

// JUMP

function jump() {

    if (!gameRunning) {
        return;
    }

    if (onGround) {

        velocityY = jumpPower;

        onGround = false;

        currentPlatform = null;
    }
}


// KEYBOARD

document.addEventListener("keydown", function (event) {

    if (!gameRunning) {
        return;
    }

    if (
        event.key === "ArrowLeft" ||
        event.key === "a"
    ) {
        x -= 5;
    }

    if (
        event.key === "ArrowRight" ||
        event.key === "d"
    ) {
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


// GAME OVER

function endGame() {

    if (!gameRunning) {
        return;
    }

    gameRunning = false;

    velocityY = 0;

    finalScore.innerText = score;

    gameOver.style.display = "block";

    document.querySelector(".mobileControls").style.display = "none";
}


// GAME LOOP

function gameLoop() {

    if (!gameRunning) {
        return;
    }


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


    // PLAYER POSITION

    let gameWidth = game.clientWidth;

    let playerWidth = player.offsetWidth;

    let playerCenter =
        gameWidth * x / 100;

    let playerLeft =
        playerCenter - playerWidth / 2;

    let playerRight =
        playerCenter + playerWidth / 2;


    let oldBottom =
        80 + oldY;

    let newBottom =
        80 + y;


    let landed = false;


    // PLATFORM COLLISION

    if (velocityY <= 0) {

        for (let i = 0; i < platforms.length; i++) {

            let platform = platforms[i];

            let element = platform.element;


            let platformLeft =
                platform.left;

            let platformRight =
                platform.left +
                element.offsetWidth;

            let platformTop =
                platform.bottom +
                element.offsetHeight;


            let horizontal =
                playerRight > platformLeft &&
                playerLeft < platformRight;


            let vertical =
                oldBottom >= platformTop &&
                newBottom <= platformTop;


            if (horizontal && vertical) {

                y =
                    platformTop - 80;

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


    // GROUND / FALL

    if (!landed) {

        if (y <= 0) {

            if (oldY > 0 && velocityY < 0) {

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


    // MOVE PLATFORMS

    platforms.forEach(function (platform) {

        let element = platform.element;


        platform.left +=
            platform.speed *
            platform.direction;


        if (
            platform.left +
            element.offsetWidth >=
            gameWidth - 20
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


        // PLATFORM GOES DOWN

        platform.bottom -= 0.35;


        element.style.bottom =
            platform.bottom + "px";


        // RESET PLATFORM

        if (platform.bottom < -100) {

            platform.bottom =
                game.clientHeight + 100;


            platform.left =
                Math.random() *
                (
                    gameWidth -
                    element.offsetWidth -
                    40
                ) + 20;


            element.style.bottom =
                platform.bottom + "px";


            element.style.left =
                platform.left + "px";

        }

    });


    // DRAW PLAYER

    player.style.left =
        x + "%";

    player.style.bottom =
        (80 + y) + "px";


    // FALL CHECK

    if (y < -100) {

        endGame();

        return;

    }


    requestAnimationFrame(gameLoop);

}


// MOBILE LEFT

leftBtn.addEventListener(
    "pointerdown",
    function (event) {

        event.preventDefault();

        if (gameRunning) {

            x -= 5;

        }

    }
);


// MOBILE RIGHT

rightBtn.addEventListener(
    "pointerdown",
    function (event) {

        event.preventDefault();

        if (gameRunning) {

            x += 5;

        }

    }
);


// MOBILE JUMP

jumpBtn.addEventListener(
    "pointerdown",
    function (event) {

        event.preventDefault();

        jump();

    }
);


// START

gameOver.style.display = "none";

document.querySelector(".mobileControls").style.display = "flex";

player.style.left = x + "%";

player.style.bottom = "80px";


gameLoop();

