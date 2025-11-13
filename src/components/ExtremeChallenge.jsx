import React, { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';
import wrongWordsManager from '../utils/wrongWordsManager';
import Mole from './Mole';
import ResultCard from './ResultCard';
import './ExtremeChallenge.css';

function ExtremeChallenge({ onBack }) {
  const [wrongWords, setWrongWords] = useState([]);
  const [currentMoles, setCurrentMoles] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionType, setQuestionType] = useState('chinese'); // chinese 或 english
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [moleStyle, setMoleStyle] = useState('default');
  const [isGameOver, setIsGameOver] = useState(false);
  const [masteredWords, setMasteredWords] = useState([]); // 已掌握的单词
  const [showResultCard, setShowResultCard] = useState(false);
  const [resultMole, setResultMole] = useState(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // 初始化游戏
  useEffect(() => {
    // 加载错题
    const words = wrongWordsManager.getAllWrongWords();
    if (words.length === 0) {
      // 没有错题，直接返回
      return;
    }
    setWrongWords(words);

    // 加载设置
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setTimeLeft(settings.gameDuration || 60);
        setMoleStyle(settings.moleStyle || 'default');
        soundManager.setVolume(
          (settings.bgmVolume || 30) / 100,
          (settings.sfxVolume || 50) / 100
        );
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }

    // 开始播放背景音乐
    soundManager.playBackgroundMusic();
    startNewRound(words);

    return () => {
      soundManager.stopBackgroundMusic();
    };
  }, []);

  // 倒计时
  useEffect(() => {
    if (wrongWords.length === 0) return;

    if (timeLeft <= 0 || isGameOver) {
      handleGameOver();
      return;
    }

    // 如果在显示结果卡片，倒计时暂停
    if (isTimerPaused) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, wrongWords, isGameOver, isTimerPaused]);

  // 开始新一轮
  const startNewRound = (words = wrongWords) => {
    if (words.length === 0) {
      handleGameOver();
      return;
    }

    // 随机选择题目类型
    const type = Math.random() > 0.5 ? 'chinese' : 'english';
    setQuestionType(type);

    // 随机选择一个正确答案
    const correctWord = words[Math.floor(Math.random() * words.length)];

    // 根据题目类型选择干扰项
    let distractors;
    if (type === 'chinese') {
      // 题目是中文，选项是英文
      distractors = correctWord.englishDistractors || [];
      // 如果干扰项不足，从其他错题中随机选择
      if (distractors.length < 3) {
        const otherWords = words
          .filter(w => w.english !== correctWord.english)
          .map(w => w.english);
        while (distractors.length < 3 && otherWords.length > 0) {
          const randomIndex = Math.floor(Math.random() * otherWords.length);
          const word = otherWords.splice(randomIndex, 1)[0];
          if (!distractors.includes(word)) {
            distractors.push(word);
          }
        }
      }
    } else {
      // 题目是英文，选项是中文
      distractors = correctWord.chineseDistractors || [];
      if (distractors.length < 3) {
        const otherWords = words
          .filter(w => w.chinese !== correctWord.chinese)
          .map(w => w.chinese);
        while (distractors.length < 3 && otherWords.length > 0) {
          const randomIndex = Math.floor(Math.random() * otherWords.length);
          const word = otherWords.splice(randomIndex, 1)[0];
          if (!distractors.includes(word)) {
            distractors.push(word);
          }
        }
      }
    }

    // 创建地鼠选项
    const moles = [];
    const correctAnswer = type === 'chinese' ? correctWord.english : correctWord.chinese;
    const question = type === 'chinese' ? correctWord.chinese : correctWord.english;

    // 添加正确答案
    moles.push({
      id: Math.random(),
      word: correctAnswer,
      isCorrect: true,
      wordData: correctWord
    });

    // 添加干扰项
    distractors.slice(0, 3).forEach(distractor => {
      moles.push({
        id: Math.random(),
        word: distractor,
        isCorrect: false,
        wordData: correctWord
      });
    });

    // 打乱顺序
    const shuffledMoles = moles.sort(() => Math.random() - 0.5);

    setCurrentQuestion(question);
    setCurrentMoles(shuffledMoles);
    
    // 自动播放题目单词的语音
    const wordToSpeak = question;
    const isEnglish = type === 'english'; // 题目是英文时，播放英文
    
    // 延迟一小段时间再播放，让地鼠卡片先显示出来
    setTimeout(() => {
      soundManager.speakWord(wordToSpeak, isEnglish);
    }, 200);
  };

  // 处理点击地鼠
  const handleMoleClick = async (mole) => {
    // 先发音
    await soundManager.speakWord(mole.word, questionType === 'chinese');

    let points = 0;
    let isCorrect = mole.isCorrect;
    
    if (isCorrect) {
      // 答对了
      const comboBonus = Math.floor(combo / 3) * 5;
      points = 10 + comboBonus;
      setScore(prev => prev + points);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) {
        setMaxCombo(newCombo);
      }
      setCorrectCount(prev => prev + 1);
      soundManager.playCorrectSound();

      // 标记为正确，检查是否连续答对3次
      const correctStreak = wrongWordsManager.markCorrect(mole.wordData.english);
      
      if (correctStreak >= 3) {
        // 已掌握，从错题本移除
        setMasteredWords(prev => [...prev, mole.wordData.english]);
      }

      // 更新错题列表
      const updatedWords = wrongWordsManager.getAllWrongWords();
      setWrongWords(updatedWords);

      // 检查是否所有错题都已掌握
      if (updatedWords.length === 0) {
        setShowResultCard(false);
        setIsTimerPaused(false);
        setTimeout(() => {
          setIsGameOver(true);
        }, 1000);
        setResultMole({
          isCorrect,
          points,
          wordData: mole.wordData
        });
        setShowResultCard(true);
        setIsTimerPaused(true);
        return;
      }
    } else {
      // 答错了
      setScore(prev => Math.max(0, prev - 5));
      setCombo(0);
      soundManager.playWrongSound();

      // 标记为错误
      wrongWordsManager.markWrong(mole.wordData.english);
    }

    setTotalAnswered(prev => prev + 1);

    // 显示结果卡片并暂停倒计时
    setResultMole({
      isCorrect,
      points,
      wordData: mole.wordData
    });
    setShowResultCard(true);
    setIsTimerPaused(true);

    // 3秒后关闭卡片并继续游戏
    setTimeout(() => {
      setShowResultCard(false);
      setIsTimerPaused(false);
      const updatedWords = wrongWordsManager.getAllWrongWords();
      if (updatedWords.length > 0) {
        startNewRound(updatedWords);
      } else {
        setIsGameOver(true);
      }
    }, 3000);
  };

  // 游戏结束
  const handleGameOver = () => {
    setIsGameOver(true);
  };

  // 返回首页
  const handleBackClick = () => {
    soundManager.playClickSound();
    onBack();
  };
  
  // 点击小喇叭按钮，重复播放题目单词语音
  const handleSpeakWord = () => {
    if (!currentQuestion) return;
    
    // 确定要播放的单词和语言
    const wordToSpeak = currentQuestion;
    const isEnglish = questionType === 'english';
    
    // 播放语音，speakWord内部会自动取消之前的播放
    soundManager.speakWord(wordToSpeak, isEnglish);
  };

  // 重新开始
  const handleRestart = () => {
    soundManager.playClickSound();
    const words = wrongWordsManager.getAllWrongWords();
    if (words.length === 0) {
      onBack(); // 没有错题了，返回首页
      return;
    }
    
    setWrongWords(words);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTotalAnswered(0);
    setCorrectCount(0);
    setMasteredWords([]);
    setIsGameOver(false);
    
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setTimeLeft(settings.gameDuration || 60);
    } else {
      setTimeLeft(60);
    }
    
    startNewRound(words);
  };

  if (wrongWords.length === 0 && !isGameOver) {
    return (
      <div className="extreme-challenge-page">
        <div className="no-wrong-words">
          <div className="no-wrong-icon">🎉</div>
          <h2>没有逃脱的地鼠！</h2>
          <p>你还没有放过的地鼠</p>
          <p>快去游戏中猎鼠吧！</p>
          <button className="back-home-button" onClick={handleBackClick}>
            ← 返回首页
          </button>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    const accuracy = totalAnswered > 0 ? ((correctCount / totalAnswered) * 100).toFixed(1) : 0;
    const remainingWords = wrongWordsManager.getWrongWordsCount();

    return (
      <div className="extreme-challenge-page">
        <div className="game-over-panel">
          <h1 className="game-over-title">🏆 猎鼠结束 🏆</h1>
          
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">最终得分</div>
              <div className="stat-value score">{score}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">正确率</div>
              <div className="stat-value accuracy">{accuracy}%</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">最高连击</div>
              <div className="stat-value combo">{maxCombo}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">已消灭</div>
              <div className="stat-value mastered">{masteredWords.length}</div>
            </div>
          </div>

          {masteredWords.length > 0 && (
            <div className="mastered-words">
              <h3>🎊 恭喜消灭以下地鼠：</h3>
              <div className="mastered-list">
                {masteredWords.map((word, index) => (
                  <span key={index} className="mastered-word">{word}</span>
                ))}
              </div>
            </div>
          )}

          <div className="remaining-info">
            <p>逃脱的地鼠：<strong>{remainingWords}</strong> 只</p>
            {remainingWords > 0 && <p>继续加油，消灭所有地鼠！💪</p>}
            {remainingWords === 0 && <p>太棒了！所有地鼠都被消灭了！🎉</p>}
          </div>

          <div className="action-buttons">
            {remainingWords > 0 && (
              <button className="restart-button" onClick={handleRestart}>
                🔄 再次猎鼠
              </button>
            )}
            <button className="back-home-button" onClick={handleBackClick}>
              ← 返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="extreme-challenge-page">
      <div className="game-header">
        <div className="header-info">
          <div className="info-item">
            <span className="info-label">⏱️</span>
            <span className="info-value time">{timeLeft}s</span>
          </div>
          <div className="info-item">
            <span className="info-label">💯</span>
            <span className="info-value score">{score}</span>
          </div>
          <div className="info-item">
            <span className="info-label">🔥</span>
            <span className="info-value combo">{combo}</span>
          </div>
          <div className="info-item">
            <span className="info-label">🐾</span>
            <span className="info-value words">{wrongWords.length}</span>
          </div>
        </div>
      </div>

      <div className="challenge-mode-badge">⚡ 极限猎鼠 ⚡</div>

      <div className="question-panel">
        <div className="question-label">
          {questionType === 'chinese' ? '找出这只地鼠的英文名字' : '找出这只地鼠的中文名字'}
        </div>
        <div className="question-text-wrapper">
          <div className="question-text">{currentQuestion}</div>
          <button 
            className="speak-button" 
            onClick={handleSpeakWord}
            title="点击听发音"
          >
            🔊
          </button>
        </div>
      </div>

      <div className="moles-container">
        {currentMoles.map((mole, index) => (
          <div key={mole.id} className="mole-hole">
            <Mole
              word={mole.word}
              isVisible={true}
              onClick={() => handleMoleClick(mole)}
              style={moleStyle}
            />
          </div>
        ))}
      </div>

      {/* 结果卡片 */}
      <ResultCard 
        mole={resultMole}
        isVisible={showResultCard}
        onClose={() => {
          setShowResultCard(false);
          setIsTimerPaused(false);
        }}
      />

      {showFeedback && (
        <div className={`feedback ${showFeedback.type}`}>
          {showFeedback.type === 'correct' && `✔ 消灭成功! +${showFeedback.points}`}
          {showFeedback.type === 'wrong' && '✘ 打偏了! -5'}
          {showFeedback.type === 'mastered' && `🎉 完全消灭 "${showFeedback.word}"！`}
        </div>
      )}
    </div>
  );
}

export default ExtremeChallenge;