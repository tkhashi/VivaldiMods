function arrangeTile() {
  // class = visible mosaic > mosaic-root > 
  // 2ページ・左右という前提
  // class = mosaic-tile | mosaic-split | mosaic-tile の順
  // style="inset: {上の余白}% {右の余白}% {下の余白}% {左の余白}%"

  // 1. class = 'visible mosaic'を取得
  const visibleMosaicElements = document.querySelectorAll('.visible.mosaic');

  // 2. 1のElementの子供の子供のmosaic-tileクラスとmosaic-splitクラスを上から順にすべて取得
  const mosaicTileAndSplitElements = [];
  visibleMosaicElements.forEach(element => {
    const tileAndSplitChildren = Array.from(element.querySelectorAll('.mosaic-tile, .mosaic-split'));
    mosaicTileAndSplitElements.push(...tileAndSplitChildren);
  });

  console.log(mosaicTileAndSplitElements);

  // 3. 比率を挿入
  // 左側のタブの比率(2:8であれば'2')
  const ratio = 2;
  const leftTileStyle = `0% ${ratio * 10}% 0% 0%`
  const rightTileStyle = `0% 0% 0% ${(10 - ratio) * 10}%`

  mosaicTileAndSplitElements[0].style.setProperty('inset', leftTileStyle);
  mosaicTileAndSplitElements[1].style.setProperty('inset', rightTileStyle);
  mosaicTileAndSplitElements[2].style.setProperty('inset', rightTileStyle);
}


// ボタンを作成
var button = document.createElement("button");
button.innerHTML = "ボタンテキスト"; // ボタンに表示するテキストを指定
button.onclick = myFunction; // ボタンがクリックされたときに実行する関数を指定

// ボタンのスタイルを設定
button.style.position = "fixed"; // 固定位置で配置
button.style.top = "0"; // 上端に配置
button.style.left = "0"; // 左端に配置

// ボタンをページに追加
document.body.appendChild(button);

// 実行する関数
function myFunction() {
  // ここに実行したい処理を記述
  alert("ボタンがクリックされました！");
}
