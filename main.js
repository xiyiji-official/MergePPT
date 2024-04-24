const {app, BrowserWindow, ipcMain, screen} = require("electron");
const {path, addFile, getList} = require("./src/param")

const createWindow = () => {
    // 创建浏览器窗口
    const size = screen.getPrimaryDisplay().workAreaSize
    const mainWindow = new BrowserWindow({
        width: parseInt(size.width * 0.3391927083333333),
        height: size.height,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });
    // 加载 index.html
    mainWindow.loadFile("index.html").then(() => {
    });
    // mainWindow.webContents.openDevTools()
};
// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。

app.whenReady().then(() => {
    ipcMain.handle("add-File", addFile);
    ipcMain.handle("init-List", getList);
    ipcMain.handle("update-List", getList);
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。
