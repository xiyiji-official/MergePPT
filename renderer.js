// 定义一些html中本来就有元素
const freshBtn = document.getElementById("fresh");
const divList = document.getElementById("list");

// 立即执行 初始化渲染中间的文件列表
(async function () {
    const selectType =
        document.getElementById("select").options[
            document.getElementById("select").selectedIndex
            ].value;
    divList.innerHTML = await window.electronAPI.initList(selectType);
})();

// 监听刷新按钮点击事件，执行更新文件列表功能
freshBtn.addEventListener("click", async () => {
    const selectType =
        document.getElementById("select").options[
            document.getElementById("select").selectedIndex
            ].value;
    divList.innerHTML = await window.electronAPI.updateList(selectType);
});

let draging = null
divList.addEventListener("dragstart", (event) => {
    const targeElement = event.target.id;
    console.log(targeElement)
    event.dataTransfer.setData("startID", targeElement);
    event.dataTransfer.setData("html", event.target.innerHTML)
    draging = event.target

});

// 监听divList上的【拖动到】事件
// :bug: 目前这个移动会溢出divlist，需要判断一下targetID的内容，不能是非空即可
divList.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.stopPropagation()
    const targetID = event.target.id; // 目前停留在的目标元素ID
    const dragingID = draging.id;
    if (targetID !== "" && targetID !== dragingID) {
        let targetRect = event.target.getBoundingClientRect();
        let dragingRect = draging.getBoundingClientRect();
        if (dragingID <targetID){
            event.target.parentNode.insertBefore(draging, event.target.nextSibling);
        } else {
            event.target.parentNode.insertBefore(draging, event.target);
        }
    }
    /*
        if (targetID === "") {
            console.log(`为空：target ID: ${targetID}`); // 判断一下这个ID是不是存在
        } else {
            console.log(`不为空：target ID: ${targetID}`);
            if (lastTargetID === targetID) {  // 判断一下两个ID是不是一个，也就是拖拽元素是不是还在同一个位置
                console.log(`依旧留存在 ${targetID} 中`);
            } else {
                // 判断一下lastTargetID是不是空，在第一次移动的时候这个值为空
                if (lastTargetID === undefined) {
                    // console.log(`已经离开前一个div，前一个${mudi1},后一个${mudi2}`);
                    lastTargetID = targetID;
                } else {
                    let targetRect = event.target.getBoundingClientRect();
                    let dragingRect = draging.getBoundingClientRect();
                    // console.log("变化")
                    // document.getElementById(lastTargetID).removeAttribute('style')
                    lastTargetID = targetID;
                    // document.getElementById(targetID).style['backgroundColor'] = "rgb(122, 255, 99)"
                    // console.log(`已经离开前一个div，前一个${lastTargetID},目前处在：${targetID}`);
                }
            }
        }*/

});
//监听divList上的放下事件
divList.addEventListener("drop", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const dropStartID = event.dataTransfer.getData("startID");
    const file = event.dataTransfer.files[0];
    if (file !== undefined) {
        console.log(`dropStartID: ${dropStartID}`);
        console.log(`file: ${file}`);
        const selectType =
            document.getElementById("select").options[
                document.getElementById("select").selectedIndex
                ].value;
        console.log(`path:${file.path}`);
        divList.innerHTML = await window.electronAPI.addFile(
            [file.name, file.path],
            selectType
        );
    } else {
        console.log(`来源地id：${dropStartID}`);
        console.log(`从over中获取的目的地：${draging.id}`)
        // document.getElementById(lastTargetID).removeAttribute('style')
    }
});
