/* eslint-disable */
const legendColor = {
  series: [
    '#1CA1FF',
    '#FB9500',
    '#A7DE02',
    '#36D5A8',
    '#FF5F5F',
    '#E501FF',
    '#6C01FF',
    '#DC0C00',
    '#3CD82C',
    '#F90D6C',
    '#31D2FF',
    '#005FD5',
    '#FA5529',
    '#B7C0FF',
    '#FFF000',
    '#FFD5AE',
    '#FACC15',
    '#FF8bb4',
    '#90bfff',
    '#9bffdd',
    '#42325a',
    '#53afd7'
  ],
  newEnergy: [
    '#1CA1FF',
    '#FB9500',
    '#A7DE02',
    '#36D5A8',
    '#FF5F5F',
    '#E501FF',
    '#6C01FF',
    '#3436C7',
    '#B7C0FF',
    '#F90D6C',
  ],
  country: [
    '#1CA1FF',
    '#FB9500',
    '#A7DE02',
    '#36D5A8',
    '#FF5F5F',
    '#E501FF',
    '#6C01FF',
    '#3436C7',
    '#B7C0FF',
    '#F90D6C',
  ],
  group: [
    '#1CA1FF',
    '#FB9500',
    '#A7DE02',
    '#36D5A8',
    '#FF5F5F',
    '#E501FF',
    '#6C01FF',
    '#DC0C00',
    '#3CD82C',
    '#F90D6C',
    '#31D2FF',
    '#005FD5',
    '#FA5529',
    '#B7C0FF',
    '#FFF000',
    '#FFD5AE',
    '#FACC15',
    '#FF8bb4',
    '#90bfff',
    '#9bffdd',
    '#42325a',
    '#53afd7'
  ],
  seriesBrand: [
    '#1CA1FF',
    '#FB9500',
    '#A7DE02',
    '#36D5A8',
    '#FF5F5F',
  ]
}

const start_colors = [
  '#00A9FF',
  '#FF7437',
  '#6DDA81',
  '#5D75FF',
  '#F95E70',
  "#4CD1EF",
  "#FFC641",
  "#5D75FF",
  "#8AE036",
  "#C474F5",
  "#D3D55C",
  "#DE3E85",
  "#9AADFF",
  "#FFA03D",
];

//基础配置信息
const Base_Info = {
  fontSize: 12,
  energyList: [
    { energyId: 4, energyName: "纯电动" },
    { energyId: 5, energyName: "插电式混动" },
    { energyId: 6, energyName: "增程式" },
    { energyId: 7, energyName: "氢燃料电池" },
    { energyId: -1, energyName: "多能源类型" },
  ],
  seriesList: [
    "微型车",
    "小型车",
    "紧凑型车",
    "中型车",
    "中大型车",
    "大型车",
    "小型SUV",
    "紧凑型SUV",
    "中型SUV",
    "中大型SUV",
    "大型SUV",
    "MPV",
    "跑车",
    "皮卡",
    "微面",
    "轻客"
  ]
}

const getNodeColor = (d, type) => {
  const fillColor = legendColor[type];
  let index = 0;
  switch (type) {
    case 'country':
      index = Base_Info.countryList.findIndex((item) => item == d.lname);
      break;
    case 'series':
      index = Base_Info.seriesList.findIndex((item) => item == d.lname);
      break;
    case 'newEnergy':
      index = d.energyId.length > 1 ? 4 : Base_Info.energyList.findIndex((item) => item.energyId == d.energyId[0]);
      break;
    default:
      break;
  }
  return fillColor[index];
}


export {
  getNodeColor,
  Base_Info
}