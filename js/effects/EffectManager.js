import { GAME_CONFIG } from '../config/foodConfig.js';

export class EffectManager {
    constructor() {
        this.activeEffects = new Map();
    }

    // 应用食物效果
    applyEffect(food, snake, gameState) {
        if (!food.effect) return;

        const effect = food.effect;
        const currentTime = Date.now();

        switch (effect.type) {
            case 'immortal':
                // 无敌效果
                snake.isImmortal = true;
                this.activeEffects.set('immortal', {
                    startTime: currentTime,
                    duration: effect.duration,
                    cleanup: () => {
                        snake.isImmortal = false;
                    }
                });
                break;

            case 'speed':
                // 速度提升
                const originalSpeed = gameState.speed;
                gameState.speed *= effect.multiplier;
                this.activeEffects.set('speed', {
                    startTime: currentTime,
                    duration: effect.duration,
                    cleanup: () => {
                        gameState.speed = originalSpeed;
                    }
                });
                break;

            case 'shrink':
                // 缩小效果
                const originalScale = snake.scale;
                snake.scale = effect.scale;
                this.activeEffects.set('shrink', {
                    startTime: currentTime,
                    duration: effect.duration,
                    cleanup: () => {
                        snake.scale = originalScale;
                    }
                });
                break;

            case 'heal':
                // 治愈效果（立即生效）
                snake.healCount += effect.healCount;
                break;
        }
    }

    // 更新效果状态
    update() {
        const currentTime = Date.now();
        
        // 检查并移除过期效果
        for (const [effectType, effect] of this.activeEffects.entries()) {
            if (currentTime - effect.startTime >= effect.duration) {
                effect.cleanup();
                this.activeEffects.delete(effectType);
            }
        }
    }

    // 清除所有效果
    clearAllEffects() {
        for (const effect of this.activeEffects.values()) {
            effect.cleanup();
        }
        this.activeEffects.clear();
    }

    // 获取当前活跃效果
    getActiveEffects() {
        return Array.from(this.activeEffects.keys());
    }
} 