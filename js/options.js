const numOfOptions = 6;
const checks = new Array(numOfOptions).fill(false);

document.addEventListener("DOMContentLoaded", initialize);
document.querySelector("form").addEventListener("change", saveOptions);

function initialize() {
    chrome.storage.sync.get(null, function(data) {
        for (let i = 0; i < numOfOptions; i++) {
            if (data[i+""] !== undefined) {
                checks[i] = data[i+""];
                /*document.getElementsByClassName(".slider").style.transition = "0s";*/
                document.getElementById(i+"").checked = checks[i];
                /*document.getElementsByClassName(".slider").style.transition = ".3s";*/
            }
        }
        updateImage();
    });
}

function saveOptions(e) {
    const turnedOff = checks[e.target.id];
    // toggles check
    checks[e.target.id] = !checks[e.target.id];
    updateImage();

    // updates browser storage
    const data = {};
    for (let i = 0; i < numOfOptions; i++) {
        data[i+""] = checks[i];
    }
    chrome.storage.sync.set(data);
    e.preventDefault();

    // reload page if changes are applied
    let actionType = '';
    if (turnedOff) {
        actionType = 'hard';
    } else {
        actionType = 'soft';
    }
    console.log(actionType);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
        action: actionType + 'reloadCSS',
        });
    });
}

function updateImage() {
    for (let i = 0; i < numOfOptions; i++) {
        if (checks[i]) {
            document.getElementById("c1").style.borderColor = "#ee2a7bff";
            document.getElementById("c1").style.backgroundImage = 'url("../icons/control_gradient.svg")';

            // defines gradient for title
            document.querySelector(':root').style.setProperty("--grad1", "#f9ce34ff");
            document.querySelector(':root').style.setProperty("--grad2", "#ee2a7bff");
            document.querySelector(':root').style.setProperty("--grad3", "#6228d7ff");
            return;
        }
    }
    document.getElementById("c1").style.borderColor = "#272727";
    document.getElementById("c1").style.backgroundImage = 'url("../icons/control_grey.svg")';

    // changes gradient back to gray
    document.querySelector(':root').style.setProperty("--grad1", "#272727");
    document.querySelector(':root').style.setProperty("--grad2", "#272727");
    document.querySelector(':root').style.setProperty("--grad3", "#272727");
}