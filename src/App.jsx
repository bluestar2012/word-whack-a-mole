import React, { useState } from 'react';
import HomePage from './components/HomePage';
import GamePlay from './components/GamePlay';
import GameOver from './components/GameOver';
import ScopeSelector from './components/ScopeSelector';
import Settings from './components/Settings';
import Leaderboard from './components/Leaderboard';
import ExtremeChallenge from './components/ExtremeChallenge';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('home'); // home, scope, playing, gameover, settings, leaderboard, challenge
  const [selectedScope, setSelectedScope] = useState('1年级上册');
  const [finalScore, setFinalScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStats, setGameStats] = useState(null);

  const handleStartGame = () => {
    setGameState('scope');
  };

  const handleOpenSettings = () => {
    setGameState('settings');
  };

  const handleOpenLeaderboard = () => {
    setGameState('leaderboard');
  };

  const handleOpenChallenge = () => {
    setGameState('challenge');
  };

  const handleScopeSelect = (scope) => {
    setSelectedScope(scope);
    setGameState('playing');
    setLevel(1);
  };

  const handleGameOver = (score, stats) => {
    setFinalScore(score);
    setGameStats(stats);
    setGameState('gameover');
    
    // 保存游戏记录到排行榜
    saveGameRecord(score, stats);
  };

  // 保存游戏记录
  const saveGameRecord = (score, stats) => {
    const record = {
      id: Date.now(),
      score: score,
      scope: selectedScope,
      duration: stats?.duration || 60,
      maxCombo: stats?.maxCombo || 0,
      timestamp: Date.now()
    };

    // 获取现有记录
    const savedRecords = localStorage.getItem('gameRecords');
    let records = [];
    
    if (savedRecords) {
      try {
        records = JSON.parse(savedRecords);
      } catch (e) {
        console.error('Failed to parse records:', e);
        records = [];
      }
    }

    // 添加新记录
    records.push(record);

    // 按分数降序排序
    records.sort((a, b) => b.score - a.score);

    // 只保留前20条记录
    records = records.slice(0, 20);

    // 保存到localStorage
    localStorage.setItem('gameRecords', JSON.stringify(records));
  };

  const handleBackToHome = () => {
    setGameState('home');
    setFinalScore(0);
    setLevel(1);
  };

  const handlePlayAgain = () => {
    setGameState('playing');
    setLevel(1);
  };

  return (
    <div className="App">
      {gameState === 'home' && (
        <HomePage 
          onStartGame={handleStartGame}
          onOpenSettings={handleOpenSettings}
          onOpenLeaderboard={handleOpenLeaderboard}
          onOpenChallenge={handleOpenChallenge}
        />
      )}
      {gameState === 'scope' && (
        <ScopeSelector 
          onSelectScope={handleScopeSelect}
          onBack={handleBackToHome}
        />
      )}
      {gameState === 'playing' && (
        <GamePlay 
          scope={selectedScope}
          level={level}
          onGameOver={handleGameOver}
        />
      )}
      {gameState === 'leaderboard' && (
        <Leaderboard 
          onBack={handleBackToHome}
        />
      )}
      {gameState === 'challenge' && (
        <ExtremeChallenge 
          onBack={handleBackToHome}
        />
      )}
      {gameState === 'settings' && (
        <Settings 
          onBack={handleBackToHome}
        />
      )}
      {gameState === 'gameover' && (
        <GameOver 
          score={finalScore}
          onPlayAgain={handlePlayAgain}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;
