{
    // バツ印のボタンを設置する関数
    function addCloseButtonsToQuickCommands() {
    var quickCommands = document.getElementsByClassName('quick-command');
    for (var i = 0; i < quickCommands.length; i++) {
        var closeButton = document.createElement('span');
        closeButton.className = 'close-button';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', handleButtonClick);
        quickCommands[i].appendChild(closeButton);
    }
    }

    // クロージャを使用してボタンクリックのハンドラー関数を定義
    function handleButtonClick() {
    var titleElement = this.parentNode.getElementsByClassName('quick-command-title')[0];
    var tabTitle = titleElement.textContent.trim();
    getTabIdFromTabTitle(tabTitle);
    }

    // タブタイトルからタブIDを取得し、タブを削除する関数
    function getTabIdFromTabTitle(tabTitle) {
    chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].title === tabTitle) {
            var tabId = tabs[i].id;
            console.log('タブID:', tabId);
            chrome.tabs.remove(tabId, function() {
            console.log('タブが削除されました');
            });
            return;
        }
        }
        console.log('タブが見つかりませんでした');
    });
    }

    // Mutation Observerを作成して監視を開始する関数
    function startObservingModalBg() {
    var targetNode = document.documentElement; // HTML全体を監視対象にする場合

    var observer = new MutationObserver(handleModalBgMutation);
    var observerOptions = {
        childList: true,
        subtree: true
    };

    observer.observe(targetNode, observerOptions);
    }

    // 監視対象の要素が出現したときに発火する関数
    function handleModalBgMutation(mutationsList, observer) {
    for (var mutation of mutationsList) {
        if (mutation.type === 'childList') {
        var addedNodes = mutation.addedNodes;
        for (var i = 0; i < addedNodes.length; i++) {
            if (addedNodes[i].id === 'modal-bg') {
                addCloseButtonsToQuickCommands();
            }
        }
        }
    }
    }

    // 実行
    startObservingModalBg();
}