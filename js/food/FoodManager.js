import { FOOD_TYPES, GAME_CONFIG } from '../config/foodConfig.js';

export class FoodManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.gridSize = 20;
        this.tileCount = canvas.width / this.gridSize;
        this.currentFood = null;
        this.lastSpawnTime = 0;
        this.isFirstFood = true;
        this.specialFoodTimeout = null;
    }

    // 生成新食物
    generateFood() {
        // 第一个食物必须是火龙果
        if (this.isFirstFood) {
            const position = this._getRandomPosition();
            this.currentFood = {
                ...FOOD_TYPES.DRAGON_FRUIT,
                x: position.x,
                y: position.y,
                spawnTime: Date.now()
            };
            this.isFirstFood = false;
            return;
        }
        
        // 随机生成黑色食物
        if (Math.random() < GAME_CONFIG.BLACK_FOOD_PROBABILITY) {
            const position = this._getRandomPosition();
            this.currentFood = {
                ...FOOD_TYPES.BLACK_FOOD,
                x: position.x,
                y: position.y,
                spawnTime: Date.now()
            };
            return;
        }

        // 随机选择其他食物类型
        const foodType = this._selectFoodType();
        const position = this._getRandomPosition();
        
        this.currentFood = {
            ...foodType,
            x: position.x,
            y: position.y,
            spawnTime: Date.now()
        };
    }

    // 更新食物状态
    update(currentTime) {
        if (!this.currentFood) {
            this.generateFood();
            this.lastSpawnTime = currentTime;
            return;
        }
        
        // 检查黑色食物是否需要消失
        if (this.currentFood.id === 'blackFood' && 
            currentTime - this.currentFood.spawnTime > GAME_CONFIG.BLACK_FOOD_DURATION) {
            this.clearFood();
            return;
        }
        
        // 检查特殊食物是否需要消失
        if (this.currentFood.id !== 'normal' && this.currentFood.id !== 'blackFood' &&
            currentTime - this.currentFood.spawnTime > GAME_CONFIG.FOOD_SPAWN_INTERVAL) {
            this.clearFood();
        }
    }

    // 检查是否与蛇发生碰撞
    checkCollision(snake) {
        if (!this.currentFood) return false;
        return this.currentFood.x === snake.x && this.currentFood.y === snake.y;
    }

    // 清除当前食物
    clearFood() {
        this.currentFood = null;
    }

    // 获取当前食物
    getCurrentFood() {
        return this.currentFood;
    }

    // 重置食物管理器
    reset() {
        this.currentFood = null;
        this.isFirstFood = true;
    }

    // 私有方法：选择食物类型
    _selectFoodType() {
        const rand = Math.random();
        let cumulativeProbability = 0;
        
        // 遍历所有食物类型（排除黑色食物和火龙果）
        for (const [key, foodType] of Object.entries(FOOD_TYPES)) {
            if (key === 'BLACK_FOOD' || key === 'DRAGON_FRUIT') continue; // 跳过黑色食物和火龙果
            
            cumulativeProbability += foodType.probability;
            if (rand <= cumulativeProbability) {
                return foodType;
            }
        }
        
        // 默认返回普通食物
        return FOOD_TYPES.NORMAL;
    }

    // 私有方法：获取随机位置
    _getRandomPosition() {
        return {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
    }
} 