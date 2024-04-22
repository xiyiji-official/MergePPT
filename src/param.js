const { app } = require("electron");
const path = require("node:path");
const fs = require("fs/promises");

const deskPath = app.getPath("desktop");
const correctList = {
  中后台: [
    "企业文化",
    "总裁办",
    "财务中心",
    "恒学堂",
    "人力行政中心",
    "行政部",
    "采购部",
    "市场品牌",
    "法律合规中心",
    "技术中心",
    "信息安全",
    "政企事务部",
    "内控审计部",
    "金融牌照部",
    "主体管理部",
  ],
  业务线: ["企业文化", "产品投资中心", "汇彬", "小恒数科&恒生活"],
};
/**
 * 
 * @param {*} event 
 * @param {*} files 
 * @param {*} value 
 * @returns 
 */
async function addFile(event, files, value) {
  console.log(files);
  const NewFilePath = path.join(deskPath, `${value}/${files[0]}`);
  await fs.cp(files[1], NewFilePath);
  return getList("", value);
}

/**
 * 找到ListB里与StrA文字相似度最高的一个元素
 * @param {string} StrA 用于比较的文字
 * @param {Array} ListB 用于寻找相似文字的列表
 * @returns {string} 返回编写好的divList HTML内容
 */
function reJudge(StrA, ListB) {
  var strorder = [];
  const strA = Array.from(StrA);
  ListB.forEach((StrB) => {
    const result =
      strA.filter((item) => new Set(Array.from(StrB)).has(item)).length /
      strA.length;
    strorder.push([StrB, result]);
  });
  strorder.sort(function (first, second) {
    return second[1] - first[1];
  });
  return strorder[0];
}
/**
 * 遍历桌面文件夹，获取文件列表，并和已确定的列表进行比对
 * @param {*} event 
 * @param {string} value 
 * @returns 
 */
async function getList(event, value) {
  const directoryPath = path.join(deskPath, value);
  try{
  await fs.mkdir(directoryPath)}
  catch(err){
    console.log("已存在")
  }
  var fileList_Html = "";
  const files = await fs.readdir(directoryPath);
  if (files.length === 0) {
    fileList_Html = `<p align="center">文件夹为空</p>`;
    return fileList_Html;
  }
  correctList[value].forEach((i, index) => {
    var result = reJudge(i, files);
    if (result[1] >= 0.8) {
      fileList_Html += `<div draggable="true" class="list-cell" id="${index}">
      <img class="list-icon" src="./img/riFill-file-ppt-2-fill 1@3x.png" alt="ppt">
      <p class="list-text">${result[0]}</p>
    </div>`;
    } else {
      fileList_Html += `<div draggable="true" class="list-cell-warnning" id="${index}">
      <img class="list-icon" src="./img/riFill-file-ppt-2-fill 1@3x.png" alt="ppt">
      <p class="list-text">缺少${i}文件</p>
    </div>`;
    }
  });
  return fileList_Html;
}

module.exports = { path, addFile, getList };
