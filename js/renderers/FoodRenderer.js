import { FOOD_SHAPES } from '../config/foodConfig.js';

export class FoodRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.gridSize = 20;
        this.animations = new Map();
    }

    // 渲染食物
    render(food, currentTime) {
        const x = food.x * this.gridSize + this.gridSize/2;
        const y = food.y * this.gridSize + this.gridSize/2;
        const size = (this.gridSize/2 - 2) * food.size;

        // 保存当前上下文状态
        this.ctx.save();

        // 渲染特殊效果
        this._renderSpecialEffects(food, x, y, size, currentTime);

        // 渲染食物形状
        const renderShape = FOOD_SHAPES[food.renderShape] || FOOD_SHAPES.circle;
        renderShape(this.ctx, x, y, size, food.color);

        // 恢复上下文状态
        this.ctx.restore();
    }

    // 渲染特殊效果
    _renderSpecialEffects(food, x, y, size, currentTime) {
        switch (food.id) {
            case 'peach':
                this._renderGlowEffect(x, y, size * 1.5, food.glowColor);
                break;
                
            case 'dragonFruit':
                this._renderFireEffect(x, y, size, food.trailColor, currentTime);
                break;
                
            case 'jadeDew':
                this._renderSparkleEffect(x, y, size, food.sparkleColor, currentTime);
                break;
                
            case 'goldenPill':
                this._renderPulseEffect(x, y, size, food.pulseColor, currentTime);
                break;
        }
    }

    // 发光效果
    _renderGlowEffect(x, y, size, color) {
        const gradient = this.ctx.createRadialGradient(x, y, size * 0.5, x, y, size);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // 火焰效果
    _renderFireEffect(x, y, size, color, currentTime) {
        const flameCount = 8;
        const angleStep = (Math.PI * 2) / flameCount;
        const flickerSpeed = 0.005;
        
        for (let i = 0; i < flameCount; i++) {
            const flicker = Math.sin(currentTime * flickerSpeed + i) * 0.3 + 0.7;
            const angle = i * angleStep;
            const flameSize = size * flicker;
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.quadraticCurveTo(
                x + Math.cos(angle) * flameSize * 2,
                y + Math.sin(angle) * flameSize * 2,
                x + Math.cos(angle) * flameSize,
                y + Math.sin(angle) * flameSize
            );
            this.ctx.fill();
        }
    }

    // 闪光效果
    _renderSparkleEffect(x, y, size, color, currentTime) {
        const sparkleCount = 6;
        const angleStep = (Math.PI * 2) / sparkleCount;
        const sparkleSpeed = 0.003;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = Math.sin(currentTime * sparkleSpeed + i * 1.5) * 0.5 + 0.5;
            const angle = i * angleStep;
            const distance = size * 2 * sparkle;
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(
                x + Math.cos(angle) * distance,
                y + Math.sin(angle) * distance,
                size * 0.2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }
    }

    // 脉冲效果
    _renderPulseEffect(x, y, size, color, currentTime) {
        const pulseSpeed = 0.002;
        const pulse = Math.sin(currentTime * pulseSpeed) * 0.3 + 0.7;
        const pulseSize = size * 1.5 * pulse;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    // 清除所有动画
    clearAnimations() {
        this.animations.clear();
    }
} 