// ==UserScript==
// @name        Intercept Shortcuts
// @namespace   https://gist.github.com/luetage/b6c6fdee713c0b3569e9daa9ee7b73bb
// @updateURL   https://gist.github.com/luetage/b6c6fdee713c0b3569e9daa9ee7b73bb/raw
// @supportURL  https://forum.vivaldi.net/post/459981
// @description Stops websites from hijacking keyboard shortcuts.
// @version     2022.9.0
// @author      luetage
// @match       *://*/*
// @run-at      document-start
// ==/UserScript==

(function () {
  "use strict";
  const pass = () => {
    si++;
    if (si > 3) {
      document.removeEventListener("keyup", pass);
      si = 0;
    }
  };
  let si = 0;
  // whitelist
  const keycodes = [
    "Escape",
    "Tab",
    "Enter",
    " ",
    "Shift",
    "ArrowLeft",
    "ArrowDown",
    "ArrowUp",
    "ArrowRight",
  ];
  document.addEventListener("keydown", (e) => {
    // console.log(e.key);
    // shortcut for letting the next shortcut pass (alt-n)
    if (e.key === "n" && e.altKey) {
      si = 1;
      document.addEventListener("keyup", pass);
    } else if (si === 0 && keycodes.indexOf(e.key) === -1) {
      e.cancelBubble = true;
      e.stopImmediatePropagation();
    }
    return false;
  });
})();