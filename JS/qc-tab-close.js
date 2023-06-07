(function SetCloseTabButtonQC() {
    "use strict";
    var lang;
    const l10n = {
        'en-US': {
            tab: 'Tabs'
        },
        'en-UK': {
            tab: 'Tabs'
        },
        'ja': {
            tab: 'タブ'
        },
        'ja-KS': {
            tab: 'タブ'
        },
    };
    vivaldi.utilities.getLanguage().then(l => {
        lang = l10n[`${l}`];
    });

    // Set shortcut close tab
    // it can't register specific key what had default function for some reason( ex) Ctrl|Shift|Alt+Backspace).
    // It can't register Shift+Delete for some reason(Ctrl|Alt+Delete has default function).
    const DELETE_TAB_KEY_COMBO = "Alt+Delete";
    function handleKeyboardShortcut(_, combo) {
        console.log(combo);
        if(DELETE_TAB_KEY_COMBO !== combo) return;

        // Delete tab
        const selected = document.querySelector('.quick-command[data-selected]');
        const selectedTitle = selected.querySelector('.quick-command-title');
        var tabTitle = selectedTitle.textContent.trim();
        const isRemoved = removeTabFromTabTitle(tabTitle);

        // Delete tab in qc
        if(isRemoved) return;
        selected.classList.add('strikethrough-text')
    }

    vivaldi.tabsPrivate.onKeyboardShortcut.addListener(handleKeyboardShortcut);

    // Set close button
    function addCloseButtonsToQuickCommands() {
        // Parent of quick-command-sectionheader and quick-command class
        const qcContainer = document.querySelector('.quick-commands');

        // Extract qc-commands from React auto generate container tag
        const qcCommands = qcContainer.firstChild.firstChild;
        for (const command of qcCommands.childNodes) {
            // Set button when'quick-command-sectionheader' include 'Tab'
            if (command.classList.contains('quick-command-sectionheader')) {
                if (command.textContent.includes(lang.tab)) {
                    continue;
                }
                else {
                    // Return when next section-header
                    return;
                }
            }

            // Set close button in quick-commnad class
            if (command.querySelector('.close-button')) continue;
            var closeButton = document.createElement('span');
            closeButton.className = 'close-button';
            closeButton.textContent = '×';
            closeButton.style.padding = '4px 8px';

            // Invert color at mouse hover
            closeButton.addEventListener('mouseenter', function () {
                this.style.backgroundColor = '#000';
                this.style.color = '#fff';
                this.style.cursor = 'pointer';
            });
            // Revevrt color at mouse leave
            closeButton.addEventListener('mouseleave', function () {
                this.style.backgroundColor = '';
                this.style.color = '';
                this.style.cursor = 'default';
            });

            closeButton.addEventListener('click', handleButtonClick, true);
            command.appendChild(closeButton);
        }
    }

    function handleButtonClick() {
        var titleElement = this.parentNode.getElementsByClassName('quick-command-title')[0];
        var tabTitle = titleElement.textContent.trim();
        removeTabFromTabTitle(tabTitle);
    }

    function removeTabFromTabTitle(tabTitle) {
        chrome.tabs.query({}, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].title !== tabTitle) continue;
                chrome.tabs.remove(tabs[i].id, function () { });
                return true;
            }
            console.log('Not found tab');
            return false;
        });
    }

    // Set QuickCommand CSS for Observable
    function setQcModalCss(){
        const css = `
            * QC Height and Width */
            .qc-modal {top: 20vh !important;}
            .quick-command-container, .quick-command-container .quick-commands > div {width:60vw !important; }
            .quick-command-container .quick-commands > div > div {max-width: 100% !important;}
            .quick-commands {max-height: 100% !important;}
            .quick-commands > div {height: 50vh !important;}

            /* QC Transparency */
            .quick-commands, input.quick-command-search-hint {
                background-color: transparent !important;
            }

            .quick-commands .quick-command[data-selected] {
                background-color: var(--colorHighlightBgAlpha) !important;
            }
            .qc-modal > div {
                color: var(--colorFgIntense) !important;
                background-color: var(--colorBgAlphaHeavy) !important;
                backdrop-filter: blur(5px);
                border: 2px solid var(--colorHighlightBgAlpha);
            }

            .qc-modal ::-webkit-scrollbar-track, .qc-modal ::-webkit-scrollbar-thumb {
                background-color: var(--colorBgAlphaHeavier) !important;
            }

            .qc-modal ::-webkit-scrollbar-button {
                display: none;
            }

            /* Closed tabs */
            .strikethrough-text {
                text-decoration: line-through;
                opacity: 0.3;
            }
        `;

        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // Observe entire html to appeare qc-modal
    function startObservingModalBg() {
        var targetNode = document.documentElement;
        var observer = new MutationObserver(handleModalBgMutation);
        const observerOptions = {
            childList: true,
            subtree: true
        };
        observer.observe(targetNode, observerOptions);
    }

    // observe qc-modal for refleshed commands
    function handleModalBgMutation(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type !== 'childList') continue;
            var addedNodes = mutation.addedNodes;
            for (var i = 0; i < addedNodes.length; i++) {
                if (addedNodes[i].id !== 'modal-bg') continue;
                addCloseButtonsToQuickCommands();
                setQcModalCss();

                const observer = new MutationObserver(() => {
                    setQcModalCss();
                    addCloseButtonsToQuickCommands()
                });
                const gridListElement = document.getElementById('modal-bg');
                const observerOptions = {
                    childList: true,
                    subtree: true
                };
                observer.observe(gridListElement, observerOptions);
            }
        }
    }

    startObservingModalBg();
})();