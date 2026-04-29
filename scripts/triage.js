function handleTransferToChange(queue) {
  const selfHelpDiv = document.getElementById("selfHelpDiv");
  const selfHelp = document.getElementById("selfHelp");
  const rmaReasonDiv = document.getElementById("rmaReasonDiv");
  const rmaReason = document.getElementById("rmaReason");
  const cgrNotesDiv = document.getElementById("cgrNotesDiv");
  const cgrNotes = document.getElementById("cgrNotes");

  // Display fields based on selected system type
  if (queue === "Self Help Provided") {
    selfHelpDiv.classList.remove("hidden");
    rmaReasonDiv.classList.add("hidden");
    cgrNotesDiv.classList.add("hidden");
    selfHelp.required = true;
    rmaReason.required = false;
    cgrNotes.required = false;
  } else if (queue === "Set up RMA") {
    selfHelpDiv.classList.add("hidden");
    rmaReasonDiv.classList.remove("hidden");
    cgrNotesDiv.classList.add("hidden");
    selfHelp.required = false;
    rmaReason.required = true;
    cgrNotes.required = false;
  } else if (queue === "General Questions") {
    selfHelpDiv.classList.add("hidden");
    rmaReasonDiv.classList.add("hidden");
    cgrNotesDiv.classList.remove("hidden");
    selfHelp.required = false;
    rmaReason.required = false;
    cgrNotes.required = true;
  } else {
    selfHelpDiv.classList.add("hidden");
    rmaReasonDiv.classList.add("hidden");
    cgrNotesDiv.classList.add("hidden");
    selfHelp.required = false;
    rmaReason.required = false;
    cgrNotes.required = false;
  }
};

function handleWarrantyStatusChange(status) {
  const warrantyLevelDiv = document.getElementById("warrantyLevelDiv");
  const warrantyLevelTriage = document.getElementById("warrantyLevelTriage");
  // Display fields based on selected system type
  if (status === "Extended") {
    warrantyLevelDiv.classList.remove("hidden");
    warrantyLevelTriage.required = true;
  } else {
    warrantyLevelDiv.classList.add("hidden");
    warrantyLevelTriage.required = false;
  }
};


// Called by script.js when document loaded
function loadSavedValues() {
    const savedTransferredTo = localStorage.getItem("transferredTo");
    const transferredTo = document.getElementById("transferredTo");
    const savedwarrantyStatus = localStorage.getItem("warrantyStatus");
    const warrantyStatus = document.getElementById("warrantyStatus");
    if (savedTransferredTo) {
        transferredTo.value = savedTransferredTo;
        handleTransferToChange(savedTransferredTo);
    }
    if (savedwarrantyStatus) {
        warrantyStatus.value = savedwarrantyStatus;
        handleWarrantyStatusChange(savedwarrantyStatus);
    }
    
    transferredTo.addEventListener("change", function () {
        handleTransferToChange(transferredTo.value);
    });
    warrantyStatus.addEventListener("change", function () {
        handleWarrantyStatusChange(warrantyStatus.value);
    });

    return true;
}

// Called by script.js when copy button pressed
function copyPage() {
    const customerNameTriage = document.getElementById("customerNameTriage")?.value || "";
    const contactNumberTriage = document.getElementById("contactNumberTriage")?.value || "";
    const emailUpdated = document.getElementById("emailUpdated")?.value || "";
    const reasonForCall = document.getElementById("triageReasonForCall")?.value || "";
    const warrantyStatus = document.getElementById("warrantyStatus")?.value || "";
    const transferredTo = document.getElementById("transferredTo")?.value || "";
    const systemType = document.getElementById("systemTypeTriage")?.value || "";

    let fullText = `S/W: ${customerNameTriage.trim()}\n`;
    fullText += `Phone Number: ${contactNumberTriage.trim()}\n`;
    fullText += `Contact Email: ${emailUpdated.trim()}\n`;
    fullText += `System Type: ${systemType.trim()}\n`;
    fullText += `Reason for Call: ${reasonForCall.trim()}\n`;
    fullText += `Warranty Status: ${warrantyStatus}\n`;
    
    if (warrantyStatus === "Extended") {
        const warrantyLevelTriage = document.getElementById("warrantyLevelTriage")?.value;
        fullText += `Extended Warranty: ${warrantyLevelTriage}\n`;
    }
    
    fullText += `Transferred To: ${transferredTo}\n`;
    
    if (transferredTo === "Self Help Provided") {
        const selfHelp = document.getElementById("selfHelp")?.value;
        fullText += `Self Help Provided:\n${selfHelp.trim()}`;
    }
    if (transferredTo === "Set up RMA") {
        const rmaReason = document.getElementById("rmaReason")?.value;
        fullText += `RMA Reason:\n${rmaReason.trim()}`;
    }
    if (transferredTo === "General Questions") {
        const cgrNotes = document.getElementById("cgrNotes")?.value;
        fullText += `General Questions Notes:\n${cgrNotes.trim()}`;
    }

    return fullText;
}

// Called by script.js when clear button pressed
function clearPage(lastFormState) {
    lastFormState["transferredTo"] = transferredTo.value
    lastFormState["warrantyStatus"] = warrantyStatus.value

    handleTransferToChange("Not Selected");
    handleWarrantyStatusChange("Not Selected");

    return lastFormState;
}

// Called by script.js when undo button pressed
function undoClear(lastFormState) {
    if (lastFormState["transferredTo"] != null) {
        handleTransferToChange(lastFormState["transferredTo"]);
    }
    if (lastFormState["warrantyStatus"] != null) {
        handleWarrantyStatusChange(lastFormState["warrantyStatus"]);
    }

    return true;
}