import React, { useState, useEffect, useCallback } from 'react';
import { getVocabulary } from '../vocabularyData';
import Mole from './Mole';
import ResultCard from './ResultCard';
import soundManager from '../utils/soundManager';
import wrongWordsManager from '../utils/wrongWordsManager';
import learningProgressManager from '../utils/learningProgressManager';
import './GamePlay.css';

function GamePlay({ scope, level, onGameOver }) {
  const [vocabulary] = useState(getVocabulary(scope));
  const [currentWord, setCurrentWord] = useState(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [moles, setMoles] = useState([]);
  const [questionType, setQuestionType] = useState('chinese'); // chinese or english
  const [showFeedback, setShowFeedback] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [moleStyle, setMoleStyle] = useState('default');
  const [gameDuration, setGameDuration] = useState(60);
  const [maxCombo, setMaxCombo] = useState(0);
  const [showResultCard, setShowResultCard] = useState(false);
  const [resultMole, setResultMole] = useState(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // 初始化游戏
  useEffect(() => {
    // 加载用户设置
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        const duration = settings.gameDuration || 60;
        setTimeLeft(duration);
        setGameDuration(duration);
        setMoleStyle(settings.moleStyle || 'default');
        // 应用音量设置
        soundManager.setVolume(
          (settings.bgmVolume || 30) / 100, 
          (settings.sfxVolume || 50) / 100
        );
        // 应用背景音乐类型
        const bgmType = settings.bgmType || 'happy';
        soundManager.playBackgroundMusic(bgmType);
      } catch (e) {
        console.error('Failed to load settings:', e);
        soundManager.playBackgroundMusic();
      }
    } else {
      // 开始播放背景音乐
      soundManager.playBackgroundMusic();
    }
    
    startNewRound();
    
    return () => {
      // 组件卸载时停止背景音乐
      soundManager.stopBackgroundMusic();
    };
  }, []);

  // 倒计时
  useEffect(() => {
    if (timeLeft <= 0) {
      // 游戏结束，传递统计数据
      onGameOver(score, {
        duration: gameDuration,
        maxCombo: maxCombo
      });
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
  }, [timeLeft, score, maxCombo, gameDuration, onGameOver, isTimerPaused]);

  // 开始新一轮
  const startNewRound = useCallback(() => {
    if (vocabulary.length === 0) return;

    // 随机选择一个单词
    const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    setCurrentWord(randomWord);

    // 随机决定问题类型
    const type = Math.random() > 0.5 ? 'chinese' : 'english';
    setQuestionType(type);

    // 根据题目类型生成地鼠选项
    let correctAnswer, distractorsList;
    
    if (type === 'chinese') {
      // 题目是中文，选项应该是英文
      correctAnswer = randomWord.english;
      distractorsList = randomWord.englishDistractors;
    } else {
      // 题目是英文，选项应该是中文
      correctAnswer = randomWord.chinese;
      distractorsList = randomWord.chineseDistractors;
    }

    // 生成4个选项（1个正确答案 + 3个干扰项）
    const options = [
      correctAnswer,
      ...distractorsList.slice(0, 3)
    ];

    // 打乱顺序
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    // 为4个地鼠洞分配选项（从6个洞中随机选择）
    const holes = [0, 1, 2, 3, 4, 5];
    const selectedHoles = [];
    
    while (selectedHoles.length < 4) {
      const hole = holes[Math.floor(Math.random() * holes.length)];
      if (!selectedHoles.includes(hole)) {
        selectedHoles.push(hole);
      }
    }

    const newMoles = selectedHoles.map((hole, index) => ({
      id: hole,
      word: shuffledOptions[index],
      isCorrect: shuffledOptions[index] === correctAnswer,
      wordData: randomWord  // 保存完整的单词数据
    }));

    setMoles(newMoles);
    
    // 播放题目单词的语音
    // 如果题目是中文，播放中文；如果题目是英文，播放英文
    const wordToSpeak = type === 'chinese' ? randomWord.chinese : randomWord.english;
    const isEnglish = type === 'english'; // 题目是英文时，播放英文
    
    // 延迟一小段时间再播放，让地鼠卡片先显示出来
    setTimeout(() => {
      soundManager.speakWord(wordToSpeak, isEnglish);
    }, 200);
  }, [vocabulary]);

  // 处理点击地鼠
  const handleMoleClick = async (mole) => {
    // 先发音
    await soundManager.speakWord(mole.word, questionType === 'chinese');
    
    // 计算结果
    let points = 0;
    let isCorrect = mole.isCorrect;
    
    if (isCorrect) {
      const comboBonus = Math.floor(combo / 3) * 5;
      points = 10 + comboBonus;
      setScore(prev => prev + points);
      const newCombo = combo + 1;
      setCombo(newCombo);
      // 更新最高连击
      if (newCombo > maxCombo) {
        setMaxCombo(newCombo);
      }
      soundManager.playCorrectSound();
      
      // 答对了，标记为已掌握
      learningProgressManager.markWordMastered(mole.wordData.english, scope);
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setCombo(0);
      soundManager.playWrongSound();
      
      // 答错了，添加到错题本
      wrongWordsManager.addWrongWord(mole.wordData, scope);
      // 取消掌握状态
      learningProgressManager.unmarkWordMastered(mole.wordData.english);
    }

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
      startNewRound();
    }, 3000);
  };

  // 切换静音（只关闭背景音乐）
  const handleToggleMute = () => {
    const muted = soundManager.toggleBgmMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playBackgroundMusic();
    }
  };
  
  // 点击小喇叭按钮，重复播放题目单词语音
  const handleSpeakWord = () => {
    if (!currentWord) return;
    
    // 确定要播放的单词和语言
    const wordToSpeak = questionType === 'chinese' ? currentWord.chinese : currentWord.english;
    const isEnglish = questionType === 'english';
    
    // 播放语音，speakWord内部会自动取消之前的播放
    soundManager.speakWord(wordToSpeak, isEnglish);
  };

  // 获取等级称号
  const getRankTitle = () => {
    if (score < 50) return '新手猎人';
    if (score < 100) return '猎鼠新星';
    if (score < 200) return '猎鼠高手';
    return '猎鼠大师';
  };

  return (
    <div className="game-play">
      {/* 顶部信息栏 */}
      <div className="game-header">
        <div className="info-item">
          <span className="label">🏚️ 鼠窝:</span>
          <span className="value">{scope.replace('年级', '号鼠窝')}</span>
        </div>
        <div className="info-item">
          <span className="label">⏱️ 时间:</span>
          <span className="value time">{timeLeft}s</span>
        </div>
        <div className="info-item">
          <span className="label">⭐ 分数:</span>
          <span className="value score">{score}</span>
        </div>
        <div className="info-item">
          <span className="label">🔥 连击:</span>
          <span className="value combo">{combo}</span>
        </div>
        <div className="info-item">
          <span className="label">🎯 猎人:</span>
          <span className="value rank">{getRankTitle()}</span>
        </div>
        <button className="mute-button" onClick={handleToggleMute} title={isMuted ? "开启背景音乐" : "静音背景音乐"}>
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* 当前题目 */}
      <div className="question-container">
        <div className="question-prompt">找出这只地鼠的{questionType === 'chinese' ? '英文' : '中文'}名字：</div>
        {currentWord && (
          <div className="current-word-wrapper">
            <div className="current-word">
              {questionType === 'chinese' ? currentWord.chinese : currentWord.english}
            </div>
            <button 
              className="speak-button" 
              onClick={handleSpeakWord}
              title="点击听发音"
            >
              🔊
            </button>
          </div>
        )}
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

      {/* 反馈提示 (如果需要保留原有反馈，可选) */}
      {showFeedback && (
        <div className={`feedback ${showFeedback.type}`}>
          {showFeedback.type === 'correct' ? (
            <>✔ 消灭成功！+{showFeedback.points}分</>
          ) : (
            <>✘ 打偏了！-5分</>
          )}
        </div>
      )}

      {/* 游戏区域 - 草地和地鼠洞 */}
      <div className="game-area">
        <div className="grass-field">
          {[0, 1, 2, 3, 4, 5].map(holeId => {
            const mole = moles.find(m => m.id === holeId);
            return (
              <div key={holeId} className="hole-container">
                <div className="hole">
                  {mole && (
                    <Mole 
                      word={mole.word}
                      onClick={() => handleMoleClick(mole)}
                      moleStyle={moleStyle}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="game-footer">
        <p className="hint">💡 提示: 快速消灭正确的地鼠！连续击中可获得额外加分！</p>
      </div>
    </div>
  );
}

export default GamePlay;
