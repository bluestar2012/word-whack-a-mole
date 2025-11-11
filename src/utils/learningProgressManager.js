// 学习进度管理器
class LearningProgressManager {
  constructor() {
    this.storageKey = 'learningProgress';
    this.loadProgress();
  }

  // 加载学习进度
  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      this.progress = saved ? JSON.parse(saved) : {};
      // 数据结构: { "word_english": { scope, masteredTime, correctCount } }
    } catch (e) {
      console.error('Failed to load learning progress:', e);
      this.progress = {};
    }
  }

  // 保存学习进度
  saveProgress() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    } catch (e) {
      console.error('Failed to save learning progress:', e);
    }
  }

  // 标记单词为已掌握
  markWordMastered(wordEnglish, scope) {
    const key = wordEnglish;
    
    if (!this.progress[key]) {
      this.progress[key] = {
        scope: scope,
        masteredTime: Date.now(),
        correctCount: 1
      };
    } else {
      this.progress[key].correctCount += 1;
    }
    
    this.saveProgress();
  }

  // 取消掌握（答错时调用）
  unmarkWordMastered(wordEnglish) {
    const key = wordEnglish;
    
    if (this.progress[key]) {
      delete this.progress[key];
      this.saveProgress();
    }
  }

  // 获取某个范围内已掌握的单词数
  getMasteredCountByScope(scope) {
    return Object.values(this.progress).filter(
      item => item.scope === scope
    ).length;
  }

  // 获取所有已掌握的单词
  getAllMasteredWords() {
    return Object.keys(this.progress);
  }

  // 检查单词是否已掌握
  isWordMastered(wordEnglish) {
    return !!this.progress[wordEnglish];
  }

  // 获取总掌握数
  getTotalMasteredCount() {
    return Object.keys(this.progress).length;
  }

  // 清空学习进度
  clearProgress() {
    this.progress = {};
    this.saveProgress();
  }

  // 获取按范围分组的统计
  getStatisticsByScope() {
    const stats = {};
    
    Object.values(this.progress).forEach(item => {
      if (!stats[item.scope]) {
        stats[item.scope] = 0;
      }
      stats[item.scope] += 1;
    });
    
    return stats;
  }

  // 检查鼠窝是否完成（掌握率达到80%即为完成）
  isScopeCompleted(scope, totalWords) {
    const masteredCount = this.getMasteredCountByScope(scope);
    const completionRate = totalWords > 0 ? masteredCount / totalWords : 0;
    return completionRate >= 0.8; // 80%掌握率视为完成
  }

  // 获取已完成的鼠窝数量
  getCompletedScopesCount(vocabularyData) {
    let count = 0;
    Object.keys(vocabularyData).forEach(scope => {
      const totalWords = vocabularyData[scope].length;
      if (this.isScopeCompleted(scope, totalWords)) {
        count++;
      }
    });
    return count;
  }
}

// 创建单例
const learningProgressManager = new LearningProgressManager();

export default learningProgressManager;
