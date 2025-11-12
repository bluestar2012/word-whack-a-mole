import React, { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';
import learningProgressManager from '../utils/learningProgressManager';
import wrongWordsManager from '../utils/wrongWordsManager';
import { getAvailableScopes } from '../vocabularyData';
import './Settings.css';

function Settings({ onBack }) {
  const [settings, setSettings] = useState({
    gameDuration: 60, // 默认60秒
    bgmVolume: 30, // 背景音乐音量 0-100
    sfxVolume: 50, // 音效音量 0-100
    moleStyle: 'default', // 地鼠样式
    bgmType: 'happy', // 背景音乐类型
    startingScope: '1年级' // 起始鼠窝
  });

  // 从localStorage加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        // 应用音量设置
        soundManager.setVolume(parsed.bgmVolume / 100, parsed.sfxVolume / 100);
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // 保存设置
  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gameSettings', JSON.stringify(newSettings));
    // 实时应用音量设置
    soundManager.setVolume(newSettings.bgmVolume / 100, newSettings.sfxVolume / 100);
  };

  // 更新游戏时长
  const handleDurationChange = (e) => {
    const duration = parseInt(e.target.value);
    const newSettings = { ...settings, gameDuration: duration };
    saveSettings(newSettings);
    soundManager.playClickSound();
  };

  // 更新背景音乐音量
  const handleBgmVolumeChange = (e) => {
    const volume = parseInt(e.target.value);
    const newSettings = { ...settings, bgmVolume: volume };
    saveSettings(newSettings);
  };

  // 更新音效音量
  const handleSfxVolumeChange = (e) => {
    const volume = parseInt(e.target.value);
    const newSettings = { ...settings, sfxVolume: volume };
    saveSettings(newSettings);
    // 播放测试音效
    soundManager.playClickSound();
  };

  // 更新地鼠样式
  const handleMoleStyleChange = (style) => {
    const newSettings = { ...settings, moleStyle: style };
    saveSettings(newSettings);
    soundManager.playClickSound();
  };
  
  const handleBgmTypeChange = (bgmType) => {
    // 先试听
    soundManager.previewBgm(bgmType);
    soundManager.playClickSound();
    
    // 延迟保存设置，让用户听完试听
    setTimeout(() => {
      const newSettings = { ...settings, bgmType };
      saveSettings(newSettings);
      soundManager.changeBgmType(bgmType);
    }, 100);
  };
  
  // 更新起始鼠窝
  const handleStartingScopeChange = (scope) => {
    // 显示成人验证模态框
    showAdultVerification(scope);
  };
  
  // 显示成人验证模态框
  const showAdultVerification = (scope) => {
    const verificationModal = document.createElement('div');
    verificationModal.className = 'verification-modal';
    verificationModal.innerHTML = `
      <div class="verification-content">
        <h3>🔒 成人验证</h3>
        <p>为了确保学习效果，请成人协助完成以下验证：</p>
        <div class="math-problem">
          <span class="problem-text">${generateMathProblem()}</span>
        </div>
        <input type="number" id="math-answer" placeholder="请输入计算结果" />
        <div class="verification-actions">
          <button id="verify-confirm" class="verify-button">确认</button>
          <button id="verify-cancel" class="cancel-button">取消</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(verificationModal);
    
    // 添加事件监听器
    document.getElementById('verify-confirm').addEventListener('click', () => {
      const userAnswer = parseInt(document.getElementById('math-answer').value);
      const correctAnswer = getMathProblemAnswer();
      
      if (userAnswer === correctAnswer) {
        // 验证通过，保存设置
        const newSettings = { ...settings, startingScope: scope };
        saveSettings(newSettings);
        soundManager.playClickSound();
        document.body.removeChild(verificationModal);
        alert('✅ 设置已保存！');
      } else {
        soundManager.playWrongSound();
        alert('❌ 计算结果不正确，请重新输入！');
      }
    });
    
    document.getElementById('verify-cancel').addEventListener('click', () => {
      soundManager.playClickSound();
      document.body.removeChild(verificationModal);
    });
  };
  
  // 生成简体中文提示+繁体中文数字的数学题
  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    window.currentMathAnswer = num1 * num2; // 保存答案到全局变量
    
    // 繁体中文数字
    const traditionalNumbers = ['零', '壹', '貳', '叁', '肆', '伍', '陸', '柒', '捌', '玖', '拾', '拾壹', '拾貳'];
    const traditionalNum1 = traditionalNumbers[num1];
    const traditionalNum2 = traditionalNumbers[num2];
    
    return '请计算：' + traditionalNum1 + ' × ' + traditionalNum2 + ' = ?';
  };
  
  // 获取数学题答案
  const getMathProblemAnswer = () => {
    return window.currentMathAnswer || 0;
  };

  // 重置设置
  const handleReset = () => {
    const defaultSettings = {
      gameDuration: 60,
      bgmVolume: 30,
      sfxVolume: 50,
      moleStyle: 'default',
      bgmType: 'happy',
      startingScope: '1年级'
    };
    saveSettings(defaultSettings);
    soundManager.changeBgmType('happy');
    soundManager.playClickSound();
  };
  
  // 重置数据（清除学习记录）
  const handleResetData = () => {
    // 确认对话框
    if (window.confirm('确定要重置所有学习数据吗？\n\n这将清除：\n• 已学会的单词记录\n• 错题本\n\n此操作不可恢复！')) {
      // 清除学习进度
      learningProgressManager.clearProgress();
      // 清除错题本
      wrongWordsManager.clearWrongWords();
      // 播放提示音
      soundManager.playClickSound();
      // 提示成功
      alert('✅ 学习数据已重置！');
    }
  };

  const handleBackClick = () => {
    soundManager.playClickSound();
    onBack();
  };

  const durationOptions = [30, 60, 90, 120];
  const moleStyles = [
    { id: 'default', name: '经典棕色', emoji: '🦫' },
    { id: 'cute', name: '可爱粉色', emoji: '🐹' },
    { id: 'cool', name: '酷炫蓝色', emoji: '🦦' }
  ];
  const bgmTypes = [
    { id: 'happy', name: '欢快活泼', emoji: '🎵' },
    { id: 'calm', name: '宁静舒缓', emoji: '🌿' },
    { id: 'energetic', name: '热情动感', emoji: '⚡' },
    { id: 'dreamy', name: '梦幻柔和', emoji: '✨' }
  ];
  const availableScopes = getAvailableScopes();

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">⚙️ 游戏设置 ⚙️</h1>

        <div className="settings-content">
          {/* 游戏时长设置 */}
          <div className="settings-section">
            <h2 className="section-title">⏱️ 游戏时长</h2>
            <div className="duration-slider-container">
              <input
                type="range"
                min="30"
                max="180"
                step="30"
                value={settings.gameDuration}
                onChange={handleDurationChange}
                className="duration-slider"
              />
              <div className="duration-value">{settings.gameDuration}秒</div>
              <div className="duration-marks">
                <span className="mark">30s</span>
                <span className="mark">60s</span>
                <span className="mark">90s</span>
                <span className="mark">120s</span>
                <span className="mark">150s</span>
                <span className="mark">180s</span>
              </div>
            </div>
          </div>

          {/* 音量设置 */}
          <div className="settings-section">
            <h2 className="section-title">🔊 音量设置</h2>
            
            <div className="volume-control">
              <label className="volume-label">
                <span className="label-text">🎵 背景音乐</span>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.bgmVolume}
                    onChange={handleBgmVolumeChange}
                    className="volume-slider"
                  />
                  <span className="volume-value">{settings.bgmVolume}%</span>
                </div>
              </label>
            </div>

            <div className="volume-control">
              <label className="volume-label">
                <span className="label-text">🔔 音效音量</span>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.sfxVolume}
                    onChange={handleSfxVolumeChange}
                    className="volume-slider"
                  />
                  <span className="volume-value">{settings.sfxVolume}%</span>
                </div>
              </label>
            </div>
          </div>

          {/* 背景音乐选择 */}
          <div className="settings-section">
            <h2 className="section-title">🎼 背景音乐</h2>
            <p className="section-hint">👉 点击卡片可试听并选择</p>
            <div className="bgm-type-options">
              {bgmTypes.map(bgm => (
                <button
                  key={bgm.id}
                  className={`bgm-type-btn ${settings.bgmType === bgm.id ? 'active' : ''}`}
                  onClick={() => handleBgmTypeChange(bgm.id)}
                >
                  <span className="bgm-emoji">{bgm.emoji}</span>
                  <span className="bgm-name">{bgm.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 地鼠样式设置 */}
          <div className="settings-section">
            <h2 className="section-title">🎨 地鼠样式</h2>
            <div className="mole-style-options">
              {moleStyles.map(style => (
                <button
                  key={style.id}
                  className={`mole-style-btn ${settings.moleStyle === style.id ? 'active' : ''}`}
                  onClick={() => handleMoleStyleChange(style.id)}
                >
                  <span className="style-emoji">{style.emoji}</span>
                  <span className="style-name">{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 起始鼠窝设置 */}
          <div className="settings-section">
            <h2 className="section-title">🏠 起始鼠窝</h2>
            <p className="section-hint">👉 选择游戏开始时的默认鼠窝（需要成人验证）</p>
            <div className="scope-options">
              {availableScopes.map(scope => (
                <button
                  key={scope}
                  className={`scope-btn ${settings.startingScope === scope ? 'active' : ''}`}
                  onClick={() => handleStartingScopeChange(scope)}
                >
                  <span className="scope-name">{scope.replace('年级', '号鼠窝')}</span>
                </button>
              ))}
            </div>
            <div className="current-selection">
              当前选择：{settings.startingScope.replace('年级', '号鼠窝')}
            </div>
          </div>

          {/* 重置数据 - 危险操作区 */}
          <div className="settings-section danger-section">
            <h2 className="section-title">⚠️ 危险操作</h2>
            <button className="reset-data-button" onClick={handleResetData}>
              🗑️ 重置数据
            </button>
            <p className="danger-hint">此操作将清除所有学习记录，不可恢复</p>
          </div>
        </div>

        {/* 按钮组 */}
        <div className="settings-actions">
          <button className="reset-button" onClick={handleReset}>
            🔄 恢复默认
          </button>
          <button className="back-home-button" onClick={handleBackClick}>
            ← 返回首页
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
