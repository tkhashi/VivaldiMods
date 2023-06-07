(function bookmarkButton() {
  // ============================================================================================================
  // Bookmarks button in front of the address field
  // URL:         https://forum.vivaldi.net/post/555475
  // Description: Adds a bookmark button in front of the address field that opens a dropdown menu of all bookamrks
  // Author(s):   @nomadic
  // CopyRight:   No Copyright Reserved
  // ============================================================================================================

  // Config ------------
  const COMMAND_CHAIN_BUTTON_NAME = "Bookmarks";
  // -------------------

  async function handleBookmarkMenuEvents(windowId, event) {
    const bookmarkListFromID = await chrome.bookmarks.get(event.id);
    const bookmark = bookmarkListFromID[0];

    switch (event.command) {
      case "addactivetab":
        const isItemAFolder = bookmark.url === undefined;
        const parentId = isItemAFolder ? bookmark.id : bookmark.parentId;
        const index = isItemAFolder ? null : bookmark.index + 1;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const currentTab = tabs[0];
          chrome.bookmarks.create({ parentId: parentId, index: index, title: currentTab.title, url: currentTab.url });
        });
        break;

      case "addbookmark":
        // TODO: No current solution, can't open bookmark dialog
        break;

      case "addfolder":
        // TODO: No current solution, can't open bookmark dialog
        break;

      case "addseparator":
        chrome.bookmarks.create({ index: bookmark.index + 1, parentId: bookmark.parentId, title: "---", url: "http://bookmark.placeholder.url/", description: "separator" });
        break;

      case "edit":
        // TODO: No current solution, can't open bookmark dialog
        break;

      case "cut":
        // TODO: No current solution, can't make work with built in function in bookmark panel and page
        break;

      case "copy":
        // TODO: No current solution, can't make work with built in function in bookmark panel and page
        break;

      case "paste":
        // TODO: No current solution, can't make work with built in function in bookmark panel and page
        break;

      case "delete":
        // function works without special handling
        break;

      default:
        break;
    }
    removeBookmarkListeners();
  }

  async function handleBoormarkOpenEvents(windowId, event) {
    let isOpenedInBackgroundTab = event.background;
    const bookmarkListFromID = await chrome.bookmarks.get(event.id);
    const bookmarkClicked = bookmarkListFromID[0];

    // determine the bookmarks to open, an individual or a folder of bookmarks
    const bookmarkChildren = await chrome.bookmarks.getChildren(bookmarkClicked.id);
    let bookmarksToOpen;

    if (bookmarkChildren.length === 0) {
      bookmarksToOpen = [bookmarkClicked];
    } else {
      bookmarksToOpen = bookmarkChildren;
    }

    for (bookmark of bookmarksToOpen) {
      switch (event.disposition) {
        // Depends on the setting for whether the bookmark is opened in a new tab or not
        case "setting":
          let shouldOpenInNewTab = await vivaldi.prefs.get("vivaldi.bookmarks.open_in_new_tab");
          const crtlKeyState = event.state.ctrl;
          const middleMouseState = event.state.center;

          // adjust whether opened in the background depending on ctrl key or middle mouse press
          isOpenedInBackgroundTab = isOpenedInBackgroundTab || crtlKeyState || middleMouseState;

          // adjust whether opened in new tab depending on ctrl key or middle mouse press
          shouldOpenInNewTab = shouldOpenInNewTab || crtlKeyState || middleMouseState;

          if (shouldOpenInNewTab) {
            chrome.tabs.create({ active: !isOpenedInBackgroundTab, url: bookmark.url });
          } else {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              const currentTab = tabs[0];
              chrome.tabs.update(currentTab.id, { url: bookmark.url });
            });
          }
          break;

        case "new-tab":
          chrome.tabs.create({ active: !isOpenedInBackgroundTab, url: bookmark.url });
          break;

        case "current":
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            chrome.tabs.update(currentTab.id, { url: bookmark.url });
          });
          break;

        case "new-window":
          chrome.windows.getCurrent((window) => {
            chrome.windows.create({ url: bookmark.url, height: window.height, width: window.width, top: window.top, left: window.left });
          });
          break;

        case "new-private-window":
          chrome.windows.getCurrent((window) => {
            chrome.windows.create({ incognito: true, url: bookmark.url, height: window.height, width: window.width, top: window.top, left: window.left });
          });
          break;

        default:
          break;
      }
    }
    removeBookmarkListeners();
  }

  function removeBookmarkListeners() {
    vivaldi.menubarMenu.onBookmarkAction.removeListener(handleBookmarkMenuEvents);
    vivaldi.menubarMenu.onOpenBookmark.removeListener(handleBoormarkOpenEvents);
  }

  async function openBookmarkDropdown(event) {
    // clear any existing listeners
    removeBookmarkListeners();

    vivaldi.menubarMenu.onBookmarkAction.addListener(handleBookmarkMenuEvents);
    vivaldi.menubarMenu.onOpenBookmark.addListener(handleBoormarkOpenEvents);

    const windowID = await vivaldi.windowPrivate.getCurrentId();
    const rect = event.target.getBoundingClientRect();

    vivaldi.bookmarkContextMenu.show({
      windowId: windowID,
      id: "1",
      siblings: [
        {
          folderGroup: true,
          id: "1",
          offset: 0,
          rect: {
            x: parseInt(rect.left),
            y: parseInt(rect.top),
            width: parseInt(rect.width),
            height: parseInt(rect.height),
          },
        },
      ],
      sortField: undefined,
      sortOrder: undefined,
      edge: "off",
      icons: [
        "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",
      ],
    });
  }

  // Adapted from @luetage's mod: https://forum.vivaldi.net/topic/83388/update-feeds
  // Bind bookmark dropdown to command chain button
  let appendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function () {
    if (this.tagName === "BUTTON") {
      setTimeout(
        function () {
          if (this.classList.contains("ToolbarButton-Button")) {
            if (this.title === COMMAND_CHAIN_BUTTON_NAME) {
              this.addEventListener("click", openBookmarkDropdown);
            }
          }
        }.bind(this, arguments[0])
      );
    }
    return appendChild.apply(this, arguments);
  };
})();
