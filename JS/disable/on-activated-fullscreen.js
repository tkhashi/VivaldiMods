
(function alwaysFullscreen() {
    "use strict";

    vivaldi.windowPrivate.onActivated.addListener(function (windowId, active) {
        vivaldi.windowPrivate.setState(vivaldiWindowId,vivaldi.windowPrivate.WindowState.FULLSCREEN)
    });
})();