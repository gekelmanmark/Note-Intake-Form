// Function to show or hide fields based on System Type Type
function handleSystemTypeChange(systemType) {
  const batteryCheckDiv = document.getElementById("batteryCheckDiv");
  const lithiumBatteryDiv = document.getElementById("lithiumBatteryDiv");
  const modemTypeDiv = document.getElementById("modemTypeDiv");

  // Display fields based on selected system type
  if (systemType === "HT22X") {
    batteryCheckDiv.classList.remove("hidden");
    lithiumBatteryDiv.classList.remove("hidden");
    modemTypeDiv.classList.remove("hidden");
  } else {
    // Show all conditional fields for other system types
    batteryCheckDiv.classList.add("hidden");
    lithiumBatteryDiv.classList.add("hidden");
    modemTypeDiv.classList.add("hidden");
  }
};

const handleDialInFeeChange = (status) => {
  const billingDiv = document.getElementById("billingDiv");
  const underWarrantyDiv = document.getElementById("underWarrantyDiv");
  const creditHoldDiv = document.getElementById("creditHoldDiv");
  const reasonWaivedDiv = document.getElementById("reasonWaivedDiv");
  const reasonWaivedField = document.getElementById("reasonWaived");

  // Display fields based on select
  if (status === "Waived") {
    billingDiv.classList.add("hidden");
    underWarrantyDiv.classList.remove("hidden");
    creditHoldDiv.classList.add("hidden");
    reasonWaivedDiv.classList.remove("hidden");
    reasonWaivedField.required = true;
  } else if (status === "Charged") {
    underWarrantyDiv.classList.add("hidden");
    billingDiv.classList.remove("hidden");
    creditHoldDiv.classList.remove("hidden");
    reasonWaivedDiv.classList.add("hidden");
    reasonWaivedField.required = false;
  } else {
    underWarrantyDiv.classList.add("hidden");
    billingDiv.classList.add("hidden");
    creditHoldDiv.classList.add("hidden");
    reasonWaivedDiv.classList.add("hidden");
    reasonWaivedField.required = false;
  }
};


// Called by script.js when document loaded
function loadSavedValues() {
    const savedSystemType = localStorage.getItem("systemType");
    const savedDialInFeeType = localStorage.getItem("dialInFee");
    const systemTypeField = document.getElementById("systemType");
    const dialInFeeField = document.getElementById("dialInFee");
    if (systemTypeField) {
        if (savedSystemType) {
            document.getElementById("systemType").value = savedSystemType;
            handleSystemTypeChange(savedSystemType);
        }
    }
    if (dialInFeeField) {
        if (savedDialInFeeType) {
            document.getElementById("dialInFee").value = savedDialInFeeType;
            handleDialInFeeChange(savedDialInFeeType);
        } else {
            handleDialInFeeChange("Not Selected");
        }
    }
    systemTypeField.addEventListener("change", function () {
        const selectedSystemType = systemTypeField.value;
        handleSystemTypeChange(selectedSystemType);
    });
    dialInFeeField.addEventListener("change", function () {
        const selectedDialInFeeType = dialInFeeField.value;
        handleDialInFeeChange(selectedDialInFeeType);
    });

    return true;
}

// Called by script.js prior to copying form data
function validateForm() {
    return true
}

// Called by script.js when copy button pressed
function copyPage() {
    const contactName = document.getElementById("contactName")?.value || "";
    const contactNumber = document.getElementById("contactNumber")?.value || "";
    const systemType = document.getElementById("systemType")?.value || "";
    const dialInType = document.getElementById("dialInType")?.value || "";
    const SAP = document.getElementById("SAP")?.value || "";
    const dialInFee = document.getElementById("dialInFee")?.value || "";

    let fullText = `Contact Name: ${contactName}\n`;
    fullText += `Contact Number: ${contactNumber}\n`;
    fullText += `System Type: ${systemType}\n`;
    fullText += `Dial-In Type: ${dialInType}\n`;
    fullText += `Dial-In Fee: ${dialInFee}\n`;

    if (dialInFee != "Waived") {
        const billing = document.getElementById("billing")?.value;
        fullText += `Billing: ${billing}\n`;
    }

    fullText += `ERP Account (SAP): ${SAP}\n`;

    if (dialInFee != "Waived") {
        const creditHold = document.getElementById("creditHold")?.value;
        fullText += `Credit Hold: ${creditHold}\n`;
    }
    if (dialInFee === "Waived") {
        const underWarranty = document.getElementById("underWarranty")?.value;
        fullText += `Under Warranty?: ${underWarranty}\n`;
    }
    if (systemType === "HT22X") {
        const batteryCheck = document.getElementById("batteryCheck")?.value;
        const lithiumBattery = document.getElementById("lithiumBattery")?.value;
        const modemType = document.getElementById("modemType")?.value;

        fullText += `Battery Check: ${batteryCheck}\n`;
        fullText += `Lithium Battery: ${lithiumBattery}\n`;
        fullText += `Modem Type: ${modemType}\n`;
    }
    if (dialInFee === "Waived") {
        const reasonWaived = document.getElementById("reasonWaived")?.value;
        fullText += `Waived Fee Reason:\n${reasonWaived}\n`;
    }

    return fullText;
}

// Called by script.js when clear button pressed
function clearPage(lastFormState) {
    const systemTypeField = document.getElementById("systemType");
    lastFormState["systemType"] = systemTypeField.value
    const dialInFeeField = document.getElementById("dialInFee");
    lastFormState["dialIInFee"] = dialInFeeField.value

    handleSystemTypeChange("Not Selected"); // Call the function to show/hide fields
    handleDialInFeeChange("Not Selected"); // Call the function to show/hide fields

    return lastFormState;
}

// Called by script.js when undo button pressed
function undoClear(lastFormState) {
    if (lastFormState["systemType"] != null) {
        handleSystemTypeChange(lastFormState["systemType"]);
    }
    if (lastFormState["dialIInFee"] != null) {
        handleDialInFeeChange(lastFormState["dialIInFee"]);
    }

    return true;
}