(function SetCloseTabButtonQC(){
    "use strict";

    var lang;
    const l10n = {
        en_US: {
            tab: 'Tabs'
        },
        en_UK: {
            tab: 'Tabs'
        },
        ja: {
            tab: 'タブ'
        },
        ja_KS: {
            tab: 'タブ'
        },
    };
    vivaldi.utilities.getLanguage().then(l => {
        lang = l10n[l];
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
            console.log(`${child.textContent}`)
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

    // Observe source
    function startObservingModalBg() {
        var targetNode = document.documentElement;
        var observer = new MutationObserver(handleModalBgMutation);
        observer.observe(targetNode, {childList: true, subtree: true});
    }

    // observe qc-modal
    function handleModalBgMutation(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type !== 'childList') continue;
            var addedNodes = mutation.addedNodes;
            for (var i = 0; i < addedNodes.length; i++) {
                if (addedNodes[i].id !== 'modal-bg') continue;
                addCloseButtonsToQuickCommands();

                const observer = new MutationObserver(() => addCloseButtonsToQuickCommands());
                const gridListElement = document.querySelector('.ReactVirtualized__Grid.ReactVirtualized__List');
                observer.observe(gridListElement, {childList: true, subtree: true});
            }
        }
    }

    startObservingModalBg();
})();