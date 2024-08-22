const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20; // Size of one box
const canvasSize = 400 / box; // Number of boxes in one direction

let snake;
let food;
let d;
let score;
let gameInterval;

// Initialize the game state
function initGame() {
    snake = [];
    snake[0] = { x: 10 * box, y: 10 * box };

    food = {
        x: Math.floor(Math.random() * canvasSize) * box,
        y: Math.floor(Math.random() * canvasSize) * box
    };

    d = '';
    score = 0;

    if (gameInterval) clearInterval(gameInterval); // Clear any existing game interval
    gameInterval = setInterval(draw, 100); // Start a new game interval

    // Update score display
    document.getElementById('score').textContent = 'Score: ' + score;
}

// Control the snake's movement using keyboard
document.addEventListener('keydown', direction);

// Control the snake's movement using buttons
document.getElementById('leftButton').addEventListener('click', () => {
    if (d !== 'RIGHT') d = 'LEFT';
});
document.getElementById('upButton').addEventListener('click', () => {
    if (d !== 'DOWN') d = 'UP';
});
document.getElementById('rightButton').addEventListener('click', () => {
    if (d !== 'LEFT') d = 'RIGHT';
});
document.getElementById('downButton').addEventListener('click', () => {
    if (d !== 'UP') d = 'DOWN';
});

function direction(event) {
    if (event.keyCode === 37 && d !== 'RIGHT') d = 'LEFT';
    else if (event.keyCode === 38 && d !== 'DOWN') d = 'UP';
    else if (event.keyCode === 39 && d !== 'LEFT') d = 'RIGHT';
    else if (event.keyCode === 40 && d !== 'UP') d = 'DOWN';
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food (apple)
    drawApple(food.x, food.y);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            // Draw the head of the snake
            drawSnakeSegment(snake[i].x, snake[i].y, true);
        } else {
            // Draw the body of the snake
            drawSnakeSegment(snake[i].x, snake[i].y, false);
        }
    }

    // Snake movement
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    // Check if snake ate food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('score').textContent = 'Score: ' + score;
        food = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        };
    } else {
        snake.pop();
    }

    const newHead = {
        x: snakeX,
        y: snakeY
    };

    // Check collision with walls or self
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(gameInterval);
    }

    snake.unshift(newHead);
}

function drawSnakeSegment(x, y, isHead) {
    const centerX = x + box / 2;
    const centerY = y + box / 2;
    const radius = box / 2;

    ctx.fillStyle = isHead ? 'green' : 'darkgreen';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    if (isHead) {

        // Draw the eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 5, 0, Math.PI * 2);
        ctx.arc(centerX + radius / 3, centerY - radius / 3, radius / 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw the pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 10, 0, Math.PI * 2);
        ctx.arc(centerX + radius / 3, centerY - radius / 3, radius / 10, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawApple(x, y) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x + box / 2, y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw apple stem
    ctx.fillStyle = 'brown';
    ctx.beginPath();
    ctx.moveTo(x + box / 2, y + box / 2 - box / 2);
    ctx.lineTo(x + box / 2 - 5, y + box / 2 - box / 2 - 10);
    ctx.lineTo(x + box / 2 + 5, y + box / 2 - box / 2 - 10);
    ctx.closePath();
    ctx.fill();
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Initialize the game when the page loads
initGame();

// Add event listener for the refresh button
document.getElementById('refreshButton').addEventListener('click', initGame);
