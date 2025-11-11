// 1年级词汇数据
const grade1Vocabulary = [
  // 学习用品
  { chinese: "书", english: "book", englishDistractors: ["pencil", "pen", "ruler"], chineseDistractors: ["铅笔", "笔", "尺子"] },
  { chinese: "铅笔", english: "pencil", englishDistractors: ["book", "pen", "eraser"], chineseDistractors: ["书", "笔", "橡皮"] },
  { chinese: "尺子", english: "ruler", englishDistractors: ["pencil", "book", "pen"], chineseDistractors: ["铅笔", "书", "笔"] },
  { chinese: "橡皮", english: "eraser", englishDistractors: ["pencil", "pen", "ruler"], chineseDistractors: ["铅笔", "笔", "尺子"] },
  { chinese: "蜡笔", english: "crayon", englishDistractors: ["pencil", "pen", "marker"], chineseDistractors: ["铅笔", "笔", "记号笔"] },
  { chinese: "包", english: "bag", englishDistractors: ["box", "book", "desk"], chineseDistractors: ["盒子", "书", "桌子"] },
  { chinese: "钢笔", english: "pen", englishDistractors: ["pencil", "marker", "crayon"], chineseDistractors: ["铅笔", "记号笔", "蜡笔"] },
  
  // 动物
  { chinese: "猫", english: "cat", englishDistractors: ["dog", "tiger", "rabbit"], chineseDistractors: ["狗", "老虎", "兔子"] },
  { chinese: "狗", english: "dog", englishDistractors: ["cat", "pig", "duck"], chineseDistractors: ["猫", "猪", "鸭子"] },
  { chinese: "鸟", english: "bird", englishDistractors: ["duck", "chicken", "fish"], chineseDistractors: ["鸭子", "鸡", "鱼"] },
  { chinese: "老虎", english: "tiger", englishDistractors: ["cat", "lion", "bear"], chineseDistractors: ["猫", "狮子", "熊"] },
  { chinese: "猴子", english: "monkey", englishDistractors: ["bear", "panda", "tiger"], chineseDistractors: ["熊", "熊猫", "老虎"] },
  { chinese: "熊猫", english: "panda", englishDistractors: ["bear", "monkey", "tiger"], chineseDistractors: ["熊", "猴子", "老虎"] },
  { chinese: "兔子", english: "rabbit", englishDistractors: ["cat", "mouse", "dog"], chineseDistractors: ["猫", "老鼠", "狗"] },
  { chinese: "鸭子", english: "duck", englishDistractors: ["bird", "chicken", "goose"], chineseDistractors: ["鸟", "鸡", "鹅"] },
  { chinese: "猪", english: "pig", englishDistractors: ["dog", "cat", "cow"], chineseDistractors: ["狗", "猫", "牛"] },
  
  // 数字
  { chinese: "一", english: "one", englishDistractors: ["two", "ten", "three"], chineseDistractors: ["二", "十", "三"] },
  { chinese: "二", english: "two", englishDistractors: ["one", "three", "twelve"], chineseDistractors: ["一", "三", "十二"] },
  { chinese: "三", english: "three", englishDistractors: ["two", "four", "thirteen"], chineseDistractors: ["二", "四", "十三"] },
  { chinese: "四", english: "four", englishDistractors: ["five", "three", "fourteen"], chineseDistractors: ["五", "三", "十四"] },
  { chinese: "五", english: "five", englishDistractors: ["four", "six", "fifteen"], chineseDistractors: ["四", "六", "十五"] },
  { chinese: "六", english: "six", englishDistractors: ["seven", "five", "sixteen"], chineseDistractors: ["七", "五", "十六"] },
  { chinese: "七", english: "seven", englishDistractors: ["six", "eight", "eleven"], chineseDistractors: ["六", "八", "十一"] },
  { chinese: "八", english: "eight", englishDistractors: ["seven", "nine", "eighteen"], chineseDistractors: ["七", "九", "十八"] },
  { chinese: "九", english: "nine", englishDistractors: ["eight", "ten", "nineteen"], chineseDistractors: ["八", "十", "十九"] },
  { chinese: "十", english: "ten", englishDistractors: ["nine", "one", "eleven"], chineseDistractors: ["九", "一", "十一"] },
  
  // 水果
  { chinese: "苹果", english: "apple", englishDistractors: ["orange", "banana", "pear"], chineseDistractors: ["橙子", "香蕉", "梨"] },
  { chinese: "香蕉", english: "banana", englishDistractors: ["apple", "pear", "orange"], chineseDistractors: ["苹果", "梨", "橙子"] },
  { chinese: "梨", english: "pear", englishDistractors: ["apple", "peach", "orange"], chineseDistractors: ["苹果", "桃子", "橙子"] },
  { chinese: "橙子", english: "orange", englishDistractors: ["apple", "lemon", "banana"], chineseDistractors: ["苹果", "柠檬", "香蕉"] },

  // 地点场所
  { chinese: "教室", english: "classroom", englishDistractors: ["library", "office", "school"], chineseDistractors: ["图书馆", "办公室", "学校"] },
  { chinese: "学校", english: "school", englishDistractors: ["classroom", "home", "library"], chineseDistractors: ["教室", "家", "图书馆"] },
  { chinese: "公园", english: "park", englishDistractors: ["garden", "playground", "zoo"], chineseDistractors: ["花园", "操场", "动物园"] },
  { chinese: "动物园", english: "zoo", englishDistractors: ["park", "farm", "garden"], chineseDistractors: ["公园", "农场", "花园"] },
  { chinese: "医院", english: "hospital", englishDistractors: ["clinic", "hotel", "store"], chineseDistractors: ["诊所", "酒店", "商店"] },
  { chinese: "超市", english: "supermarket", englishDistractors: ["market", "shop", "store"], chineseDistractors: ["市场", "商店", "店铺"] },
  { chinese: "家", english: "home", englishDistractors: ["house", "room", "hotel"], chineseDistractors: ["房子", "房间", "酒店"] },
  
  // 颜色
  { chinese: "红色", english: "red", englishDistractors: ["blue", "pink", "orange"], chineseDistractors: ["蓝色", "粉色", "橙色"] },
  { chinese: "蓝色", english: "blue", englishDistractors: ["red", "green", "purple"], chineseDistractors: ["红色", "绿色", "紫色"] },
  { chinese: "黄色", english: "yellow", englishDistractors: ["orange", "gold", "green"], chineseDistractors: ["橙色", "金色", "绿色"] },
  { chinese: "绿色", english: "green", englishDistractors: ["blue", "yellow", "brown"], chineseDistractors: ["蓝色", "黄色", "棕色"] },
  { chinese: "黑色", english: "black", englishDistractors: ["white", "gray", "brown"], chineseDistractors: ["白色", "灰色", "棕色"] },
  { chinese: "白色", english: "white", englishDistractors: ["black", "gray", "silver"], chineseDistractors: ["黑色", "灰色", "银色"] },
  { chinese: "粉色", english: "pink", englishDistractors: ["red", "purple", "orange"], chineseDistractors: ["红色", "紫色", "橙色"] },
  { chinese: "紫色", english: "purple", englishDistractors: ["pink", "blue", "violet"], chineseDistractors: ["粉色", "蓝色", "紫罗兰"] },
  { chinese: "棕色", english: "brown", englishDistractors: ["black", "gray", "orange"], chineseDistractors: ["黑色", "灰色", "橙色"] },
  
  // 身体部位
  { chinese: "脸", english: "face", englishDistractors: ["head", "nose", "mouth"], chineseDistractors: ["头", "鼻子", "嘴巴"] },
  { chinese: "眼睛", english: "eye", englishDistractors: ["ear", "nose", "mouth"], chineseDistractors: ["耳朵", "鼻子", "嘴巴"] },
  { chinese: "耳朵", english: "ear", englishDistractors: ["eye", "nose", "face"], chineseDistractors: ["眼睛", "鼻子", "脸"] },
  { chinese: "鼻子", english: "nose", englishDistractors: ["eye", "mouth", "ear"], chineseDistractors: ["眼睛", "嘴巴", "耳朵"] },
  { chinese: "嘴巴", english: "mouth", englishDistractors: ["nose", "eye", "face"], chineseDistractors: ["鼻子", "眼睛", "脸"] },
  { chinese: "头", english: "head", englishDistractors: ["face", "hair", "hand"], chineseDistractors: ["脸", "头发", "手"] },
  { chinese: "手", english: "hand", englishDistractors: ["foot", "arm", "finger"], chineseDistractors: ["脚", "胳膊", "手指"] },
  { chinese: "脚", english: "foot", englishDistractors: ["hand", "leg", "toe"], chineseDistractors: ["手", "腿", "脚趾"] },
];

export default grade1Vocabulary;