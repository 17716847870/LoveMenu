// 情侣模式心情文案
export const coupleMoods = [
  "今天也要开心哦",
  "和你在一起真幸福",
  "永远爱你❤️",
  "每一天都是礼物",
  "你是我的全世界",
  "一起走过每一天",
  "有你真好",
  "我们的故事继续",
  "爱你到永远",
  "今天也要相互陪伴",
];

// 单人模式心情文案
export const soloMoods = [
  "今天也要加油",
  "做最好的自己",
  "生活充满惊喜",
  "每一天都闪闪发光",
  "相信美好会发生",
  "享受当下的美好",
  "为梦想而努力",
  "今天也很棒",
  "保持热情和微笑",
  "生活就是冒险",
];

export const getRandomMood = (isCoupleView: boolean): string => {
  const moods = isCoupleView ? coupleMoods : soloMoods;
  return moods[Math.floor(Math.random() * moods.length)];
};
