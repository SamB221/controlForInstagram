// all the possible stylesheets to be turned on
const settings = ["reels", "explore", "inbox", "notifications", "comments", "grayscale", "inboxOnly"];
const associatedElement = [];
const bannedURLS = [];

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
    var currentUrl = window.location.href;
    // accesses preferences from storage to determine style sheets
    chrome.storage.sync.get(null, function(data) {
        settings.forEach((elementName, index) => {
            if (elementName === "grayscale") {
                if (data[index]) {
                    document.body.style.filter = 'grayscale(100%)';
                } else {
                    document.body.style.filter = 'grayscale(0%)';
                }
            } else if (data[index]) {
                if (elementName === "inboxOnly") {
                    if (!currentUrl.includes("www.instagram.com/direct/") && !currentUrl.includes("www.instagram.com/p/")) {
                        window.location.href = "https://www.instagram.com/direct/";
                    }
                    removeSideBar();
                } else {
                    removeElement(elementName);
                    bannedURLS.push(elementName); 
                }
            }
        });

        // ensures user isn't on certain pages based on preference
        for (let i = 0; i < bannedURLS.length; i++) {
            // clears page if on page that is "banned"
            if (currentUrl.includes("www.instagram.com/"+bannedURLS[i]+"/") ||
            currentUrl.endsWith("www.instagram.com/"+bannedURLS[i])) {
                const mainElement = document.querySelector('main');
                // Check if a <main> element was found
                if (mainElement) {
                    mainElement.style.visibility = 'hidden';
                    element.style.pointerEvents = 'none';
                }
            }
        }
    });
}

function removeElement(elementName) {
    // Select all <a> tags 
    const allATags = document.querySelectorAll('a');

    // Iterate through each <a> tag and check its href attribute
    allATags.forEach(aTag => {
        const href = aTag.getAttribute('href');
        // Check if href attribute contains the desired substring
        if (href && href.includes(elementName)) {
            aTag.remove();
        }
    });
}

function removeSideBar() {
    for (let i = 0; i < 4; i++) {
        removeElement(settings[i]);
    }

    removeElement("#");
}

// reloads upon message from extension's popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'hardreloadCSS') {
        document.location.reload(true);
        initialize();
    } else if (message.action === 'softreloadCSS') {
        initialize("/direct/t");
    }
});

// reinitializing when navigating within website
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    initialize();
  }
}).observe(document, {subtree: true, childList: true});