// 定义一些html中本来就有元素
const freshBtn = document.getElementById("fresh");
const divList = document.getElementById("list");
const mergeBtn = document.getElementById("merge");

/**
 * 拖拽时触发的动画效果
 * @param prevRect
 * @param target
 */
function animate(prevRect, target) {
    let ms = 300
    if (ms) {
        const currentRect = target.getBoundingClientRect()
        if (prevRect.nodeType === 1) {
            prevRect = prevRect.getBoundingClientRect()
        }
        target.style['transition'] = "none"
        target.style['transform'] = `translate3d(${prevRect.left - currentRect.left}px, ${prevRect.top - currentRect.top}px, 0)`
        target.offsetWidth;
        target.style['transition'] = `all ${ms}ms`
        target.style['transform'] = `translate3d(0, 0, 0)`;
        clearTimeout(target.animated)
        target.animated = setTimeout(() => {
            target.removeAttribute('style')
            target.animated = false
        }, ms);
    }
}

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

// 监听合并按钮点击事件，执行合并文件功能
mergeBtn.addEventListener("click", async () => {
    let filePathList = []
    const fileList = divList.getElementsByClassName("list-cell");
    // await window.electronAPI.merge(fileList);
    for (let i = 0; i < fileList.length; i++) {
        const fileName = fileList[i].getElementsByTagName("p")[0];
        filePathList.push(fileName.innerText)
    }
    await window.electronAPI.merge(filePathList);
});

let draging = null;
divList.addEventListener("dragstart", (event) => {
    const targeElement = event.target.id;
    console.log(targeElement);
    event.dataTransfer.setData("html", event.target.innerHTML);
    draging = event.target;

});

// 监听divList上的【拖动到】事件
// :bug: 目前这个移动会溢出divlist，需要判断一下targetID的内容，不能是非空即可
divList.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const targetID = event.target.id; // 目前停留在的目标元素ID
    const dragingID = draging.id;
    const targetClass = event.target.className;
    console.log(`dragingID: ${dragingID}`);
    console.log(event.target.className);
    if ((targetClass === "list-text" || targetClass === "list-cell" || targetClass === "list-cell-warnning") && dragingID !== null) {
        console.log("处于可放置位置")
        if (targetClass === "list-text") {
            let targetRect = event.target.parentNode.getBoundingClientRect();
            let dragingRect = draging.getBoundingClientRect();
            if (event.target.parentNode.animated) {
                console.log("在同一个位置")
            } else {
                console.log("移动啦")
                if (dragingID < targetID) {
                    event.target.parentNode.parentNode.insertBefore(draging, event.target.parentNode.nextSibling);
                } else {
                    event.target.parentNode.parentNode.insertBefore(draging, event.target.parentNode);
                }
                animate(dragingRect, draging)
                animate(targetRect, event.target.parentNode)
            }
        } else {
            let targetRect = event.target.getBoundingClientRect();
            let dragingRect = draging.getBoundingClientRect();
            if (event.target.animated) {
                console.log("在同一个位置")
            } else {
                console.log("移动啦")
                if (dragingID < targetID) {
                    event.target.parentNode.insertBefore(draging, event.target.nextSibling);
                } else {
                    event.target.parentNode.insertBefore(draging, event.target);
                }
                animate(dragingRect, draging)
                animate(targetRect, event.target)
            }
        }
    }
});

//监听divList上的放下事件
divList.addEventListener("drop", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const dropStartID = event.dataTransfer.getData("startID");
    const file = event.dataTransfer.files[0];
    console.log(`file: ${file}`);
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
        draging = null;
    } else {
        const dataList = divList.getElementsByClassName("list-cell");
        console.log(dataList)
        for (let i = 0; i < dataList.length; i++) {
            const fileName = dataList[i].getElementsByTagName("p")[0];
            console.log(`fileName: ${fileName.innerText}`);
        }
        draging = null;
    }
});
