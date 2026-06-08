// Called by script.js when document loaded
function loadSavedValues() {
    const savedaddress = localStorage.getItem("propertyAddress");
    const address = document.getElementById("propertyAddress");
    const savedneeded = localStorage.getItem("needed");
    const needed = document.getElementById("needed");
    
    return true;
}

// Called by script.js when copy button pressed
function copyPage() {
    const propertyAddress = document.getElementById("propertyAddress")?.value || "";
    const needed = document.getElementById("needed")?.value || "";
    
    let fullText = `Full Address:\n ${propertyAddress.trim()}\n`;
    fullText += `Decription:\n ${needed.trim()}\n`;

    return fullText;
}

// Called by script.js when clear button pressed
function clearPage(lastFormState) {
    lastFormState["propertyAddress"] = propertyAddress.value
    lastFormState["needed"] = needed.value

    return lastFormState;
}

// Called by script.js when undo button pressed
function undoClear(lastFormState) {
    return true;
}

