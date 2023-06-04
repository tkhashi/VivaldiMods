(function SetCloseTabButtonQC(){
    "use strict";
    console.log('start func')

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

    // Create close button
    function addCloseButtonsToQuickCommands() {
        // Parent of quick-command-sectionheader and quick-command class
        const gridInnerScrollContainer = document.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
        const childElements = gridInnerScrollContainer.children;

        for (let i = 0; i < childElements.length; i++) {
            const child = childElements[i];

            // Set button when'quick-command-sectionheader' include 'Tab'
            if (child.classList.contains('quick-command-sectionheader')){
                if (child.textContent.includes(lang.tab)) {
                    continue;
                }
                else{
                    // Return when next section-header
                    return;
                }
            }

            // Set close button in quick-commnad class
            if (child.querySelector('.close-button')) continue;
            var closeButton = document.createElement('span');
            closeButton.className = 'close-button';
            closeButton.textContent = '×';
            closeButton.style.padding = '4px 8px';

            // Invert color at mouse hover
            closeButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#000'; 
            this.style.color = '#fff';
            });
            // Revevrt color at mouse leave
            closeButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = ''; 
            this.style.color = ''; 
            });

            closeButton.addEventListener('click', handleButtonClick);
            child.appendChild(closeButton);
        }
    }

    function handleButtonClick() {
        var titleElement = this.parentNode.getElementsByClassName('quick-command-title')[0];
        var tabTitle = titleElement.textContent.trim();
        removeTabFromTabTitle(tabTitle);
    }

    // Remove tab from tab title 
    function removeTabFromTabTitle(tabTitle) {
    chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
                if(tabs[i].title !== tabTitle) continue;
                chrome.tabs.remove(tabs[i].id, function() {
            });
            return;
        }
        console.log('Not found tab');
    });
    }

    // Observe entire html to appeare qc-modal
    const observerOptions = {
        childList: true,
        subtree: true
    };
    function startObservingModalBg() {
        var targetNode = document.documentElement;
        var observer = new MutationObserver(handleModalBgMutation);
        observer.observe(targetNode, observerOptions);
    }

    // observe qc-modal for commands
    function handleModalBgMutation(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type !== 'childList') continue;
            var addedNodes = mutation.addedNodes;
            for (var i = 0; i < addedNodes.length; i++) {
                if (addedNodes[i].id !== 'modal-bg') continue;
                addCloseButtonsToQuickCommands();

                // TODO: Narrow down a specific range. Because it's bug of setting view's column adding close button.(maybe other place too..)
                const observer = new MutationObserver(() => addCloseButtonsToQuickCommands());
                const gridListElement = document.querySelector('.ReactVirtualized__Grid.ReactVirtualized__List');
                observer.observe(gridListElement, observerOptions);
            }
        }
    }

    startObservingModalBg();
})();