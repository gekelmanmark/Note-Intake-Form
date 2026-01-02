document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname.split("/").pop(); // Get the current page name
  const navLinks = document.querySelectorAll(".nav-link");

  // Save form data to local storage on every input change
  const saveFormData = () => {
    const formElements = document.querySelectorAll("input, textarea, select");
    formElements.forEach((element) => {
      element.addEventListener("input", () => {
        if (element.type === "checkbox") {
          localStorage.setItem(element.id, element.checked);
        } else {
          localStorage.setItem(element.id, element.value);
        }
      });
    });
  };

  // Clear local storage when form is reset
  const clearFormData = () => {
    const formElements = document.querySelectorAll("input, textarea, select");
    formElements.forEach((element) => {
      localStorage.removeItem(element.id);
    });
  };

  // Retrieve form data from local storage and populate the fields
  const populateFormData = () => {
    const formElements = document.querySelectorAll("input, textarea, select");
    formElements.forEach((element) => {
      const savedValue = localStorage.getItem(element.id);
      if (savedValue !== null) {
        if (element.type === "checkbox") {
          element.checked = savedValue === "true"; // Convert string back to boolean
        } else {
          element.value = savedValue;
        }
      }
    });

    const rmaFormLoaded = document.getElementById("rmaType");
    if (rmaFormLoaded) {
      // Load saved parts data
      const savedPartsData =
        JSON.parse(localStorage.getItem("partsData")) || [];
      savedPartsData.forEach((part) => {
        if (part.partNumber || part.quantity) {
          const formRow = document.createElement("div");
          formRow.classList.add("form-row");

          const partNumberInput = document.createElement("input");
          partNumberInput.type = "text";
          partNumberInput.name = "partNumber[]";
          partNumberInput.placeholder = "Part Number";
          partNumberInput.value = part.partNumber;
          partNumberInput.required = true;
          partNumberInput.addEventListener("input", savePartsToLocalStorage);

          const quantityInput = document.createElement("input");
          quantityInput.type = "number";
          quantityInput.name = "quantity[]";
          quantityInput.placeholder = "Quantity";
          quantityInput.value = part.quantity;
          quantityInput.required = true;
          quantityInput.addEventListener("input", savePartsToLocalStorage);

          const removeButton = document.createElement("button");
          removeButton.type = "button";
          removeButton.classList.add("remove-button");
          removeButton.innerText = "Remove";
          removeButton.addEventListener("click", function () {
            formRow.remove();
            savePartsToLocalStorage();
          });

          if (isDarkModeActive()) {
            partNumberInput.classList.add("dark-mode");
            quantityInput.classList.add("dark-mode");
            removeButton.classList.add("dark-mode");
          }

          formRow.appendChild(partNumberInput);
          formRow.appendChild(quantityInput);
          formRow.appendChild(removeButton);
          document.getElementById("dynamicForm").appendChild(formRow);
        }
      });
    }
    // const triageFormLoaded = document.getElementById("triageForm");
    // if (triageFormLoaded) {
    //   const warrantyStatus = localStorage.getItem("warrantyStatus");
    //   const transferredTo = localStorage.getItem("transferredTo");
    //   handleWarrantyStatusChange(warrantyStatus);
    //   handleTransferToChange(transferredTo);
    // }
  };

  // Function to show or hide fields based on RMA Type
  const handleRmaTypeChange = (rmaType) => {
    const inspectionField = document.getElementById("inspectionField");
    const warrantyField = document.getElementById("warrantyField");
    const warranty = document.getElementById("warranty");
    const orderField = document.getElementById("orderField");
    const order = document.getElementById("order");
    const warrantyLevelField = document.getElementById("warrantyLevelField");

    // Display fields based on selected RMA type
    if (rmaType === "Paid Repair - HT22X / Safe-XPP Only") {
      inspectionField.classList.remove("hidden");
      warrantyField.classList.add("hidden");
      orderField.classList.add("hidden");
      order.required = false;
      warrantyLevelField.classList.add("hidden");
    } else if (rmaType === "Warranty ADV Replace") {
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
    } else {
      // Hide all conditional fields for other RMA types
      inspectionField.classList.add("hidden");
      warrantyField.classList.add("hidden");
      orderField.classList.add("hidden");
      order.required = false;
      warrantyLevelField.classList.add("hidden");
    }
  };

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active"); // Add 'active' class to the current page's link
    }
  });

  // Function to show or hide fields based on System Type Type
  const handleSystemTypeChange = (systemType) => {
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

  const handleTransferToChange = (queue) => {
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

  const handleWarrantyStatusChange = (status) => {
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

  const handleWarrantyTypeChange = (warrantyType) => {
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

  // Function to show the notification after copying
  function showNotification() {
    const notification = document.getElementById("copyNotification");
    if (notification) {
      notification.classList.remove("hidden"); // Ensure it's visible
      notification.classList.add("show"); // Trigger the animation

      setTimeout(() => {
        notification.classList.remove("show"); // Hide after 3 seconds
      }, 3000);
    }
  }

  // Function to apply custom styles to invalid fields
  function applyValidationStyles(form) {
    const formElements = form.querySelectorAll("input, textarea, select");
    formElements.forEach((element) => {
      if (
        !element.checkValidity() ||
        (element.tagName === "SELECT" && element.value === "Not Selected")
      ) {
        // Skip elements that are hidden or have hidden parents
        if (!isElementOrParentHidden(element)) {
          element.classList.add("invalid-field"); // Add a custom invalid class to highlight
        }
      }
    });
  }

  // Function to clear custom validation styles
  function clearValidationStyles(form) {
    const formElements = form.querySelectorAll(".invalid-field");
    formElements.forEach((element) => {
      element.classList.remove("invalid-field"); // Remove the custom invalid class
    });
  }

  function isElementOrParentHidden(element) {
    let parent = element.parentElement;
    while (parent) {
      if (
        parent.hasAttribute("hidden") ||
        parent.classList.contains("hidden")
      ) {
        return true; // If any parent element has the hidden attribute or 'hidden' class
      }
      parent = parent.parentElement;
    }
    return (
      element.hasAttribute("hidden") ||
      element.classList.contains("hidden") ||
      element.disabled
    ); // Also check the element itself
  }

  // Dark Mode Toggle Function
  const toggleButton = document.getElementById("toggle-mode");
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      toggleDarkModeClasses();
      const isDarkMode = document.body.classList.contains("dark-mode");
      localStorage.setItem("mode", isDarkMode ? "dark" : "light");
    });

    // Function to toggle dark mode classes
    function toggleDarkModeClasses() {
      document.body.classList.toggle("dark-mode");
      const elementsToToggle = [
        document.querySelector(".container"),
        document.querySelector(".modal"),
        document.querySelector("h1"),
        ...document.querySelectorAll("textarea"),
        ...document.querySelectorAll("select"),
        ...document.querySelectorAll("input"),
        ...document.querySelectorAll("option"),
        ...document.querySelectorAll("nav"),
        ...document.querySelectorAll("button"),
      ];

      elementsToToggle.forEach((el) => {
        if (el) el.classList.toggle("dark-mode");
      });
    }

    // Apply saved dark mode from localStorage
    const currentMode = localStorage.getItem("mode") || "light";
    if (currentMode === "dark") {
      toggleDarkModeClasses();
    }
  }

  // Function to check if dark mode is active
  function isDarkModeActive() {
    return document.body.classList.contains("dark-mode");
  }

  // Add more parts (Part Number and Quantity) functionality
  const addButton = document.getElementById("addButton");
  if (addButton) {
    addButton.addEventListener("click", function () {
      const uniqueRowId = Date.now(); // Generate a unique ID for the row

      const formRow = document.createElement("div");
      formRow.classList.add("form-row");

      // Create the part number input
      const partNumberInput = document.createElement("input");
      partNumberInput.type = "text";
      partNumberInput.name = "partNumber[]";
      partNumberInput.placeholder = "Part Number";
      partNumberInput.required = true;
      partNumberInput.setAttribute("data-id", `partNumber-${uniqueRowId}`);

      // Create the quantity input
      const quantityInput = document.createElement("input");
      quantityInput.type = "number";
      quantityInput.name = "quantity[]";
      quantityInput.placeholder = "Quantity";
      quantityInput.required = true;
      quantityInput.setAttribute("data-id", `quantity-${uniqueRowId}`); // Append uniqueRowId with a different prefix

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

      // Append the new row to the dynamic form section
      document.getElementById("dynamicForm").appendChild(formRow);
    });
  }

  function savePartsToLocalStorage() {
    const RmaForm = document.getElementById("rmaForm") || "";
    if (RmaForm.name === "rmaForm") {
      const partsData = [];
      document.querySelectorAll(".form-row").forEach((row) => {
        const partNumber = row.querySelector(
          'input[name="partNumber[]"]'
        ).value;
        const quantity = row.querySelector('input[name="quantity[]"]').value;
        partsData.push({ partNumber, quantity });
      });
      localStorage.setItem("partsData", JSON.stringify(partsData));
    }
  }

  // Clear buttons for forms
  let lastFormState = null; // Variable to store the form's state before clearing
  const clearButton = document.getElementById("clearButton");
  const undoClearButton = document.getElementById("undoClearButton");
  if (clearButton) {
    clearButton.addEventListener("click", function () {
      const forms = [
        "contactForm",
        "dialInForm",
        "rmaForm",
        "product99",
        "triageForm",
      ];
      forms.forEach((formId) => {
        const form = document.getElementById(formId);
        if (form) {
          // Save the current form state before clearing
          lastFormState = {};
          const formElements = form.querySelectorAll("input, textarea, select");
          formElements.forEach((element) => {
            lastFormState[element.id] = element.value; // Save field value
          });
          if (form.id === "rmaForm") {
            handleRmaTypeChange("Not Selected"); // Call the function to show/hide fields
            const container = document.getElementById("dynamicForm");
            if (container) {
              lastFormState.dynamicFieldValues = Array.from(
                container.querySelectorAll("input")
              ).map((input) => ({
                name: input.name,
                value: input.value,
                dataId: input.getAttribute("data-id"), // Save the unique data-id
              }));
              lastFormState.dynamicFields = container.innerHTML;
              container.innerHTML = ""; // Clears all child elements
            }
          }
          if (form.id === "dialInForm") {
            handleSystemTypeChange("Not Selected"); // Call the function to show/hide fields
            handleDialInFeeChange("Not Selected"); // Call the function to show/hide fields
          }
          if (form.id === "triageForm") {
            handleTransferToChange("Not Selected");
            handleWarrantyStatusChange("Not Selected");
          }
          form.reset();
          savePartsToLocalStorage();
          // Hide Undo button if no state is saved
          if (Object.keys(lastFormState).length > 0) {
            undoClearButton.classList.remove("hidden"); // Show "Undo Clear" button
          }
        }
      });
    });
    clearButton.addEventListener("click", clearFormData);
  }

  if (undoClearButton) {
    undoClearButton.addEventListener("click", function () {
      if (lastFormState) {
        const forms = [
          "contactForm",
          "dialInForm",
          "rmaForm",
          "product99",
          "triageForm",
        ];
        forms.forEach((formId) => {
          const form = document.getElementById(formId);
          if (form) {
            // Restore static form fields
            const formElements = form.querySelectorAll(
              "input, textarea, select"
            );
            formElements.forEach((element) => {
              if (lastFormState[element.id] !== undefined) {
                if (element.id === "rmaType") {
                  handleRmaTypeChange(lastFormState[element.id]);
                }
                if (element.id === "warranty") {
                  handleWarrantyTypeChange(lastFormState[element.id]);
                }
                if (element.id === "systemType") {
                  handleSystemTypeChange(lastFormState[element.id]);
                }
                if (element.id === "dialInFee") {
                  handleDialInFeeChange(lastFormState[element.id]);
                }
                if (element.id === "transferredTo") {
                  handleTransferToChange(lastFormState[element.id]);
                }
                if (element.id === "warrantyStatus") {
                  handleWarrantyStatusChange(lastFormState[element.id]);
                }
                element.value = lastFormState[element.id]; // Restore field value
              }
            });

            // Restore dynamic fields
            const dynamicFormSection = document.getElementById("dynamicForm");
            if (dynamicFormSection && lastFormState.dynamicFields) {
              dynamicFormSection.innerHTML = lastFormState.dynamicFields;

              // Restore values for dynamic fields
              lastFormState.dynamicFieldValues?.forEach(
                ({ name, value, dataId }) => {
                  console.log(`value: ${value}`);
                  const field = dynamicFormSection.querySelector(
                    `[data-id="${dataId}"]`
                  );
                  console.log(`[data-id="${dataId}"]`);
                  if (field) {
                    field.value = value; // Restore the saved value
                  }
                }
              );
            }
            // Clear the saved state
            lastFormState = null;
            undoClearButton.classList.add("hidden"); // Hide "Undo Clear" button
          }
        });
      }
    });
  }

  const copyButton99 = document.getElementById("copyButton99");
  const product99Form = document.getElementById("product99");
  if (copyButton99 && product99Form) {
    copyButton99.addEventListener("click", function () {
      clearValidationStyles(product99Form);
      const selectElements = document.querySelectorAll("select");
      let formIsValid = true;

      // Loop through all the select elements and check if "None" is selected
      selectElements.forEach((select) => {
        if (select.value === "Not Selected") {
          select.classList.add("invalid-field"); // Highlight the field with red
          formIsValid = false;
        } else {
          select.classList.remove("invalid-field"); // Remove red highlight if valid
        }
      });

      if (product99Form.checkValidity() && formIsValid) {
        const reportDate = document.getElementById("reportDate")?.value || "";
        const incidentDate =
          document.getElementById("incidentDate")?.value || "";
        const contactName =
          document.getElementById("contactName99")?.value || "";
        const contactNumber =
          document.getElementById("contactNumber99")?.value || "";
        const email = document.getElementById("email")?.value || "";
        const productType = document.getElementById("productType")?.value || "";
        const lockCaseType =
          document.getElementById("lockCaseType")?.value || "";
        const numberOfRoomsInHotel =
          document.getElementById("numberOfRoomsInHotel")?.value || "";
        const warrantyStartDate =
          document.getElementById("warrantyStartDate")?.value || "";
        const accountNumber =
          document.getElementById("accountNumber")?.value || "";
        const caseNumber = document.getElementById("caseNumber")?.value || "";
        const propertyName =
          document.getElementById("propertyName")?.value || "";
        const propertyAddress =
          document.getElementById("propertyAddress")?.value || "";
        const summary = document.getElementById("summary")?.value || "";

        let fullText = `Report Date: ${reportDate}\n`;
        fullText += `Incident Date: ${incidentDate}\n`;
        fullText += `Contact Name: ${contactName}\n`;
        fullText += `Contact Number: ${contactNumber}\n`;
        fullText += `Email Address: ${email}\n\n`;
        fullText += `Product Type: ${productType}\n`;
        fullText += `Lock Case Type: ${lockCaseType}\n`;
        fullText += `Number of Rooms in Hotel: ${numberOfRoomsInHotel}\n`;
        fullText += `Warranty Start Date: ${warrantyStartDate}\n`;
        fullText += `Account Number: ${accountNumber}\n`;
        fullText += `Case Number: ${caseNumber}\n\n`;
        fullText += `Property Name: ${propertyName}\n`;
        fullText += `Property Address: ${propertyAddress}\n\n`;
        fullText += `Summary:\n${summary.trim()}`;

        navigator.clipboard
          .writeText(fullText)
          .then(() => {
            showNotification();
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
          });
      } else {
        // If form is invalid, show validation error
        applyValidationStyles(product99Form);
      }
    });
  }

  const copyButtonTriage = document.getElementById("copyButtonTriage");
  const triageForm = document.getElementById("triageForm");
  if (copyButtonTriage && triageForm) {
    copyButtonTriage.addEventListener("click", function () {
      clearValidationStyles(triageForm);
      const selectElements = document.querySelectorAll("select");
      let formIsValid = true;

      // Loop through all the select elements and check if "None" is selected
      selectElements.forEach((select) => {
        if (
          select.value === "Not Selected" &&
          !isElementOrParentHidden(select)
        ) {
          select.classList.add("invalid-field"); // Highlight the field with red
          formIsValid = false;
        } else {
          select.classList.remove("invalid-field"); // Remove red highlight if valid
        }
      });
      if (triageForm.checkValidity() && formIsValid) {
        const customerNameTriage =
          document.getElementById("customerNameTriage")?.value || "";
        const contactNumberTriage =
          document.getElementById("contactNumberTriage")?.value || "";
        const emailUpdated =
          document.getElementById("emailUpdated")?.value || "";
        const reasonForCall =
          document.getElementById("triageReasonForCall")?.value || "";
        const warrantyStatus =
          document.getElementById("warrantyStatus")?.value || "";
        const warrantyLevelTriage =
          document.getElementById("warrantyLevelTriage")?.value || "";
        const transferredTo =
          document.getElementById("transferredTo")?.value || "";
        const selfHelp = document.getElementById("selfHelp")?.value || "";
        const rmaReason = document.getElementById("rmaReason")?.value || "";
        const cgrNotes = document.getElementById("cgrNotes")?.value || "";
        const systemType = document.getElementById("systemTypeTriage")?.value || "";

        let fullText = `S/W: ${customerNameTriage.trim()}\n`;
        fullText += `Phone Number: ${contactNumberTriage.trim()}\n`;

        fullText += `Contact Email: ${emailUpdated.trim()}\n`;
        fullText += `System Type: ${systemType.trim()}\n`;
        fullText += `Reason for Call: ${reasonForCall.trim()}\n`;
        fullText += `Warranty Status: ${warrantyStatus}\n`;
        if (warrantyStatus === "Extended") {
          fullText += `Extended Warranty: ${warrantyLevelTriage}\n`;
        }
        fullText += `Transferred To: ${transferredTo}\n`;
        if (transferredTo === "Self Help Provided") {
          fullText += `Self Help Provided:\n${selfHelp.trim()}`;
        }
        if (transferredTo === "Set up RMA") {
          fullText += `RMA Reason:\n${rmaReason.trim()}`;
        }
        if (transferredTo === "General Questions") {
          fullText += `General Questions Notes:\n${cgrNotes.trim()}`;
        }
        navigator.clipboard
          .writeText(fullText)
          .then(() => {
            showNotification();
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
          });
      } else {
        // If form is invalid, show validation error
        applyValidationStyles(triageForm);
      }
    });
  }

  // Copy button for Dial-In page
  const copyButtonDialIn = document.getElementById("copyButtonDialIn");
  const dialInForm = document.getElementById("dialInForm");
  if (copyButtonDialIn && dialInForm) {
    copyButtonDialIn.addEventListener("click", function () {
      clearValidationStyles(dialInForm);
      const selectElements = document.querySelectorAll("select");
      let formIsValid = true;

      // Loop through all the select elements and check if "None" is selected
      selectElements.forEach((select) => {
        if (
          select.value === "Not Selected" &&
          !isElementOrParentHidden(select)
        ) {
          select.classList.add("invalid-field"); // Highlight the field with red
          formIsValid = false;
        } else {
          select.classList.remove("invalid-field"); // Remove red highlight if valid
        }
      });
      if (dialInForm.checkValidity() && formIsValid) {
        const contactName = document.getElementById("contactName")?.value || "";
        const contactNumber =
          document.getElementById("contactNumber")?.value || "";
        const systemType = document.getElementById("systemType")?.value || "";
        const underWarranty =
          document.getElementById("underWarranty")?.value || "";
        const dialInType = document.getElementById("dialInType")?.value || "";
        const SAP = document.getElementById("SAP")?.value || "";
        const dialInFee = document.getElementById("dialInFee")?.value || "";
        const creditHold = document.getElementById("creditHold")?.value || "";
        const batteryCheck =
          document.getElementById("batteryCheck")?.value || "";
        const lithiumBattery =
          document.getElementById("lithiumBattery")?.value || "";
        const modemType = document.getElementById("modemType")?.value || "";
        const billing = document.getElementById("billing")?.value || "";
        const reasonWaived =
          document.getElementById("reasonWaived")?.value || "";

        let fullText = `Contact Name: ${contactName}\n`;
        fullText += `Contact Number: ${contactNumber}\n`;
        fullText += `System Type: ${systemType}\n`;
        fullText += `Dial-In Type: ${dialInType}\n`;
        fullText += `Dial-In Fee: ${dialInFee}\n`;
        if (dialInFee != "Waived") {
          fullText += `Billing: ${billing}\n`;
        }
        fullText += `ERP Account (SAP): ${SAP}\n`;
        if (dialInFee != "Waived") {
          fullText += `Credit Hold: ${creditHold}\n`;
        }
        if (dialInFee === "Waived") {
          fullText += `Under Warranty?: ${underWarranty}\n`;
        }
        if (systemType === "HT22X") {
          fullText += `Battery Check: ${batteryCheck}\n`;
          fullText += `Lithium Battery: ${lithiumBattery}\n`;
          fullText += `Modem Type: ${modemType}\n`;
        }
        if (dialInFee === "Waived") {
          fullText += `Waived Fee Reason:\n${reasonWaived}\n`;
        }
        navigator.clipboard
          .writeText(fullText)
          .then(() => {
            showNotification();
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
          });
      } else {
        // If form is invalid, show validation error
        applyValidationStyles(dialInForm);
      }
    });
  }

  const copyButton = document.getElementById("copyButton");
  const customerSupportForm = document.getElementById("contactForm"); // Assuming the form has an id
  if (copyButton && customerSupportForm) {
    copyButton.addEventListener("click", function () {
      clearValidationStyles(customerSupportForm); // Clear previous validation styles
      const selectElements = customerSupportForm.querySelectorAll("select");
      let formIsValid = true;

      // Validate "None" selections
      selectElements.forEach((select) => {
        if (select.value === "Not Selected") {
          select.classList.add("invalid-field");
          formIsValid = false;
        } else {
          select.classList.remove("invalid-field");
        }
      });

      if (customerSupportForm.checkValidity() && formIsValid) {
        const customerName =
          document.getElementById("customerName")?.value || "";
        const reasonForCall =
          document.getElementById("reasonForCall")?.value || "";
        const fdsStatus = document.getElementById("fdsStatus")?.value || "";
        const troubleshooting =
          document.getElementById("troubleshooting")?.value || "";
        const resolution = document.getElementById("resolution")?.value || "";

        let fullText = `S/W:\n${customerName.trim()}\n\n`;
        fullText += `Reason for Call:\n${reasonForCall.trim()}\n\n`;
        fullText += `Troubleshooting Performed:\n${troubleshooting.trim()}\n\n`;
        fullText += `Resolution or Next Steps:\n${resolution.trim()}\n\n`;
        fullText += `FDS Status at End-of-Call:\n${fdsStatus}`;

        navigator.clipboard
          .writeText(fullText)
          .then(() => {
            showNotification();
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
          });
      } else {
        applyValidationStyles(customerSupportForm); // Apply validation styles
      }
    });
  }

  const copyButtonRMA = document.getElementById("copyButtonRMA");
  const rmaForm = document.getElementById("rmaForm");
  if (copyButtonRMA && rmaForm) {
    copyButtonRMA.addEventListener("click", function () {
      clearValidationStyles(rmaForm); // Clear previous validation styles
      const selectElements = rmaForm.querySelectorAll("select");
      let formIsValid = true;

      // Validate "None" selections
      selectElements.forEach((select) => {
        if (!isElementOrParentHidden(select)) {
          if (select.value === "Not Selected") {
            select.classList.add("invalid-field");
            formIsValid = false;
          } else {
            select.classList.remove("invalid-field");
          }
        }
      });

      if (rmaForm.checkValidity() && formIsValid) {
        const rmaType = document.getElementById("rmaType")?.value || "";
        const failureReason =
          document.getElementById("failureReason")?.value || "";
        const redDot = document.getElementById("redDot")?.value || "";
        const shippingType =
          document.getElementById("shippingType")?.value || "";
        const callTag = document.getElementById("callTag")?.value || "";
        const warrantyField = document.getElementById("warranty")?.value || "";
        const inspectionChecked = document.getElementById("inspectionCheckbox")
          ?.checked
          ? "Yes"
          : "No";

        const orderNumber = document.getElementById("order")?.value || "";
        const warrantyLevel =
          document.getElementById("warrantyLevel")?.value || "";
        const addButton = document.getElementById("addButton");

        const partNumbers = document.querySelectorAll(
          'input[name="partNumber[]"]'
        );
        const quantities = document.querySelectorAll(
          'input[name="quantity[]"]'
        );

        if (partNumbers.length > 0 && quantities.length > 0) {
          addButton.classList.remove("invalid-field");
          let fullText = `RMA Type: ${rmaType}`;
          if (inspectionChecked === "Yes") {
            if (
              rmaType === "Warranty ADV Replace" ||
              rmaType === "Paid Repair - HT22X / Safe-XPP Only"
            ) {
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
          fullText += `\nFailure Reason: ${failureReason.trim()}`;
          fullText += `\nShipping Method: ${shippingType}`;
          fullText += `\nRed Dot: ${redDot}`;
          fullText += `\nCall Tag: ${callTag}`;

          fullText += `\n\nParts List:\n`;
          partNumbers.forEach((partNumberInput, index) => {
            const partNumber = partNumberInput.value || "N/A";
            const quantity = quantities[index]?.value || "N/A";
            fullText += `Part Number: ${partNumber.trim()}, Quantity: ${quantity.trim()}\n`;
          });

          navigator.clipboard
            .writeText(fullText)
            .then(() => {
              showNotification();
            })
            .catch((err) => {
              console.error("Failed to copy: ", err);
            });
        } else {
          addButton.classList.add("invalid-field");
        }
      } else {
        applyValidationStyles(rmaForm); // Apply validation styles
      }
    });
  }

  const rmaFormLoaded = document.getElementById("rmaType");
  if (rmaFormLoaded) {
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
  }

  const dialInFormLoaded = document.getElementById("dialInForm");
  if (dialInFormLoaded) {
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
  }

  const triageFormLoaded = document.getElementById("triageForm");
  if (triageFormLoaded) {
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
  }

  // Apply the auto-resize behavior on input event
  document.querySelectorAll("textarea").forEach((textarea) => {
    // Automatically resize on input
    textarea.addEventListener("input", function () {
      autoResizeTextarea(this); // Auto-adjust height as the user types
    });

    // Detect user resize
    textarea.addEventListener("mousedown", function (e) {
      // Detect if the user is resizing the textarea manually (bottom-right corner click)
      const initialHeight = textarea.offsetHeight;
      const initialY = e.clientY;

      const onMouseMove = (moveEvent) => {
        const newHeight = initialHeight + (moveEvent.clientY - initialY);
        if (newHeight !== textarea.scrollHeight) {
          textarea.dataset.userResized = "true"; // Mark as user-resized
          autoResizeTextarea(textarea);
        }
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });

    let clickCount = 0;
    let clickTimer;

    textarea.addEventListener("click", function (event) {
      clickCount++;

      if (clickCount === 1) {
        // Start a timer to reset click count after a short period
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, 600); // Adjust the timeout duration as needed (500ms is typical for triple-click detection)
      }

      if (clickCount === 4) {
        textarea.dataset.userResized = ""; // Reset the user-resized state
        autoResizeTextarea(textarea); // Reapply automatic resizing
        // Reset click count and clear the timer
        clearTimeout(clickTimer);
        clickCount = 0;
      }
    });
  });

  // Elements
  const colorModal = document.getElementById("color-selector-modal");
  const openColorSelector = document.getElementById("open-color-selector");
  const colorPicker = document.getElementById("highlight-color-picker");
  const colorPreviewBox = document.getElementById("color-preview-box");
  const applyColorButton = document.getElementById("apply-color");
  const resetColorButton = document.getElementById("reset-color");

  // CSS Variable for highlights
  document.documentElement.style.setProperty("--highlight-color", "#da5fff");

  // Open the color selector modal
  openColorSelector.addEventListener("click", () => {
    colorModal.classList.toggle("hidden");
  });

  // Update the preview box when color changes
  colorPicker.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    colorPreviewBox.style.backgroundColor = selectedColor;
  });

  // Apply the selected color
  applyColorButton.addEventListener("click", () => {
    const selectedColor = colorPicker.value;
    localStorage.setItem("highlightColor", selectedColor); // Save color
    document.documentElement.style.setProperty(
      "--highlight-color",
      selectedColor
    );
    colorModal.classList.add("hidden");
  });

  // Reset to default color
  resetColorButton.addEventListener("click", () => {
    const defaultColor = "#da5fff";
    localStorage.setItem("highlightColor", defaultColor); // Save color
    document.documentElement.style.setProperty(
      "--highlight-color",
      defaultColor
    );
    colorPicker.value = defaultColor;
    colorPreviewBox.style.backgroundColor = defaultColor;
  });

  // Load saved color on page load
  const savedColor = localStorage.getItem("highlightColor");
  if (savedColor) {
    document.documentElement.style.setProperty("--highlight-color", savedColor);
    colorPicker.value = savedColor;
    colorPreviewBox.style.backgroundColor = savedColor;
  }

  // Call both functions on page load
  populateFormData();
  saveFormData();
}); // End of DOM

// Function to automatically adjust textarea height
function autoResizeTextarea(textarea) {
  // Only auto-resize if the user hasn't manually resized the textarea
  if (!textarea.dataset.userResized) {
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = textarea.scrollHeight + "px"; // Set new height based on content
  }
  localStorage.setItem(`textareaHeight-${textarea.id}`, textarea.style.height); // Save the height
}

// Function to initialize textarea height from storage
function initializeTextareaHeight(textarea) {
  const savedHeight = localStorage.getItem(`textareaHeight-${textarea.id}`);
  if (savedHeight) {
    textarea.style.height = savedHeight; // Restore the height from localStorage
  }
}

// Initialize the textarea height on page load
window.onload = function () {
  const textareaElements = document.querySelectorAll("textarea");
  textareaElements.forEach((element) => {
    initializeTextareaHeight(element);
  });
};
