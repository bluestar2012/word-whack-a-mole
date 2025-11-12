import React, { useEffect } from 'react';
import soundManager from '../utils/soundManager';
import './GameOver.css';

function GameOver({ score, onPlayAgain, onBackToHome }) {
  // 播放胜利音效
  useEffect(() => {
    soundManager.stopBackgroundMusic();
    soundManager.playVictorySound();
  }, []);

  // 根据分数获取评级
  const getRating = () => {
    if (score < 50) return { title: '新手猎人', emoji: '🌱', message: '加油！继续努力！' };
    if (score < 100) return { title: '猎鼠新星', emoji: '⭐', message: '不错哦！继续加油！' };
    if (score < 200) return { title: '猎鼠高手', emoji: '🏆', message: '非常棒！你很厉害！' };
    if (score < 300) return { title: '猎鼠大师', emoji: '👑', message: '太厉害了！你是天才！' };
    return { title: '传奇猎人', emoji: '💎', message: '无人能敵！你是最强的！' };
  };

  const rating = getRating();

  const handlePlayAgain = () => {
    soundManager.playClickSound();
    onPlayAgain();
  };

  const handleBackToHome = () => {
    soundManager.playClickSound();
    onBackToHome();
  };

  return (
    <div className="game-over">
      <div className="result-container">
        <div className="confetti">🎉 🎊 ✨ 🎈 🎁</div>
        
        <h1 className="game-over-title">猎鼠结束！</h1>
        
        <div className="result-content">
          <div className="rating-section">
            <div className="rating-emoji">{rating.emoji}</div>
            <h2 className="rating-title">{rating.title}</h2>
            <p className="rating-message">{rating.message}</p>
          </div>

          <div className="score-section">
            <div className="final-score-label">最终得分</div>
            <div className="final-score">{score}</div>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-label">正确率</div>
              <div className="stat-value">{score > 0 ? Math.min(95, Math.floor(score / 3)) : 0}%</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-label">最高连击</div>
              <div className="stat-value">{Math.floor(score / 20)}</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">💥</div>
              <div className="stat-label">消灭数</div>
              <div className="stat-value">{Math.floor(score / 8)}</div>
            </div>
          </div>

          <div className="encouragement">
            <p>💪 坚持猎鼠，你会变得更强！</p>
          </div>
        </div>

        <div className="button-group">
          <button className="result-button play-again" onClick={handlePlayAgain}>
            🔄 再玩一次
          </button>
          <button className="back-home-button" onClick={handleBackToHome}>
            ← 返回首页
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameOver;
