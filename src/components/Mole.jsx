import React, { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';
import './Mole.css';

function Mole({ word, onClick, moleStyle = 'default' }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // 地鼠弹出动画
    setIsVisible(false);
    setIsClicked(false);
    setTimeout(() => setIsVisible(true), 100);
  }, [word]);

  // 根据样式获取颜色
  const getMoleColors = () => {
    switch (moleStyle) {
      case 'cute':
        return {
          gradient: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 50%, #FFB6C1 100%)',
          border: '#FF69B4'
        };
      case 'cool':
        return {
          gradient: 'linear-gradient(135deg, #4A90E2 0%, #5FA8D3 50%, #4A90E2 100%)',
          border: '#2E5C8A'
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
          border: '#654321'
        };
    }
  };

  const colors = getMoleColors();

  const handleClick = () => {
    if (isClicked) return; // 防止重复点击
    setIsClicked(true);
    soundManager.playClickSound();
    onClick();
  };

  return (
    <div 
      className={`mole ${isVisible ? 'visible' : ''} ${isClicked ? 'clicked' : ''}`}
      onClick={handleClick}
    >
      {/* 单词牌子 - 在地鼠头顶 */}
      <div className="word-sign">
        {word}
      </div>

      {/* 地鼠身体 */}
      <div className="mole-body">
        {/* 头部 */}
        <div className="mole-head">
          <div className="mole-face" style={{ background: colors.gradient, borderColor: colors.border }}>
            <div className="mole-eyes">
              <div className="eye left"></div>
              <div className="eye right"></div>
            </div>
            <div className="mole-nose"></div>
            <div className="mole-mouth"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mole;
