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


divList.addEventListener("dragstart", (event) => {
  let targeElement = event.target.id;
  console.log(targeElement)
  event.dataTransfer.setData("text", targeElement);
});

// 监听divList上的【拖动到】事件
var mudi1;
divList.addEventListener("dragover", (event) => {
  event.preventDefault();
  event.stopPropagation()
  var mudi2 = event.target.id;
  if (mudi2 === "") {
  } else {
    if (mudi1 === mudi2) {
      // console.log(`依旧留存在同一个div中`);
    } else {
      console.log(mudi1)
      if (mudi1 === undefined) {
        // console.log(`已经离开前一个div，前一个${mudi1},后一个${mudi2}`);
        mudi1 = mudi2;
      } else {
        // console.log("变化")
        document.getElementById(mudi1).removeAttribute('style')
        document.getElementById(mudi2).style['backgroundColor'] = "rgb(122, 255, 99)"
        // console.log(`已经离开前一个div，前一个${mudi1},后一个${mudi2}`);
        mudi1 = mudi2;
      }
    }
  }

});
//监听divList上的放下事件
divList.addEventListener("drop", async (event) => {
  const c = event.dataTransfer.getData("text");
  console.log(c)
  if (c.search("文件") !== -1) {
    event.preventDefault();
    event.stopPropagation();
    const selectType =
      document.getElementById("select").options[
        document.getElementById("select").selectedIndex
      ].value;
    const files = event.dataTransfer.files[0];
    divList.innerHTML = await window.electronAPI.addFile(
      [files.name, files.path],
      selectType
    );
  } else {
    const mudi = event.target.id;
    if (mudi !== "") {
    event.preventDefault();
    event.stopPropagation();
    }
    console.log(`来源地id：${c}`);
    console.log(`目的地id：${mudi}`);
  }
});
