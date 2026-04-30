function getRmaItem(partNumber=null, swVersion=null, partQuantity=null) {
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

    // Create the sw version input
    const swVersionInput = document.createElement("input");
    swVersionInput.type = "text";
    swVersionInput.name = "swVersion[]";
    swVersionInput.placeholder = "SW version path";
    if (swVersion) {
        swVersionInput.value = swVersion;
    }
    swVersionInput.required = false;

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
    swVersionInput.addEventListener("input", savePartsToLocalStorage);
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
      swVersionInput.classList.add("dark-mode");
      quantityInput.classList.add("dark-mode");
      removeButton.classList.add("dark-mode");
    }

    // Append inputs and remove button to the row
    formRow.appendChild(partNumberInput);
    formRow.appendChild(swVersionInput);
    formRow.appendChild(quantityInput);
    formRow.appendChild(removeButton);

    return formRow
}

function savePartsToLocalStorage() {
  const partsData = [];
  document.querySelectorAll(".form-row").forEach((row) => {
    var partNumber = row.querySelector('input[name="partNumber[]"]').value;
    var swVersion = row.querySelector('input[name="swVersion[]"]').value;
    var quantity = row.querySelector('input[name="quantity[]"]').value;
    partsData.push({ "partNumber":partNumber, "swVersion":swVersion, "quantity":quantity });
  });
  localStorage.setItem("partsData", JSON.stringify(partsData));
}



// Called by script.js when document loaded
function loadSavedValues() {
    const savedPartsData = JSON.parse(localStorage.getItem("partsData")) || [];
    savedPartsData.forEach((part) => {
      if (part.partNumber || part.swVersion || part.quantity) {
        const formRow = getRmaItem(part.partNumber, part.swVersion, part.quantity)
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
    const rmaType = document.getElementById("rmaType")?.value || "";
    const rmaNotes = document.getElementById("rmaNotes")?.value || "";

    var partNumbers = document.querySelectorAll('input[name="partNumber[]"]',);
    var swVersions = document.querySelectorAll('input[name="swVersion[]"]',);
    var quantities = document.querySelectorAll('input[name="quantity[]"]',);

    const addButton = document.getElementById("addButton");
    addButton.classList.remove("invalid-field");
    
    var fullText;
    switch (rmaType) {
      case 'Quote Request':
        fullText = 'Quote Request: (Customer Service Engineering Request)';
        break;
      case 'RMA Request':
        fullText = 'RMA Request:';
        break;
    }

    partNumbers.forEach((partNumberInput, index) => {
        var partNumber = partNumberInput.value || "N/A";
        var swVersion = swVersions[index]?.value || "";
        var quantity = quantities[index]?.value || "N/A";
        fullText += `\nSKU - ${partNumber.trim()}, Qty: ${quantity.trim()}`;
        if (swVersion != "")
          fullText += `\n\tSoftware Path: ${swVersion}`
    });

    if (rmaNotes != "")
      fullText += "\n\n" + rmaNotes.trim();

    return fullText;
}

// Called by script.js when clear button pressed
function clearPage(lastFormState) {
    const container = document.getElementById("dynamicForm");
    if (container) {
        var partsData = [];
        document.querySelectorAll(".form-row").forEach((row) => {
          const partNumber = row.querySelector('input[name="partNumber[]"]').value;
          const swVersion = row.querySelector('input[name="swVersion[]"]').value;
          const quantity = row.querySelector('input[name="quantity[]"]').value;
          partsData.push({ "partNumber":partNumber, "swVersion":swVersion, "quantity":quantity });
        });

        lastFormState.dynamicFieldValues = partsData
        container.innerHTML = ""; // Clears all child elements
    }
    
    savePartsToLocalStorage();
    
    return lastFormState;
}

// Called by script.js when undo button pressed
function undoClear(lastFormState) {
    // Restore dynamic fields
    const dynamicFormSection = document.getElementById("dynamicForm");
    if (dynamicFormSection && lastFormState.dynamicFieldValues) {
        lastFormState.dynamicFieldValues.forEach((part) => {
          if (part.partNumber || part.swVersion || part.quantity) {
            const formRow = getRmaItem(part.partNumber, part.swVersion, part.quantity)
            document.getElementById("dynamicForm").appendChild(formRow);
          }
        });
    }

    return true;
}