// 游戏基础配置
export const GAME_CONFIG = {
    BASE_SPEED: 10,
    FOOD_SPAWN_INTERVAL: 10000,    // 特殊食物生成间隔（毫秒）
    EFFECT_DURATION: 5000,         // 效果持续时间（毫秒）
    BLACK_FOOD_DURATION: 5000,     // 黑色食物持续时间（毫秒）
    BLACK_FOOD_PROBABILITY: 0.05   // 黑色食物生成概率
};

// 食物类型定义
export const FOOD_TYPES = {
    // 蟠桃：提供无敌效果
    PEACH: {
        id: 'peach',
        name: '蟠桃',
        color: '#ffd700',
        points: 10,
        size: 1.2,
        probability: 0.08,
        renderShape: 'peach',
        glowColor: 'rgba(255, 215, 0, 0.3)',
        effect: {
            type: 'immortal',
            duration: 5000,
            description: '无敌状态'
        }
    },
    
    // 火龙果：提供加速效果
    DRAGON_FRUIT: {
        id: 'dragonFruit',
        name: '火龙果',
        color: '#ff4d4d',
        points: 15,
        size: 1.1,
        probability: 0.15,
        renderShape: 'dragon',
        trailColor: '#ff6b6b',
        effect: {
            type: 'speed',
            duration: 15000,
            multiplier: 1.5,
            description: '速度提升'
        }
    },
    
    // 黑色食物：游戏结束
    BLACK_FOOD: {
        id: 'blackFood',
        name: '黑色食物',
        color: '#000000',
        points: 0,
        size: 1,
        probability: 0.05,
        renderShape: 'circle',
        isDeadly: true
    },
    
    // 玉露：缩小效果
    JADE_DEW: {
        id: 'jadeDew',
        name: '玉露',
        color: '#7fffd4',
        points: 20,
        size: 0.8,
        probability: 0.12,
        renderShape: 'dew',
        sparkleColor: '#98ff98',
        effect: {
            type: 'shrink',
            duration: 4000,
            scale: 0.7,
            description: '体型缩小'
        }
    },
    
    // 金丹：提供治愈效果
    GOLDEN_PILL: {
        id: 'goldenPill',
        name: '金丹',
        color: '#ffa500',
        points: 25,
        size: 0.9,
        probability: 0.1,
        renderShape: 'pill',
        pulseColor: '#ffb84d',
        effect: {
            type: 'heal',
            healCount: 3,
            description: '治愈能力'
        }
    },
    
    // 普通食物
    NORMAL: {
        id: 'normal',
        name: '普通食物',
        color: '#4CAF50',
        points: 1,
        size: 1,
        probability: 0.5,
        renderShape: 'circle'
    }
};

// 食物形状渲染函数
export const FOOD_SHAPES = {
    peach: (ctx, x, y, size, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 叶子
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.ellipse(x - size/2, y - size, size/2, size/4, Math.PI/4, 0, Math.PI * 2);
        ctx.fill();
    },
    
    dragon: (ctx, x, y, size, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        
        // 主体
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 鳞片效果
        ctx.strokeStyle = '#ff6b6b';
        for(let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(x, y, size * (0.5 + i * 0.1), 0, Math.PI/2);
            ctx.stroke();
        }
    },
    
    dew: (ctx, x, y, size, color) => {
        ctx.fillStyle = color;
        
        // 水滴形状
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.bezierCurveTo(
            x + size, y - size,
            x + size, y + size,
            x, y + size
        );
        ctx.bezierCurveTo(
            x - size, y + size,
            x - size, y - size,
            x, y - size
        );
        ctx.fill();
        
        // 光泽效果
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x - size/3, y - size/3, size/4, size/2, Math.PI/4, 0, Math.PI * 2);
        ctx.fill();
    },
    
    pill: (ctx, x, y, size, color) => {
        ctx.fillStyle = color;
        
        // 药丸形状
        ctx.beginPath();
        ctx.ellipse(x, y, size, size/2, Math.PI/4, 0, Math.PI * 2);
        ctx.fill();
        
        // 金光效果
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        for(let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(x, y - size - i * 3);
            ctx.lineTo(x, y - size - i * 3 - 5);
            ctx.stroke();
        }
    },
    
    circle: (ctx, x, y, size, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}; 