// 错题本管理器
class WrongWordsManager {
  constructor() {
    this.storageKey = 'wrongWords';
    this.loadWrongWords();
  }

  // 加载错题本
  loadWrongWords() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      this.wrongWords = saved ? JSON.parse(saved) : {};
      // 数据结构: { "word_english": { chinese, english, scope, wrongCount, correctStreak } }
    } catch (e) {
      console.error('Failed to load wrong words:', e);
      this.wrongWords = {};
    }
  }

  // 保存错题本
  saveWrongWords() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.wrongWords));
    } catch (e) {
      console.error('Failed to save wrong words:', e);
    }
  }

  // 添加错题
  addWrongWord(wordData, scope) {
    const key = wordData.english;
    
    if (this.wrongWords[key]) {
      // 已存在，增加错误次数，重置连续正确次数
      this.wrongWords[key].wrongCount += 1;
      this.wrongWords[key].correctStreak = 0;
      this.wrongWords[key].lastWrongTime = Date.now();
    } else {
      // 新错题
      this.wrongWords[key] = {
        chinese: wordData.chinese,
        english: wordData.english,
        englishDistractors: wordData.englishDistractors || [],
        chineseDistractors: wordData.chineseDistractors || [],
        scope: scope,
        wrongCount: 1,
        correctStreak: 0,
        addedTime: Date.now(),
        lastWrongTime: Date.now()
      };
    }
    
    this.saveWrongWords();
  }

  // 记录答对
  markCorrect(wordEnglish) {
    const key = wordEnglish;
    
    if (this.wrongWords[key]) {
      this.wrongWords[key].correctStreak += 1;
      
      // 连续答对3次，从错题本移除
      if (this.wrongWords[key].correctStreak >= 3) {
        delete this.wrongWords[key];
      }
      
      this.saveWrongWords();
      return this.wrongWords[key]?.correctStreak || 3; // 返回连续正确次数
    }
    
    return 0;
  }

  // 记录答错（在极限挑战中）
  markWrong(wordEnglish) {
    const key = wordEnglish;
    
    if (this.wrongWords[key]) {
      this.wrongWords[key].wrongCount += 1;
      this.wrongWords[key].correctStreak = 0; // 重置连续正确次数
      this.wrongWords[key].lastWrongTime = Date.now();
      this.saveWrongWords();
    }
  }

  // 获取所有错题
  getAllWrongWords() {
    return Object.values(this.wrongWords);
  }

  // 获取错题数量
  getWrongWordsCount() {
    return Object.keys(this.wrongWords).length;
  }

  // 清空错题本
  clearWrongWords() {
    this.wrongWords = {};
    this.saveWrongWords();
  }

  // 检查是否有错题
  hasWrongWords() {
    return this.getWrongWordsCount() > 0;
  }

  // 获取随机错题（用于极限挑战）
  getRandomWrongWords(count = 4) {
    const allWords = this.getAllWrongWords();
    if (allWords.length === 0) return [];
    
    // 打乱顺序
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  // 获取错题统计
  getStatistics() {
    const words = this.getAllWrongWords();
    
    return {
      total: words.length,
      byScope: words.reduce((acc, word) => {
        acc[word.scope] = (acc[word.scope] || 0) + 1;
        return acc;
      }, {}),
      totalWrongCount: words.reduce((sum, word) => sum + word.wrongCount, 0),
      averageWrongCount: words.length > 0 
        ? (words.reduce((sum, word) => sum + word.wrongCount, 0) / words.length).toFixed(1)
        : 0
    };
  }
}

// 创建单例
const wrongWordsManager = new WrongWordsManager();

export default wrongWordsManager;
