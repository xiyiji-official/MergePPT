const {app, BrowserWindow, ipcMain, screen, Menu} = require("electron");
const path = require("node:path");
const fs = require("fs/promises");
let workType = null;
const deskPath = app.getPath("desktop");
const correctList = {
    '中后台': [
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
        "主体管理部"
    ],
    '业务线': [
        "企业文化",
        "产品投资中心",
        "汇彬",
        "小恒数科&恒生活",
    ],
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
    let strorder = [];
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
    workType = value
    const directoryPath = path.join(deskPath, value);
    try {
        await fs.mkdir(directoryPath)
    } catch (err) {
        console.log("已存在")
    }
    let fileList_Html = "";
    const files = await fs.readdir(directoryPath);
    if (files.length === 0) {
        fileList_Html = `<p>文件夹为空</p>`;
        return fileList_Html;
    }
    correctList[value].forEach((i, index) => {
        let result = reJudge(i, files);
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

async function merge(event, fileList) {
    const workPath = path.join(deskPath, workType);
    fileList.forEach((file) => {
        const filePath = path.join(workPath, file)
        console.log(`filePath: ${filePath}`);
    })
}

const createWindow = () => {
    // 创建浏览器窗口
    const size = screen.getPrimaryDisplay().workAreaSize
    const mainWindow = new BrowserWindow({
        width: parseInt((size.width * 0.34).toString()),
        height: size.height,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });
    // 加载 index.html
    mainWindow.loadFile("index.html").then(() => {
    });
    mainWindow.webContents.openDevTools()
};
// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。

app.whenReady().then(() => {
    Menu.setApplicationMenu(null)
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
}).then(() => {
    ipcMain.handle("init-List", getList);
    ipcMain.handle("add-File", addFile);
    ipcMain.handle("update-List", getList);
    ipcMain.handle("merge", merge);
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。



/////////////////////////////////////////////////////////
// node-pyrunner
/////////////////////////////////////////////////////////

const pyrunner = require('node-pyrunner')

/* init node-pyrunner */
// pyrunner.config['python_home'] = `./python/win32/x64/3.10.10`;
pyrunner.config['module_search_paths'].push('./pyscript');
pyrunner.init();

/* js func for python call */
// create func in global object.
// funcname = function(){} or funcname = () => {}
sayHello = function (num1, num2) {
  let total = num1 + num2;
  console.log('Main SayHello total:' + total);
  return ++total;
}

/* run python script */
pyrunner.runScriptSync("print('main runSync pyscript')");
pyrunner.runScript("print('main run pyscript')");

let appModule = pyrunner.import('app');

// sync call python funtion
let total = appModule.callSync('sum', [1, 2]);
console.log(`sync total:${total}`);

// async call python funtion
appModule.call('sum', [2, 3], (data)=>{
  console.log(`async total:${data}`);
}, (error)=>{
  console.log(error);
});

// python call js function
appModule.call('call_js', [5, 6], (data)=>{
  console.log(`callJS result:${data}`);
}, (error)=>{
  console.log(error);
});