import { GAME_CONFIG } from './config/foodConfig.js';
import { FoodManager } from './food/FoodManager.js';
import { EffectManager } from './effects/EffectManager.js';
import { FoodRenderer } from './renderers/FoodRenderer.js';
import { AudioManager } from './audio/AudioManager.js';

// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏配置
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let speed = GAME_CONFIG.BASE_SPEED;

// 初始化管理器
const foodManager = new FoodManager(canvas);
const effectManager = new EffectManager();
const foodRenderer = new FoodRenderer(canvas, ctx);
const audioManager = new AudioManager();

// 获取DOM元素
const difficultySelect = document.getElementById('difficultySelect');
const highScoreElement = document.getElementById('highScore');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

// 从localStorage加载最高分
let highScore = localStorage.getItem('snakeHighScore') || 0;
highScoreElement.textContent = highScore;

// 初始化蛇的状态
let snake = {
    x: Math.floor(tileCount / 2),
    y: Math.floor(tileCount / 2),
    dx: 0,
    dy: 0,
    cells: [],
    maxCells: 4,
    scale: 1,
    isImmortal: false,
    healCount: 0
};

// 游戏状态
let gameRunning = false;
let score = 0;

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
        
        setTimeout(() => {
            alert('恭喜！你创造了新的最高分！');
        }, 100);
    }
}

// 游戏循环
function gameLoop(currentTime) {
    if (!gameRunning) return;
    
    setTimeout(() => {
        requestAnimationFrame(gameLoop);
    }, 1000 / speed);

    // 清空画布
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新食物
    foodManager.update(currentTime);
    
    // 更新效果
    effectManager.update();

    // 移动蛇
    snake.x += snake.dx;
    snake.y += snake.dy;

    // 边界检查
    if (snake.isImmortal) {
        // 穿墙
        if (snake.x < 0) snake.x = tileCount - 1;
        if (snake.x >= tileCount) snake.x = 0;
        if (snake.y < 0) snake.y = tileCount - 1;
        if (snake.y >= tileCount) snake.y = 0;
    } else {
        // 检查是否撞墙
        if (snake.x < 0 || snake.x >= tileCount || snake.y < 0 || snake.y >= tileCount) {
            if (snake.healCount > 0) {
                snake.healCount--;
                if (snake.x < 0) snake.x = 0;
                if (snake.x >= tileCount) snake.x = tileCount - 1;
                if (snake.y < 0) snake.y = 0;
                if (snake.y >= tileCount) snake.y = tileCount - 1;
            } else {
                gameOver();
                return;
            }
        }
    }

    // 更新蛇身
    snake.cells.unshift({x: snake.x, y: snake.y});
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // 渲染食物
    const currentFood = foodManager.getCurrentFood();
    if (currentFood) {
        foodRenderer.render(currentFood, currentTime);
    }

    // 渲染蛇
    const snakeSize = (gridSize/2 - 2) * snake.scale;
    snake.cells.forEach(function(cell, index) {
        // 蛇身
        ctx.fillStyle = '#90EE90'; // 浅绿色
        ctx.beginPath();
        ctx.arc(
            cell.x * gridSize + gridSize/2,
            cell.y * gridSize + gridSize/2,
            snakeSize,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // 只给蛇头添加细节
        if (index === 0) {
            // 眼睛（大）
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(
                cell.x * gridSize + gridSize/2 + snakeSize/2 * Math.cos(Math.atan2(snake.dy, snake.dx)),
                cell.y * gridSize + gridSize/2 + snakeSize/2 * Math.sin(Math.atan2(snake.dy, snake.dx)),
                snakeSize/2,
                0,
                Math.PI * 2
            );
            ctx.fill();

            // 眼珠
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(
                cell.x * gridSize + gridSize/2 + snakeSize/2 * Math.cos(Math.atan2(snake.dy, snake.dx)),
                cell.y * gridSize + gridSize/2 + snakeSize/2 * Math.sin(Math.atan2(snake.dy, snake.dx)),
                snakeSize/4,
                0,
                Math.PI * 2
            );
            ctx.fill();

            // 红点装饰
            ctx.fillStyle = '#FF6B6B';
            ctx.beginPath();
            ctx.arc(
                cell.x * gridSize + gridSize/2 - snakeSize/2 * Math.cos(Math.atan2(snake.dy, snake.dx)),
                cell.y * gridSize + gridSize/2 - snakeSize/2 * Math.sin(Math.atan2(snake.dy, snake.dx)),
                snakeSize/4,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    });

    // 检测是否吃到食物
    if (foodManager.checkCollision(snake)) {
        const food = foodManager.getCurrentFood();
        
        // 检查是否是黑色食物
        if (food.isDeadly) {
            gameOver();
            return;
        }
        
        snake.maxCells++;
        score += food.points;
        scoreElement.textContent = score;
        
        // 应用食物效果
        effectManager.applyEffect(food, snake, { speed });
        
        // 生成新食物
        foodManager.clearFood();
    }

    // 检测是否撞到自己
    if (!snake.isImmortal) {
        for (let i = 4; i < snake.cells.length; i++) {
            if (snake.x === snake.cells[i].x && snake.y === snake.cells[i].y) {
                if (snake.healCount > 0) {
                    snake.healCount--;
                    snake.cells.splice(i);
                } else {
                    gameOver();
                    return;
                }
            }
        }
    }
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    updateHighScore();
    audioManager.stopBackground(); // 停止背景音乐
    audioManager.playGameOver();   // 播放游戏结束音效
    alert(`游戏结束！你的得分是：${score}`);
    startBtn.textContent = '重新开始';
    difficultySelect.disabled = false;
    effectManager.clearAllEffects();
    foodRenderer.clearAnimations();
    resetGame();
}

// 重置游戏
function resetGame() {
    snake = {
        x: Math.floor(tileCount / 2),
        y: Math.floor(tileCount / 2),
        dx: 0,
        dy: 0,
        cells: [],
        maxCells: 4,
        scale: 1,
        isImmortal: false,
        healCount: 0
    };
    score = 0;
    scoreElement.textContent = score;
    foodManager.reset(); // 使用新添加的reset方法
}

// 开始游戏
startBtn.addEventListener('click', function() {
    if (!gameRunning) {
        updateSpeed();
        difficultySelect.disabled = true;
        gameRunning = true;
        startBtn.textContent = '暂停';
        audioManager.playBackground(); // 播放背景音乐
        gameLoop();
    } else {
        gameRunning = false;
        startBtn.textContent = '继续';
        audioManager.stopBackground(); // 暂停时停止背景音乐
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