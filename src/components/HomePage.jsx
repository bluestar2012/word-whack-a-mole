import React from 'react';
import soundManager from '../utils/soundManager';
import wrongWordsManager from '../utils/wrongWordsManager';
import './HomePage.css';

function HomePage({ onStartGame, onOpenSettings, onOpenLeaderboard, onOpenChallenge }) {
  const handleButtonClick = (callback) => {
    soundManager.playClickSound();
    callback();
  };

  // 获取错题本数量
  const wrongWordsCount = wrongWordsManager.getWrongWordsCount();

  return (
    <div className="home-page">
      <div className="home-content">
        <div className="title-container">
          <h1 className="game-title">🎯 快乐打地鼠 🎯</h1>
          <p className="game-subtitle">Word Whack-A-Mole</p>
          <p className="game-description">快乐猎鼠，轻松记单词！</p>
        </div>
        
        <div className="button-container">
          <button className="menu-button start-button" onClick={() => handleButtonClick(onStartGame)}>
            🎯 开始猎鼠
          </button>
          <button className="menu-button challenge-button" onClick={() => handleButtonClick(onOpenChallenge)}>
            ⚡ 极限猎鼠
            {wrongWordsCount > 0 && <span className="badge">{wrongWordsCount}</span>}
          </button>
          <button className="menu-button leaderboard-button" onClick={() => handleButtonClick(onOpenLeaderboard)}>
            🏆 排行榜
          </button>
          <button className="menu-button settings-button" onClick={() => handleButtonClick(onOpenSettings)}>
            ⚙️ 设置
          </button>
          <button className="menu-button exit-button" onClick={() => { soundManager.playClickSound(); window.close(); }}>
            🚪 退出
          </button>
        </div>

        <div className="footer">
          <p>适合 6-12 岁小猎人 | 人教版新起点英语</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
