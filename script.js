// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏配置
const gridSize = 20; // 网格大小
const tileCount = canvas.width / gridSize; // 网格数量
let speed = 7; // 默认游戏速度

// 获取难度选择元素
const difficultySelect = document.getElementById('difficultySelect');

// 获取最高分元素
const highScoreElement = document.getElementById('highScore');

// 从localStorage加载最高分
let highScore = localStorage.getItem('snakeHighScore') || 0;
highScoreElement.textContent = highScore;

// 初始化蛇的状态
function initSnake() {
    return {
        x: Math.floor(tileCount / 2), // 从屏幕中间开始
        y: Math.floor(tileCount / 2),
        dx: 0, // 初始静止
        dy: 0,
        cells: [],
        maxCells: 4
    };
}

// 蛇的初始状态
let snake = initSnake();

// 食物的位置
let food = {
    x: 15,
    y: 15
};

// 游戏状态
let gameRunning = false;
let score = 0;
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

// 更新游戏速度
function updateSpeed() {
    speed = parseInt(difficultySelect.value);
}

// 更新最高分
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
        
        // 显示新纪录提示
        if (score > 0) {
            setTimeout(() => {
                alert('恭喜！你创造了新的最高分！');
            }, 100);
        }
    }
}

// 随机生成食物位置
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    
    // 确保食物不会生成在蛇身上
    for (let cell of snake.cells) {
        if (food.x === cell.x && food.y === cell.y) {
            generateFood();
            return;
        }
    }
}

// 游戏循环
function gameLoop() {
    if (!gameRunning) return;
    
    setTimeout(function() {
        requestAnimationFrame(gameLoop);
    }, 1000 / speed);

    // 清空画布
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 移动蛇
    snake.x += snake.dx;
    snake.y += snake.dy;

    // 边界检查
    if (snake.x < 0) snake.x = tileCount - 1;
    if (snake.x >= tileCount) snake.x = 0;
    if (snake.y < 0) snake.y = tileCount - 1;
    if (snake.y >= tileCount) snake.y = 0;

    // 更新蛇身
    snake.cells.unshift({x: snake.x, y: snake.y});
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // 绘制食物
    ctx.fillStyle = '#ff3b30';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize/2,
        food.y * gridSize + gridSize/2,
        gridSize/2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // 绘制蛇
    ctx.fillStyle = '#34c759';
    snake.cells.forEach(function(cell, index) {
        ctx.beginPath();
        ctx.arc(
            cell.x * gridSize + gridSize/2,
            cell.y * gridSize + gridSize/2,
            gridSize/2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });

    // 检测是否吃到食物
    if (snake.x === food.x && snake.y === food.y) {
        snake.maxCells++;
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    }

    // 检测是否撞到自己
    for (let i = 4; i < snake.cells.length; i++) { // 从第4个身体段开始检查，避免误判
        if (snake.x === snake.cells[i].x && snake.y === snake.cells[i].y) {
            gameOver();
            return;
        }
    }
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    updateHighScore();
    alert(`游戏结束！你的得分是：${score}`);
    startBtn.textContent = '重新开始';
    // 启用难度选择
    difficultySelect.disabled = false;
    resetGame();
}

// 重置游戏
function resetGame() {
    snake = initSnake();
    score = 0;
    scoreElement.textContent = score;
    generateFood();
}

// 开始游戏
startBtn.addEventListener('click', function() {
    if (!gameRunning) {
        // 更新游戏速度
        updateSpeed();
        // 禁用难度选择
        difficultySelect.disabled = true;
        gameRunning = true;
        startBtn.textContent = '暂停';
        gameLoop();
    } else {
        gameRunning = false;
        startBtn.textContent = '继续';
    }
});

// 键盘控制
document.addEventListener('keydown', function(e) {
    // 防止方向键滚动页面
    if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

    // 只在游戏运行时响应按键
    if (!gameRunning) return;

    // 如果蛇当前静止，任何方向键都可以开始移动
    const isSnakeStill = snake.dx === 0 && snake.dy === 0;

    // 左方向键
    if (e.keyCode === 37 && (isSnakeStill || snake.dx === 0)) {
        snake.dx = -1;
        snake.dy = 0;
    }
    // 上方向键
    else if (e.keyCode === 38 && (isSnakeStill || snake.dy === 0)) {
        snake.dx = 0;
        snake.dy = -1;
    }
    // 右方向键
    else if (e.keyCode === 39 && (isSnakeStill || snake.dx === 0)) {
        snake.dx = 1;
        snake.dy = 0;
    }
    // 下方向键
    else if (e.keyCode === 40 && (isSnakeStill || snake.dy === 0)) {
        snake.dx = 0;
        snake.dy = 1;
    }
}); 