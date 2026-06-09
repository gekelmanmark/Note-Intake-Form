function getRmaItem(partNumber=null, partQuantity=null) {
    const formRow = document.createElement("div");
    formRow.classList.add("form-row");

    // Create the part number input
    const partNumberInput = document.createElement("input");
    partNumberInput.type = "text";
    partNumberInput.name = "partNumber[]";
    partNumberInput.placeholder = "Part Number";
    if (partNumber) {
        partNumberInput.value = partNumber;
    }
    partNumberInput.required = true;

    // Create the quantity input
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.name = "quantity[]";
    quantityInput.placeholder = "Quantity";
    if (partQuantity) {
        quantityInput.value = partQuantity;
    }
    quantityInput.required = true;


    // Event listeners to save part data
    partNumberInput.addEventListener("input", savePartsToLocalStorage);
    quantityInput.addEventListener("input", savePartsToLocalStorage);

    // Create the remove button
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("remove-button");
    removeButton.innerText = "Remove";
    removeButton.addEventListener("click", function () {
      formRow.remove();
      savePartsToLocalStorage();
    });

    // Apply dark mode class if active
    if (isDarkModeActive()) {
      partNumberInput.classList.add("dark-mode");
      quantityInput.classList.add("dark-mode");
      removeButton.classList.add("dark-mode");
    }

    // Append inputs and remove button to the row
    formRow.appendChild(partNumberInput);
    formRow.appendChild(quantityInput);
    formRow.appendChild(removeButton);

    return formRow
}

function savePartsToLocalStorage() {
  const partsData = [];
  document.querySelectorAll(".form-row").forEach((row) => {
    const partNumber = row.querySelector('input[name="partNumber[]"]').value;
    const quantity = row.querySelector('input[name="quantity[]"]').value;
    partsData.push({ "partNumber":partNumber, "quantity":quantity });
  });
  localStorage.setItem("partsData", JSON.stringify(partsData));
}


// Function to show or hide fields based on RMA Type
function handleRmaTypeChange (rmaType) {
  const inspectionField = document.getElementById("inspectionField");
  const warrantyField = document.getElementById("warrantyField");
  const warranty = document.getElementById("warranty");
  const orderField = document.getElementById("orderField");
  const order = document.getElementById("order");
  const warrantyLevelField = document.getElementById("warrantyLevelField");
  const approvedByField = document.getElementById("approvedByField");
  const weatherKitField = document.getElementById("weatherKitField");
  const weatherQuantityField = document.getElementById("weatherQuantityField");
  const weatherKitCheckBox = document.getElementById("weatherKitCheckBox");
  
  inspectionField.classList.add("hidden");
  warrantyField.classList.add("hidden");
  orderField.classList.add("hidden");
  warrantyLevelField.classList.add("hidden");
  approvedByField.classList.add("hidden");
  weatherKitField.classList.add("hidden");
  weatherQuantityField.classList.add("hidden");

  // Display fields based on selected RMA type
  if (rmaType === "Paid Repair - HT22X / Safe-XPP Only") {
    inspectionField.classList.remove("hidden");
    warrantyField.classList.add("hidden");
    orderField.classList.add("hidden");
    order.required = false;
    warrantyLevelField.classList.add("hidden");
  } else if (rmaType === "Sample") {
	  approvedByField.classList.remove("hidden");  
  } else if (rmaType === "Warranty ADV Replace") {
    warranty.required = true;
	weatherKitField.classList.remove("hidden");
    if (warranty.value === "Limited") {
      inspectionField.classList.remove("hidden");
      warrantyField.classList.remove("hidden");
      orderField.classList.remove("hidden");
      order.required = true;
      warrantyLevelField.classList.add("hidden");
    } else if (warranty.value === "Extended") {
      inspectionField.classList.remove("hidden");
      warrantyField.classList.remove("hidden");
      orderField.classList.remove("hidden");
      order.required = true;
      warrantyLevelField.classList.remove("hidden");
    } else {
      inspectionField.classList.remove("hidden");
      warrantyField.classList.remove("hidden");
      orderField.classList.add("hidden");
      order.required = false;
      warrantyLevelField.classList.add("hidden");
    }
	 
	if(weatherKitCheckBox.checked) {
		weatherQuantityField.classList.remove("hidden");
	} else {
		weatherQuantityField.classList.add("hidden");
	}
    warranty.addEventListener("change", function () {
      if (warranty.value === "Limited") {
        orderField?.classList.remove("hidden");
        order.required = true;
        warrantyLevelField?.classList.add("hidden");
      } else if (warranty.value === "Extended") {
        orderField?.classList.remove("hidden");
        order.required = true;
        warrantyLevelField?.classList.remove("hidden");
      } else {
        orderField?.classList.add("hidden");
        order.required = false;
        warrantyLevelField?.classList.add("hidden");
      }
    });
	weatherKitCheckBox.addEventListener("change", function () {
		if (weatherKitCheckBox.checked) {
			weatherQuantityField.classList.remove("hidden");
		} else {
			weatherQuantityField.classList.add("hidden");
		}
	});
	
	
  } else {
    // Hide all conditional fields for other RMA types
    inspectionField.classList.add("hidden");
    warrantyField.classList.add("hidden");
    orderField.classList.add("hidden");
    order.required = false;
    warrantyLevelField.classList.add("hidden");
	weatherKitField.classList.add("hidden");
	approvedByField.classList.add("hidden");
  }
};

function handleWarrantyTypeChange (warrantyType) {
  const rmaType = document.getElementById("rmaType")?.value || "";
  if (rmaType === "Warranty ADV Replace") {
    if (warrantyType === "Limited") {
      orderField?.classList.remove("hidden");
      order.required = true;
      warrantyLevelField?.classList.add("hidden");
    } else if (warrantyType === "Extended") {
      orderField?.classList.remove("hidden");
      order.required = true;
      warrantyLevelField?.classList.remove("hidden");
    } else {
      orderField?.classList.add("hidden");
      order.required = false;
      warrantyLevelField?.classList.add("hidden");
    }
  }
};

function openInncomRMA() {
    localStorage.setItem("Page Mode", "inncom")
    location.href='inncomrma.html';
}

// Called by script.js when document loaded
function loadSavedValues() {
    var lastPageType = localStorage.getItem("Page Mode");

    if (lastPageType == "inncom") {
        openInncomRMA()
        return false;
    } else {
        localStorage.setItem("Page Mode", "onity")
    }

    const savedRmaType = localStorage.getItem("rmaType");
    const savedWarrantyType = localStorage.getItem("warranty");
    const RmaTypeField = document.getElementById("rmaType");
    const warrantyTypeField = document.getElementById("warranty");
    if (savedRmaType) {
        document.getElementById("rmaType").value = savedRmaType;
        handleRmaTypeChange(savedRmaType); // Call the function to show/hide fields
    }
    if (savedWarrantyType) {
        document.getElementById("warranty").value = savedWarrantyType;
        handleWarrantyTypeChange(savedWarrantyType);
    }
    RmaTypeField.addEventListener("change", function () {
        const selectedRmaType = RmaTypeField.value;
        handleRmaTypeChange(selectedRmaType);
    });
    warrantyTypeField.addEventListener("change", function () {
        const selectedWarrantyType = warrantyTypeField.value;
        handleWarrantyTypeChange(selectedWarrantyType);
    });

    const savedPartsData = JSON.parse(localStorage.getItem("partsData")) || [];
    savedPartsData.forEach((part) => {
      if (part.partNumber || part.quantity) {
        const formRow = getRmaItem(part.partNumber, part.quantity)
        document.getElementById("dynamicForm").appendChild(formRow);
      }
    });

    const addButton = document.getElementById("addButton");
    addButton.addEventListener("click", function () {
        var formRow = getRmaItem();
        // Append the new row to the dynamic form section
        document.getElementById("dynamicForm").appendChild(formRow);
    });

    return true;
}

// Called by script.js prior to copying form data
function validateForm() {
    if (partNumbers.length == 0 || quantities.length == 0) {
        addButton.classList.add("invalid-field");
        return false;
    }

    return true
}

// Called by script.js when copy button pressed
function copyPage() {
    const skuSn = document.getElementById("skuSn")?.value || "";
    const reasonForReturn = document.getElementById("reasonForReturn")?.value || "";
    const failureReason = document.getElementById("failureReason")?.value || "";
    const rmaTroubleshooting = document.getElementById("rmaTroubleshooting")?.value || "";
    const rmaType = document.getElementById("rmaType")?.value || "";
    const redDot = document.getElementById("redDot")?.value || "";
    const shippingType = document.getElementById("shippingType")?.value || "";
    const callTag = document.getElementById("callTag")?.value || "";
    const warrantyField = document.getElementById("warranty")?.value || "";
    const inspectionChecked = document.getElementById("inspectionCheckbox")
        ?.checked
        ? "Yes"
        : "No";
	const approvedBy = document.getElementById("approvedBy")?.value || "";
	const weatherKitChecked = document.getElementById("weatherKitCheckBox")
		?.checked
		? "Yes"
		: "No";

    const orderNumber = document.getElementById("order")?.value || "";
    const warrantyLevel = document.getElementById("warrantyLevel")?.value || "";

    const partNumbers = document.querySelectorAll('input[name="partNumber[]"]',);
    const quantities = document.querySelectorAll('input[name="quantity[]"]',);
	const weatherQuantity = document.getElementById("weatherQuantity")?.value || "";

    const addButton = document.getElementById("addButton");
    addButton.classList.remove("invalid-field");
    
    let fullText = `RMA Type: ${rmaType}`;
    if (inspectionChecked === "Yes") {
        if (rmaType === "Warranty ADV Replace" || rmaType === "Paid Repair - HT22X / Safe-XPP Only") {
            fullText += ` **08 Inspection Requested**`;
        }
    }
    if (rmaType === "Warranty ADV Replace") {
        if (warrantyField === "Limited" || warrantyField === "Extended") {
            fullText += `\nWarranty: ${warrantyField}`;
            if (warrantyField === "Limited") {
                fullText += `\nOrder Number: ${orderNumber}`;
            }
            if (warrantyField === "Extended") {
                fullText += `\nOrder Number: ${orderNumber}`;
                fullText += `\nWarranty Type: ${warrantyLevel}`;
            }
        }
	}
	if (rmaType === "Sample") {
		if(approvedByField !== "Not Selected") {
			fullText += `\nApproved By: ${approvedBy}`; 
		}
	}


    fullText += `\nShipping Method: ${shippingType}`;
    fullText += `\nRed Dot: ${redDot}`;
    fullText += `\nCall Tag: ${callTag}\n`;
    fullText += `\nReason for Return: ${reasonForReturn.trim()}`;
    fullText += `\nFailure Reason: ${failureReason.trim()}\n`;
    fullText += `\nTroubleshooting Performed:\n${rmaTroubleshooting.trim()}`;
    fullText += skuSn ? `\n\nSKU / SN: ${skuSn.trim()}` : "";

    fullText += `\n\nParts List:\n`;
    partNumbers.forEach((partNumberInput, index) => {
        var partNumber = partNumberInput.value || "N/A";
        var quantity = quantities[index]?.value || "N/A";
        fullText += `Part Number: ${partNumber.trim().toUpperCase()}, Quantity: ${quantity.trim()}\n`;

    });
	
	if (weatherKitChecked) {	
		fullText += `Part Number: QH300560, Quantity: ${weatherQuantity.trim()}\n`;
		fullText += `Part Number: QH300580, Quantity: ${weatherQuantity.trim()}\n`;	
		
		fullText += `\n\nItems to return\n`;
		partNumbers.forEach((partNumberInput, index) => {
			var partNumber = partNumberInput.value || "N/A";
			var quantity = quantities[index]?.value || "N/A";
			fullText += `Part Number: ${partNumber.trim().toUpperCase()}, Quantity: ${quantity.trim()}\n`;
		});
		
		fullText += `\n\nItems not to be Returned: \n`;
		fullText += `Part Number: QH300560, Quantity: ${weatherQuantity.trim()}\n`;
		fullText += `Part Number: QH300580, Quantity: ${weatherQuantity.trim()}\n`;
		
    }

    return fullText;
}

// Called by script.js when clear button pressed
function clearPage(lastFormState) {
    handleRmaTypeChange("Not Selected"); // Call the function to show/hide fields
    const container = document.getElementById("dynamicForm");
    if (container) {
        var partsData = [];
        document.querySelectorAll(".form-row").forEach((row) => {
          const partNumber = row.querySelector('input[name="partNumber[]"]').value;
          const quantity = row.querySelector('input[name="quantity[]"]').value;
          partsData.push({ "partNumber":partNumber, "quantity":quantity });
        });

        lastFormState.dynamicFieldValues = partsData
        container.innerHTML = ""; // Clears all child elements
    }
    
    savePartsToLocalStorage();
    
    return lastFormState;
}

// Called by script.js when undo button pressed
function undoClear(lastFormState) {
    if (lastFormState["rmaType"] != null) {
        handleRmaTypeChange(lastFormState["rmaType"]);
    }
    if (lastFormState["warranty"] != null) {
        handleWarrantyTypeChange(lastFormState["warranty"]);
    }

    // Restore dynamic fields
    const dynamicFormSection = document.getElementById("dynamicForm");
    if (dynamicFormSection && lastFormState.dynamicFieldValues) {
        lastFormState.dynamicFieldValues.forEach((part) => {
          if (part.partNumber || part.quantity) {
            const formRow = getRmaItem(part.partNumber, part.quantity)
            document.getElementById("dynamicForm").appendChild(formRow);
          }
        });
    }

    return true;
}




