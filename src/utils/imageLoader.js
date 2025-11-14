// 图片资源加载器
import moleBrown from '../res/mole_brown.png';
import molePink from '../res/mole_pink.png';
import moleBlue from '../res/mole_blue.png';

// 地鼠样式映射
export const moleStyleMap = {
  default: moleBrown,
  cute: molePink,
  cool: moleBlue
};

// 根据样式获取地鼠图片
export const getMoleImage = (style) => {
  return moleStyleMap[style] || moleBrown;
};

export default {
  moleStyleMap,
  getMoleImage
};