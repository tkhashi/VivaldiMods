(function tileStyleButton() {
  // Config ------------
  const COMMAND_CHAIN_BUTTON_NAME = "V_TILE_STYLE";
  // -------------------

  async function tileStyling(event) {
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

    // 3. 比率を挿入
    // 左側のタブの比率(2:8であれば'2')
    const ratio = 2;
    const leftTileStyle = `0% ${ratio * 10}% 0% 0%`
    const rightTileStyle = `0% 0% 0% ${(10 - ratio) * 10}%`

    mosaicTileAndSplitElements[0].style.setProperty('inset', leftTileStyle);
    mosaicTileAndSplitElements[1].style.setProperty('inset', rightTileStyle);
    mosaicTileAndSplitElements[2].style.setProperty('inset', rightTileStyle);
  }

  // Adapted from @luetage's mod: https://forum.vivaldi.net/topic/83388/update-feeds
  // Bind function to command chain button
  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (this.tagName === "BUTTON") {
      setTimeout(
        function () {
          if (this.classList.contains("ToolbarButton-Button")) {
            if (this.title === COMMAND_CHAIN_BUTTON_NAME) {
              this.addEventListener("click", e => tileStyling(e));
            }
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
