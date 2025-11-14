import React, { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';
import { getMoleImage } from '../utils/imageLoader';
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

  // 获取地鼠图片
  const moleImage = getMoleImage(moleStyle);

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
          <img 
            src={moleImage} 
            alt="地鼠" 
            className="mole-image"
          />
        </div>
      </div>
    </div>
  );
}

export default Mole;
