// 整合所有年级的词汇数据
import grade1Vocabulary from './grade1.json';
import grade2Vocabulary from './grade2.json';
import grade3Vocabulary from './grade3.json';
import grade4Vocabulary from './grade4.json';
import grade5Vocabulary from './grade5.json';
import grade6Vocabulary from './grade6.json';
import grade7Vocabulary from './grade7.json';
import grade8Vocabulary from './grade8.json';
import grade9Vocabulary from './grade9.json';

// 展平词汇数据结构，保持与原来一致的接口
const flattenVocabulary = (gradeData) => {
  // 如果是数组格式（旧格式），直接返回
  if (Array.isArray(gradeData) && gradeData.length > 0 && !gradeData[0].category) {
    return gradeData;
  }
  
  // 如果是新的分类格式（JSON），展平为数组
  if (Array.isArray(gradeData) && gradeData.length > 0 && gradeData[0].category) {
    return gradeData.flatMap(category => category.words);
  }
  
  // 默认情况，直接返回
  return gradeData;
};

export const vocabularyData = {
  "1年级": flattenVocabulary(grade1Vocabulary),
  "2年级": flattenVocabulary(grade2Vocabulary),
  "3年级": flattenVocabulary(grade3Vocabulary),
  "4年级": flattenVocabulary(grade4Vocabulary),
  "5年级": flattenVocabulary(grade5Vocabulary),
  "6年级": flattenVocabulary(grade6Vocabulary),
  "7年级": flattenVocabulary(grade7Vocabulary),
  "8年级": flattenVocabulary(grade8Vocabulary),
  "9年级": flattenVocabulary(grade9Vocabulary),
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