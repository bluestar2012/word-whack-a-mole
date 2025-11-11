import React, { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';
import './Leaderboard.css';

function Leaderboard({ onBack }) {
  const [records, setRecords] = useState([]);

  // 加载排行榜数据
  useEffect(() => {
    const savedRecords = localStorage.getItem('gameRecords');
    if (savedRecords) {
      try {
        const parsedRecords = JSON.parse(savedRecords);
        setRecords(parsedRecords);
      } catch (e) {
        console.error('Failed to load records:', e);
        setRecords([]);
      }
    }
  }, []);

  // 清空排行榜
  const handleClear = () => {
    if (window.confirm('确定要清空所有排行榜记录吗？')) {
      localStorage.removeItem('gameRecords');
      setRecords([]);
      soundManager.playClickSound();
    }
  };

  // 返回首页
  const handleBackClick = () => {
    soundManager.playClickSound();
    onBack();
  };

  // 获取排名奖章
  const getRankMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  // 格式化日期时间
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 获取等级称号
  const getRankTitle = (score) => {
    if (score < 50) return '新手猎人';
    if (score < 100) return '猎鼠新星';
    if (score < 200) return '猎鼠高手';
    if (score < 300) return '猎鼠大师';
    return '传奇猎人';
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <h1 className="leaderboard-title">🏆 猎鼠排行榜 🏆</h1>
        <p className="leaderboard-subtitle">历史最佳战绩记录（最多20条）</p>

        <div className="records-wrapper">
          {records.length === 0 ? (
            <div className="no-records">
              <div className="no-records-icon">📊</div>
              <p className="no-records-text">暂无猎鼠记录</p>
              <p className="no-records-hint">快去猎鼠创建你的第一条记录吧！</p>
            </div>
          ) : (
            <div className="records-list">
              {records.map((record, index) => (
                <div 
                  key={record.id} 
                  className={`record-item ${index < 3 ? 'top-three' : ''} rank-${index + 1}`}
                >
                  <div className="rank-badge">
                    <span className="rank-number">{getRankMedal(index)}</span>
                  </div>
                  
                  <div className="record-details">
                    <div className="record-main">
                      <div className="record-score">
                        <span className="score-label">战绩:</span>
                        <span className="score-value">{record.score}</span>
                      </div>
                      <div className="record-title">
                        <span className="title-badge">{getRankTitle(record.score)}</span>
                      </div>
                    </div>
                    
                    <div className="record-meta">
                      <div className="meta-item">
                        <span className="meta-icon">🏚️</span>
                        <span className="meta-text">{record.scope.replace('年级', '号鼠窝')}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">⏱️</span>
                        <span className="meta-text">{record.duration}秒</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">🔥</span>
                        <span className="meta-text">最高{record.maxCombo}连击</span>
                      </div>
                    </div>
                    
                    <div className="record-time">
                      <span className="time-icon">🕐</span>
                      <span className="time-text">{formatDateTime(record.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="leaderboard-actions">
          {records.length > 0 && (
            <button className="clear-button" onClick={handleClear}>
              🗑️ 清空记录
            </button>
          )}
          <button className="back-button" onClick={handleBackClick}>
            ← 返回首页
          </button>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
