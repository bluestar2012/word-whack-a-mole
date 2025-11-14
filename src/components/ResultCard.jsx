import React, { useEffect } from 'react';
import './ResultCard.css';

function ResultCard({ mole, onClose, isVisible = false }) {
  // 自动关闭定时器
  useEffect(() => {
    if (!isVisible || !mole) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible, mole, onClose]);

  if (!isVisible || !mole) return null;

  const { isCorrect, points, wordData, questionType } = mole;

  // 点击卡片背景关闭
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 点击卡片本身关闭
  const handleCardClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="result-card-overlay" onClick={handleOverlayClick}>
      <div className={`result-card ${isCorrect ? 'correct' : 'wrong'}`} onClick={handleCardClick}>
        {/* 结果标题 */}
        <div className="result-header">
          {isCorrect ? (
            <>
              <div className="result-icon">✔</div>
              <div className="result-title">消灭成功！</div>
            </>
          ) : (
            <>
              <div className="result-icon">✘</div>
              <div className="result-title">打偏了！</div>
            </>
          )}
        </div>

        {/* 得分信息 */}
        <div className="result-score">
          {isCorrect ? (
            <>
              <span className="score-label">获得分数</span>
              <span className="score-value">+{points}</span>
            </>
          ) : (
            <>
              <span className="score-label">扣除分数</span>
              <span className="score-value">-5</span>
            </>
          )}
        </div>

        {/* 单词详情 */}
        {wordData && (
          <div className="word-details">
            <div className="word-english">
              <span className="detail-label">英文：</span>
              <span className="detail-value">{wordData.english}</span>
            </div>
            <div className="word-chinese">
              <span className="detail-label">含义：</span>
              <span className="detail-value">{wordData.chineseDesc?wordData.chineseDesc:wordData.chinese}</span>
            </div>
          </div>
        )}

        {/* 进度条动画 */}
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>


      </div>
    </div>
  );
}

export default ResultCard;
