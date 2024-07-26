// all the possible stylesheets to be turned on
const settings = ["reels", "explore", "direct", "grayscale", "inboxOnly"];
const associatedElement = [];
const whiteListedUrls = ["instagram.com/direct/", "instagram.com/p/", "instagram.com/accounts/", "instagram.com/challenge/"];

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
            } else if (elementName === "inboxOnly") {
                if (data[index]) {
                    let isInbox = false;
                    for (let i = 0; i < whiteListedUrls.length; i++) {
                        if (currentUrl.includes(whiteListedUrls[i])) {
                            isInbox = true;
                            break;
                        }
                    }
    
                    if (!isInbox) {
                        alert('You have turned on "inbox only" with Control for Instagram');
                        window.location.href = "https://www.instagram.com/direct/";
                        return;
                    }
                    removeSideBar();
                }
            } else if (elementName === "suggestedPosts") {
                if (data[index]) {
                    removeSuggested();
                }
                else {
                    addSuggested();
                }
            } else {
                if (data[index]) {
                    removeElement(elementName);
                    if (currentUrl.includes("www.instagram.com/"+elementName+"/") ||
                        currentUrl.endsWith("www.instagram.com/"+elementName)) {
                        const mainElement = document.querySelector('main');
                        // Check if a <main> element was found
                        if (mainElement) {
                            mainElement.style.visibility = 'hidden';
                            mainElement.style.pointerEvents = 'none';
                        }
                    }   
                } else {
                    addElement(elementName);
                    if (currentUrl.includes("www.instagram.com/"+elementName+"/") ||
                        currentUrl.endsWith("www.instagram.com/"+elementName)) {
                        const mainElement = document.querySelector('main');
                        // Check if a <main> element was found
                        if (mainElement) {
                            mainElement.style.visibility = 'visible';
                            mainElement.style.pointerEvents = 'auto';
                        }
                    }
                }
            }
        });
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
            aTag.style.opacity = '0.3';
            aTag.style.pointerEvents = 'none';
        }
    });
}

function addElement(elementName) {
    // Select all <a> tags 
    const allATags = document.querySelectorAll('a');

    // Iterate through each <a> tag and check its href attribute
    allATags.forEach(aTag => {
        const href = aTag.getAttribute('href');
        // Check if href attribute contains the desired substring
        if (href && href.includes(elementName)) {
            aTag.style.opacity = '1';
            aTag.style.pointerEvents = 'auto';
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
    initialize();
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