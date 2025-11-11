// 音效管理器
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.bgmGainNode = null;
    this.sfxGainNode = null;
    this.bgmOscillators = [];
    this.isMuted = false;
    this.isBgmMuted = false; // 单独控制背景音乐的静音状态
    this.bgmVolume = 0.3;
    this.sfxVolume = 0.5;
    this.bgmInterval = null;
    this.isPlaying = false;
    this.currentBgmType = 'happy'; // 当前背景音乐类型
    this.previewTimeouts = []; // 存储试听的定时器
    this.previewOscillators = []; // 存储试听的振荡器
    
    // 定义多种背景音乐旋律
    this.bgmMelodies = {
      happy: [
        { freq: 523.25, duration: 0.3 }, // C5
        { freq: 587.33, duration: 0.3 }, // D5
        { freq: 659.25, duration: 0.3 }, // E5
        { freq: 587.33, duration: 0.3 }, // D5
        { freq: 523.25, duration: 0.3 }, // C5
        { freq: 587.33, duration: 0.3 }, // D5
        { freq: 659.25, duration: 0.6 }, // E5
        { freq: 523.25, duration: 0.3 }, // C5
        { freq: 587.33, duration: 0.3 }, // D5
        { freq: 659.25, duration: 0.3 }, // E5
        { freq: 698.46, duration: 0.3 }, // F5
        { freq: 783.99, duration: 0.6 }, // G5
      ],
      calm: [
        { freq: 392.00, duration: 0.5 }, // G4
        { freq: 523.25, duration: 0.5 }, // C5
        { freq: 659.25, duration: 0.5 }, // E5
        { freq: 523.25, duration: 0.5 }, // C5
        { freq: 392.00, duration: 0.5 }, // G4
        { freq: 440.00, duration: 0.5 }, // A4
        { freq: 493.88, duration: 1.0 }, // B4
      ],
      energetic: [
        { freq: 523.25, duration: 0.2 }, // C5
        { freq: 659.25, duration: 0.2 }, // E5
        { freq: 783.99, duration: 0.2 }, // G5
        { freq: 1046.5, duration: 0.2 }, // C6
        { freq: 783.99, duration: 0.2 }, // G5
        { freq: 659.25, duration: 0.2 }, // E5
        { freq: 523.25, duration: 0.4 }, // C5
        { freq: 587.33, duration: 0.2 }, // D5
        { freq: 698.46, duration: 0.2 }, // F5
        { freq: 880.00, duration: 0.2 }, // A5
        { freq: 698.46, duration: 0.2 }, // F5
        { freq: 587.33, duration: 0.4 }, // D5
      ],
      dreamy: [
        { freq: 440.00, duration: 0.6 }, // A4
        { freq: 493.88, duration: 0.6 }, // B4
        { freq: 523.25, duration: 0.6 }, // C5
        { freq: 587.33, duration: 0.6 }, // D5
        { freq: 659.25, duration: 0.6 }, // E5
        { freq: 587.33, duration: 0.6 }, // D5
        { freq: 523.25, duration: 1.2 }, // C5
      ]
    };
  }

  // 初始化音频上下文
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // 创建音量控制节点
      this.bgmGainNode = this.audioContext.createGain();
      this.bgmGainNode.gain.value = this.bgmVolume;
      this.bgmGainNode.connect(this.audioContext.destination);
      
      this.sfxGainNode = this.audioContext.createGain();
      this.sfxGainNode.gain.value = this.sfxVolume;
      this.sfxGainNode.connect(this.audioContext.destination);
    }
  }

  // 播放背景音乐（欢快的旋律）
  playBackgroundMusic(bgmType = null) {
    this.init();
    
    if (this.isPlaying) {
      return; // 已经在播放
    }

    // 如果指定了类型，切换音乐
    if (bgmType && this.bgmMelodies[bgmType]) {
      this.currentBgmType = bgmType;
    }

    this.isPlaying = true;

    const melody = this.bgmMelodies[this.currentBgmType];
    let noteIndex = 0;
    const noteDuration = melody[0].duration * 1000; // 转换为毫秒

    const playNote = () => {
      if (!this.isPlaying || this.isBgmMuted) {
        return;
      }

      const note = melody[noteIndex % melody.length];
      const currentTime = this.audioContext.currentTime;
      
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, currentTime);
      
      gain.gain.setValueAtTime(0, currentTime);
      gain.gain.linearRampToValueAtTime(this.bgmVolume * 0.3, currentTime + 0.05);
      gain.gain.setValueAtTime(this.bgmVolume * 0.3, currentTime + note.duration - 0.05);
      gain.gain.linearRampToValueAtTime(0, currentTime + note.duration);

      osc.connect(gain);
      gain.connect(this.bgmGainNode);

      osc.start(currentTime);
      osc.stop(currentTime + note.duration);
      
      // 清理振荡器，防止内存泄漏
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };

      noteIndex++;
    };

    // 使用固定间隔播放，而不是递归setTimeout
    playNote(); // 立即播放第一个音符
    
    // 使用setInterval，每300ms播放一个音符
    this.bgmInterval = setInterval(() => {
      if (this.isPlaying && !this.isBgmMuted) {
        playNote();
      }
    }, noteDuration);
  }
  
  // 切换背景音乐类型
  changeBgmType(bgmType) {
    if (!this.bgmMelodies[bgmType]) {
      return;
    }
    
    const wasPlaying = this.isPlaying;
    this.stopBackgroundMusic();
    this.currentBgmType = bgmType;
    
    if (wasPlaying) {
      setTimeout(() => {
        this.playBackgroundMusic();
      }, 100);
    }
  }
  
  // 停止试听
  stopPreview() {
    // 清除所有试听定时器
    this.previewTimeouts.forEach(timeout => {
      clearTimeout(timeout);
    });
    this.previewTimeouts = [];
    
    // 停止所有试听振荡器
    this.previewOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // 忽略已经停止的振荡器
      }
    });
    this.previewOscillators = [];
  }
  
  // 试听背景音乐（播放一遍）
  previewBgm(bgmType) {
    this.init();
    
    if (!this.bgmMelodies[bgmType]) {
      return;
    }
    
    if (this.isBgmMuted) {
      return;
    }
    
    // 先停止之前的试听
    this.stopPreview();
    
    const melody = this.bgmMelodies[bgmType];
    let noteIndex = 0;
    
    const playNote = (index) => {
      if (index >= melody.length) {
        return; // 播放完成
      }
      
      const note = melody[index];
      const currentTime = this.audioContext.currentTime;
      
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, currentTime);
      
      gain.gain.setValueAtTime(0, currentTime);
      gain.gain.linearRampToValueAtTime(this.bgmVolume * 0.4, currentTime + 0.05);
      gain.gain.setValueAtTime(this.bgmVolume * 0.4, currentTime + note.duration - 0.05);
      gain.gain.linearRampToValueAtTime(0, currentTime + note.duration);
      
      osc.connect(gain);
      gain.connect(this.bgmGainNode);
      
      osc.start(currentTime);
      osc.stop(currentTime + note.duration);
      
      // 记录振荡器，便于停止
      this.previewOscillators.push(osc);
      
      // 清理资源
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
        // 从数组中移除
        const idx = this.previewOscillators.indexOf(osc);
        if (idx > -1) {
          this.previewOscillators.splice(idx, 1);
        }
      };
      
      // 播放下一个音符
      const timeout = setTimeout(() => {
        playNote(index + 1);
      }, note.duration * 1000);
      
      // 记录定时器，便于停止
      this.previewTimeouts.push(timeout);
    };
    
    // 开始播放
    playNote(0);
  }

  // 停止背景音乐
  stopBackgroundMusic() {
    this.isPlaying = false;
    
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    
    // 清理所有振荡器
    this.bgmOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // 忽略已经停止的振荡器
      }
    });
    this.bgmOscillators = [];
  }

  // 播放正确音效
  playCorrectSound() {
    this.init();
    if (this.isMuted) return;

    const currentTime = this.audioContext.currentTime;
    
    // 上升音调的欢快音效
    const frequencies = [523.25, 659.25, 783.99]; // C-E-G
    frequencies.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, currentTime);
      
      const startTime = currentTime + index * 0.1;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.4, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
      
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      
      osc.start(startTime);
      osc.stop(startTime + 0.2);
      
      // 清理资源
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    });
  }

  // 播放错误音效
  playWrongSound() {
    this.init();
    if (this.isMuted) return;

    const currentTime = this.audioContext.currentTime;
    
    // 下降音调的提示音效
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, currentTime + 0.3);
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.3, currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    
    osc.start(currentTime);
    osc.stop(currentTime + 0.3);
    
    // 清理资源
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  // 播放点击音效
  playClickSound() {
    this.init();
    if (this.isMuted) return;

    const currentTime = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, currentTime);
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.2, currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    
    osc.start(currentTime);
    osc.stop(currentTime + 0.1);
    
    // 清理资源
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  // 播放胜利音效
  playVictorySound() {
    this.init();
    if (this.isMuted) return;

    const currentTime = this.audioContext.currentTime;
    
    // 胜利旋律
    const melody = [
      { freq: 523.25, duration: 0.15 }, // C
      { freq: 659.25, duration: 0.15 }, // E
      { freq: 783.99, duration: 0.15 }, // G
      { freq: 1046.5, duration: 0.4 },  // C高音
    ];

    melody.forEach((note, index) => {
      const startTime = currentTime + index * 0.15;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.5, startTime + 0.05);
      gain.gain.setValueAtTime(this.sfxVolume * 0.5, startTime + note.duration - 0.05);
      gain.gain.linearRampToValueAtTime(0.01, startTime + note.duration);
      
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      
      osc.start(startTime);
      osc.stop(startTime + note.duration);
      
      // 清理资源
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    });
  }

  // 播放单词发音
  speakWord(word, isEnglish = true) {
    if (this.isMuted || !window.speechSynthesis) return Promise.resolve();

    return new Promise((resolve) => {
      // 取消之前的发音
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word);
      
      // 设置语言
      utterance.lang = isEnglish ? 'en-US' : 'zh-CN';
      
      // 设置语速和音调
      utterance.rate = 0.9; // 稍慢一点，更清晰
      utterance.pitch = 1.0;
      utterance.volume = this.sfxVolume;
      
      // 发音结束后resolve
      utterance.onend = () => {
        resolve();
      };
      
      // 发音出错也resolve，继续游戏
      utterance.onerror = () => {
        resolve();
      };
      
      window.speechSynthesis.speak(utterance);
    });
  }

  // 切换静音
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBackgroundMusic();
    }
    return this.isMuted;
  }

  // 切换背景音乐静音（不影响单词语音）
  toggleBgmMute() {
    this.isBgmMuted = !this.isBgmMuted;
    if (this.isBgmMuted) {
      this.stopBackgroundMusic();
    }
    return this.isBgmMuted;
  }

  // 设置音量
  setVolume(bgm, sfx) {
    this.bgmVolume = Math.max(0, Math.min(1, bgm)); // 限制在0-1之间
    this.sfxVolume = Math.max(0, Math.min(1, sfx));
    if (this.bgmGainNode) {
      this.bgmGainNode.gain.value = this.bgmVolume;
    }
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = this.sfxVolume;
    }
  }
}

// 创建单例
const soundManager = new SoundManager();

export default soundManager;
