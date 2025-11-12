import React from 'react';
import { getAvailableScopes, getVocabulary, vocabularyData } from '../vocabularyData';
import soundManager from '../utils/soundManager';
import learningProgressManager from '../utils/learningProgressManager';
import './ScopeSelector.css';

function ScopeSelector({ onSelectScope, onBack }) {
  const scopes = getAvailableScopes();
  
  // 获取设置的起始鼠窝
  const getStartingScope = () => {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        return settings.startingScope || scopes[0];
      } catch (e) {
        console.error('Failed to load settings:', e);
        return scopes[0];
      }
    }
    return scopes[0];
  };
  
  // 设置默认选择的鼠窝
  const startingScope = getStartingScope();

  const handleScopeClick = (scope, isLocked) => {
    if (isLocked) {
      soundManager.playWrongSound();
      return;
    }
    soundManager.playClickSound();
    onSelectScope(scope);
  };
  
  // 自动选择起始鼠窝
  React.useEffect(() => {
    if (startingScope && scopes.includes(startingScope)) {
      // 延迟一小段时间再自动选择，确保界面已渲染
      const timer = setTimeout(() => {
        const scopeIndex = scopes.indexOf(startingScope);
        const wordCount = getVocabulary(startingScope).length;
        const completedCount = learningProgressManager.getCompletedScopesCount(vocabularyData);
        const isLocked = scopeIndex > 0 && completedCount < scopeIndex;
        
        // 只有在未锁定的情况下才自动选择
        if (!isLocked) {
          handleScopeClick(startingScope, isLocked);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [startingScope]);

  const handleBackClick = () => {
    soundManager.playClickSound();
    onBack();
  };

  return (
    <div className="scope-selector">
      <div className="scope-container">
        <h1 className="scope-title">🏠 选择地鼠巢穴 🏠</h1>
        <p className="scope-subtitle">选择你要挑战的鼠窝，消灭里面的地鼠吧！</p>
        
        <div className="scope-grid-wrapper">
          <div className="scope-grid">
            {scopes.map((scope, index) => {
              const wordCount = getVocabulary(scope).length;
              const masteredCount = learningProgressManager.getMasteredCountByScope(scope);
              
              // 解锁逻辑：第1个鼠窝自动解锁，从第2个开始需要完成前面的鼠窝
              // 如果设置了起始鼠窝，则起始鼠窝及之前的鼠窝都自动可用
              const completedCount = learningProgressManager.getCompletedScopesCount(vocabularyData);
              const startingScopeIndex = scopes.indexOf(startingScope);
              const isLocked = index > 0 && completedCount < index && index > startingScopeIndex;
              const isCompleted = learningProgressManager.isScopeCompleted(scope, wordCount);
              
              return (
                <button
                  key={scope}
                  className={`scope-card ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => handleScopeClick(scope, isLocked)}
                  disabled={isLocked}
                >
                  {isLocked && (
                    <div className="lock-overlay">
                      <div className="lock-icon">🔒</div>
                      <div className="lock-text">需要完成80%</div>
                      <div className="lock-hint">前{index}个鼠窝</div>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="completed-badge">✅ 已完成</div>
                  )}
                  <div className="scope-icon">🏚️</div>
                  <div className="scope-name">{scope.replace('年级', '号鼠窝')}</div>
                  <div className="word-count">
                    <span className="count-number">{wordCount}</span>
                    <span className="count-label">只地鼠</span>
                  </div>
                  <div className="mastered-progress">
                    <div className="progress-label">⚔️ 已消灭</div>
                    <div className="progress-count">
                      <span className="mastered-number">{masteredCount}</span>
                      <span className="progress-separator">/</span>
                      <span className="total-number">{wordCount}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min(100, (masteredCount / wordCount) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button className="back-home-button" onClick={handleBackClick}>
          ← 返回首页
        </button>
      </div>
    </div>
  );
}

export default ScopeSelector;
