export class AudioManager {
    constructor() {
        this.sounds = {
            background: new Audio('assets/sounds/Angel.mp3'),
            gameOver: new Audio('assets/sounds/Bandari-The Sounds of Silence.mp3')
        };

        // 设置背景音乐循环播放
        this.sounds.background.loop = true;
        
        // 设置音量
        this.sounds.background.volume = 0.5;
        this.sounds.gameOver.volume = 0.7;
    }

    // 播放背景音乐
    playBackground() {
        this.sounds.background.currentTime = 0;
        this.sounds.background.play().catch(error => {
            console.log('Auto-play was prevented');
        });
    }

    // 停止背景音乐
    stopBackground() {
        this.sounds.background.pause();
        this.sounds.background.currentTime = 0;
    }

    // 播放游戏结束音效
    playGameOver() {
        this.sounds.gameOver.currentTime = 0;
        this.sounds.gameOver.play().catch(error => {
            console.log('Audio play was prevented');
        });
    }

    // 停止所有音效
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
} 