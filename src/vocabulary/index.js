// 整合所有年级的词汇数据
import grade1Vocabulary from './grade1';
import grade2Vocabulary from './grade2';
import grade3Vocabulary from './grade3';
import grade4Vocabulary from './grade4';
import grade5Vocabulary from './grade5';
import grade6Vocabulary from './grade6';

export const vocabularyData = {
  "1年级": grade1Vocabulary,
  "2年级": grade2Vocabulary,
  "3年级": grade3Vocabulary,
  "4年级": grade4Vocabulary,
  "5年级": grade5Vocabulary,
  "6年级": grade6Vocabulary,
};

// 获取指定范围的词汇
export const getVocabulary = (scope) => {
  return vocabularyData[scope] || vocabularyData["1年级"];
};

// 获取所有可用范围
export const getAvailableScopes = () => {
  return Object.keys(vocabularyData);
};

// 获取默认范围（第一个）
export const getDefaultScope = () => {
  const scopes = getAvailableScopes();
  return scopes.length > 0 ? scopes[0] : "1年级";
};