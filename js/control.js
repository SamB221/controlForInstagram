// all the possible stylesheets to be turned on
const settings = ["reels", "explore", "inbox", "notifications", "comments", "grayscale"];
const bannedURLS = [];

initialize();

function initialize() {
    var currentUrl = window.location.href;
    // accesses preferences from storage to determine style sheets
    chrome.storage.sync.get(null, function(data) {
        settings.forEach((elementName, index) => {
            console.log(elementName);
            if (data[index]) {
                if (elementName!="grayscale") {
                    removeElement(elementName);
                    bannedURLS.push(elementName);
                } else {
                    document.body.style.filter = 'grayscale(100%)';
                }
            }
        });
    });
    
    for (let i = 0; i < bannedURLS.length; i++) {
        // clears page if on page that is "banned"
        if (currentUrl.includes(bannedURLS[i])) document.body.innerHTML = "You shouldn't be here...";
    }
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

// reloads upon message from extension's popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'reloadCSS') {
        initialize();
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