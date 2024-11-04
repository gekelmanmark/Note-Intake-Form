document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop(); // Get the current page name
    const navLinks = document.querySelectorAll('.nav-link');

    // Save form data to local storage on every input change
    const saveFormData = () => {
        const formElements = document.querySelectorAll('input, textarea, select');
        formElements.forEach((element) => {
            element.addEventListener('input', () => {
                if (element.type === 'checkbox') {
                    localStorage.setItem(element.id, element.checked);
                } else {
                    localStorage.setItem(element.id, element.value);
                }
            });
        });
    };

    // Clear local storage when form is reset
    const clearFormData = () => {
        const formElements = document.querySelectorAll('input, textarea, select');
        formElements.forEach((element) => {
            localStorage.removeItem(element.id);
        });
    };

    // Retrieve form data from local storage and populate the fields
    const populateFormData = () => {
        const formElements = document.querySelectorAll('input, textarea, select');
        formElements.forEach((element) => {
            const savedValue = localStorage.getItem(element.id);
            if (savedValue !== null) {
                if (element.type === 'checkbox') {
                    element.checked = (savedValue === 'true'); // Convert string back to boolean
                } else {
                    element.value = savedValue;
                }
            }
            // const savedData = localStorage.getItem(element.id);
            // if (savedData) {
            //     element.value = savedData;
            // }
        });
        // Retrieve the saved RMA type and trigger the display logic
        const savedRmaType = localStorage.getItem('rmaType');
        if (savedRmaType) {
            document.getElementById('rmaType').value = savedRmaType;
            handleRmaTypeChange(savedRmaType); // Call the function to show/hide fields
        }

        // Load saved parts data
        const savedPartsData = JSON.parse(localStorage.getItem('partsData')) || [];
        savedPartsData.forEach(part => {
            if (part.partNumber || part.quantity){
                const formRow = document.createElement('div');
                formRow.classList.add('form-row');
    
                const partNumberInput = document.createElement('input');
                partNumberInput.type = 'text';
                partNumberInput.name = 'partNumber[]';
                partNumberInput.placeholder = 'Part Number';
                partNumberInput.value = part.partNumber;
                partNumberInput.required = true;
                partNumberInput.addEventListener('input', savePartsToLocalStorage);
    
                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.name = 'quantity[]';
                quantityInput.placeholder = 'Quantity';
                quantityInput.value = part.quantity;
                quantityInput.required = true;
                quantityInput.addEventListener('input', savePartsToLocalStorage);
    
                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.classList.add('remove-button');
                removeButton.innerText = 'Remove';
                removeButton.addEventListener('click', function () {
                    formRow.remove();
                    savePartsToLocalStorage();
                });
    
                if (isDarkModeActive()) {
                    partNumberInput.classList.add('dark-mode');
                    quantityInput.classList.add('dark-mode');
                    removeButton.classList.add('dark-mode');
                }
    
                formRow.appendChild(partNumberInput);
                formRow.appendChild(quantityInput);
                formRow.appendChild(removeButton);
                document.getElementById('dynamicForm').appendChild(formRow);
            }
        });
    };

    // Function to show or hide fields based on RMA Type
    const handleRmaTypeChange = (rmaType) => {
        const inspectionField = document.getElementById('inspectionField');
        const warrantyField = document.getElementById('warrantyField');
        const warranty = document.getElementById('warranty');
        const bsoField = document.getElementById('bsoField');
        const warrantyLevelField = document.getElementById('warrantyLevelField');

        // Display fields based on selected RMA type
        if (rmaType === 'Paid Repair - HT22X / Safe-XPP Only') {
            inspectionField.classList.remove('hidden');
            warrantyField.classList.add('hidden');
            bsoField.classList.add('hidden');
            warrantyLevelField.classList.add('hidden');
        } else if (rmaType === 'Warranty ADV Replace') {
            if (warranty.value === 'Limited') {
                inspectionField.classList.remove('hidden');
                warrantyField.classList.remove('hidden');
                bsoField.classList.remove('hidden');
                warrantyLevelField.classList.add('hidden');
            } else if (warranty.value === 'Extended') {
                inspectionField.classList.remove('hidden');
                warrantyField.classList.remove('hidden');
                bsoField.classList.add('hidden');
                warrantyLevelField.classList.remove('hidden');
            } else {
                inspectionField.classList.remove('hidden');
                warrantyField.classList.remove('hidden');
                bsoField.classList.add('hidden');
                warrantyLevelField.classList.add('hidden');
            }
            warranty.addEventListener('change', function () {
                if (warranty.value === 'Limited') {
                    bsoField?.classList.remove('hidden');
                    warrantyLevelField?.classList.add('hidden');
                } else if (warranty.value === 'Extended') {
                    bsoField?.classList.add('hidden');
                    warrantyLevelField?.classList.remove('hidden');
                }
                else {
                    bsoField?.classList.add('hidden');
                    warrantyLevelField?.classList.add('hidden');
                }
            });
        } else {
            // Hide all conditional fields for other RMA types
            inspectionField.classList.add('hidden');
            warrantyField.classList.add('hidden');
            bsoField.classList.add('hidden');
            warrantyLevelField.classList.add('hidden');
        }
    };

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active'); // Add 'active' class to the current page's link
        }
    });

    // Function to show the notification after copying
    function showNotification() {
        const notification = document.getElementById('copyNotification');
        if (notification) {
            notification.classList.remove('hidden'); // Ensure it's visible
            notification.classList.add('show'); // Trigger the animation

            setTimeout(() => {
                notification.classList.remove('show'); // Hide after 3 seconds
            }, 3000);
        }
    }

    // Function to apply custom styles to invalid fields
    function applyValidationStyles(form) {
        const formElements = form.querySelectorAll('input, textarea, select');
        formElements.forEach((element) => {
            if (!element.checkValidity() || (element.tagName === 'SELECT' && element.value === 'Not Selected')) {
                // Skip elements that are hidden or have hidden parents
                if (!isElementOrParentHidden(element)) {
                    element.classList.add('invalid-field'); // Add a custom invalid class to highlight
                }
            }
        });
    }

    // Function to clear custom validation styles
    function clearValidationStyles(form) {
        const formElements = form.querySelectorAll('.invalid-field');
        formElements.forEach((element) => {
            element.classList.remove('invalid-field'); // Remove the custom invalid class
        });
    }

    function isElementOrParentHidden(element) {
        let parent = element.parentElement;
        while (parent) {
            if (parent.hasAttribute('hidden') || parent.classList.contains('hidden')) {
                return true; // If any parent element has the hidden attribute or 'hidden' class
            }
            parent = parent.parentElement;
        }
        return element.hasAttribute('hidden') || element.classList.contains('hidden') || element.disabled; // Also check the element itself
    }

    // Dark Mode Toggle Function
    const toggleButton = document.getElementById('toggle-mode');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            toggleDarkModeClasses();
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('mode', isDarkMode ? 'dark' : 'light');
        });

        // Function to toggle dark mode classes
        function toggleDarkModeClasses() {
            document.body.classList.toggle('dark-mode');
            const elementsToToggle = [
                document.querySelector('.container'),
                document.querySelector('h1'),
                ...document.querySelectorAll('textarea'),
                ...document.querySelectorAll('select'),
                ...document.querySelectorAll('input'),
                ...document.querySelectorAll('option'),
                ...document.querySelectorAll('nav'),
                ...document.querySelectorAll('button')
            ];

            elementsToToggle.forEach(el => {
                if (el) el.classList.toggle('dark-mode');
            });
        }


        // Apply saved dark mode from localStorage
        const currentMode = localStorage.getItem('mode') || 'light';
        if (currentMode === 'dark') {
            toggleDarkModeClasses();
        }
    }

    // Function to check if dark mode is active
    function isDarkModeActive() {
        return document.body.classList.contains('dark-mode');
    }

    // Add more parts (Part Number and Quantity) functionality
    const addButton = document.getElementById('addButton');
    if (addButton) {
        addButton.addEventListener('click', function () {
            // Create a new form row
            const formRow = document.createElement('div');
            formRow.classList.add('form-row');

            // Create the part number input
            const partNumberInput = document.createElement('input');
            partNumberInput.type = 'text';
            partNumberInput.name = 'partNumber[]';
            partNumberInput.placeholder = 'Part Number';
            partNumberInput.required = true;

            // Create the quantity input
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.name = 'quantity[]';
            quantityInput.placeholder = 'Quantity';
            quantityInput.required = true;

            // Add event listeners to save part data to local storage on change
            partNumberInput.addEventListener('input', savePartsToLocalStorage);
            quantityInput.addEventListener('input', savePartsToLocalStorage);

            // Create the remove button
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.classList.add('remove-button');
            removeButton.innerText = 'Remove';
            removeButton.addEventListener('click', function () {
                formRow.remove(); // Remove the row on click
                savePartsToLocalStorage(); // Save updated data after removal
            });

            // Check if dark mode is active and apply the dark-mode class to newly created elements
            if (isDarkModeActive()) {
                partNumberInput.classList.add('dark-mode');
                quantityInput.classList.add('dark-mode');
                removeButton.classList.add('dark-mode');
            }

            // Append inputs and remove button to the row
            formRow.appendChild(partNumberInput);
            formRow.appendChild(quantityInput);
            formRow.appendChild(removeButton);

            // Append the new row to the dynamic form section
            document.getElementById('dynamicForm').appendChild(formRow);
        });
    }

    function savePartsToLocalStorage() {
        const partsData = [];
        document.querySelectorAll('.form-row').forEach(row => {
            const partNumber = row.querySelector('input[name="partNumber[]"]').value;
            const quantity = row.querySelector('input[name="quantity[]"]').value;
            partsData.push({ partNumber, quantity });
        });
        localStorage.setItem('partsData', JSON.stringify(partsData));
    }

    // Clear buttons for forms
    const clearButton = document.getElementById('clearButton');
    if (clearButton) {
        clearButton.addEventListener('click', function () {
            const forms = ['contactForm', 'dialInForm', 'rmaForm', 'product99'];
            forms.forEach(formId => {
                const form = document.getElementById(formId);
                if (form) {
                    if (form.id === 'rmaForm') {
                        handleRmaTypeChange('Not Selected'); // Call the function to show/hide fields
                    }
                    form.reset();
                    savePartsToLocalStorage();
                }
            });
        });
        clearButton.addEventListener('click', clearFormData);
    }

    const copyButton99 = document.getElementById('copyButton99');
    const product99Form = document.getElementById('product99');
    if (copyButton99 && product99Form) {
        copyButton99.addEventListener('click', function () {
            clearValidationStyles(product99Form);
            const selectElements = document.querySelectorAll('select');
            let formIsValid = true;

            // Loop through all the select elements and check if "None" is selected
            selectElements.forEach(select => {
                if (select.value === 'Not Selected') {
                    select.classList.add('invalid-field'); // Highlight the field with red
                    formIsValid = false;
                } else {
                    select.classList.remove('invalid-field'); // Remove red highlight if valid
                }
            });

            if (product99Form.checkValidity() && formIsValid) {
                const reportDate = document.getElementById('reportDate')?.value || '';
                const incidentDate = document.getElementById('incidentDate')?.value || '';
                const contactName = document.getElementById('contactName')?.value || '';
                const contactNumber = document.getElementById('contactNumber')?.value || '';
                const email = document.getElementById('email')?.value || '';
                const productType = document.getElementById('productType')?.value || '';
                const lockCaseType = document.getElementById('lockCaseType')?.value || '';
                const numberOfRoomsInHotel = document.getElementById('numberOfRoomsInHotel')?.value || '';
                const warrantyStartDate = document.getElementById('warrantyStartDate')?.value || '';
                const accountNumber = document.getElementById('accountNumber')?.value || '';
                const caseNumber = document.getElementById('caseNumber')?.value || '';
                const propertyName = document.getElementById('propertyName')?.value || '';
                const propertyAddress = document.getElementById('propertyAddress')?.value || '';
                const summary = document.getElementById('summary')?.value || '';

                const fullText = `Report Date: ${reportDate}\n
Incident Date: ${incidentDate}\n
Contact Name: ${contactName}\n
Contact Number: ${contactNumber}\n
Email Address: ${email}\n\n
Product Type: ${productType}\n
Lock Case Type: ${lockCaseType}\n
Number of Rooms in Hotel: ${numberOfRoomsInHotel}\n
Warranty Start Date: ${warrantyStartDate}\n
Account Number: ${accountNumber}\n
Case Number: ${caseNumber}\n\n
Property Name: ${propertyName}\n
Property Address: ${propertyAddress}\n\n
Summary:\n${summary.trim()}`;

                navigator.clipboard.writeText(fullText).then(() => {
                    showNotification();
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            } else {
                // If form is invalid, show validation error
                applyValidationStyles(product99Form);
            }
        });
    }

    // Copy button for Dial-In page
    const copyButtonDialIn = document.getElementById('copyButtonDialIn');
    const dialInForm = document.getElementById('dialInForm');
    if (copyButtonDialIn && dialInForm) {
        copyButtonDialIn.addEventListener('click', function () {
            clearValidationStyles(dialInForm);
            const selectElements = document.querySelectorAll('select');
            let formIsValid = true;

            // Loop through all the select elements and check if "None" is selected
            selectElements.forEach(select => {
                if (select.value === 'Not Selected') {
                    select.classList.add('invalid-field'); // Highlight the field with red
                    formIsValid = false;
                } else {
                    select.classList.remove('invalid-field'); // Remove red highlight if valid
                }
            });
            if (dialInForm.checkValidity() && formIsValid) {

                const contactName = document.getElementById('contactName')?.value || '';
                const contactNumber = document.getElementById('contactNumber')?.value || '';
                const systemType = document.getElementById('systemType')?.value || '';
                const underWarranty = document.getElementById('underWarranty')?.value || '';
                const dialInType = document.getElementById('dialInType')?.value || '';
                const oracleID = document.getElementById('oracleID')?.value || '';
                const dialInFee = document.getElementById('dialInFee')?.value || '';
                const creditHold = document.getElementById('creditHold')?.value || '';
                const batteryCheck = document.getElementById('batteryCheck')?.value || '';
                const lithiumBattery = document.getElementById('lithiumBattery')?.value || '';
                const modemType = document.getElementById('modemType')?.value || '';
                const billing = document.getElementById('billing')?.value || '';

                const fullText = `Contact Name: ${contactName}
Contact Number: ${contactNumber}
System Type: ${systemType}
Under Warranty?: ${underWarranty}
Dial-In Type: ${dialInType}
Oracle ID: ${oracleID}
Dial-In Fee: ${dialInFee}
Credit Hold: ${creditHold}
Battery Check: ${batteryCheck}
Lithium Battery: ${lithiumBattery}
Modem Type: ${modemType}
Billing: ${billing}`;

                navigator.clipboard.writeText(fullText).then(() => {
                    showNotification();
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            } else {
                // If form is invalid, show validation error
                applyValidationStyles(dialInForm);
            }
        });
    }

    const copyButton = document.getElementById('copyButton');
    const customerSupportForm = document.getElementById('contactForm'); // Assuming the form has an id
    if (copyButton && customerSupportForm) {
        copyButton.addEventListener('click', function () {
            clearValidationStyles(customerSupportForm); // Clear previous validation styles
            const selectElements = customerSupportForm.querySelectorAll('select');
            let formIsValid = true;

            // Validate "None" selections
            selectElements.forEach(select => {
                if (select.value === 'Not Selected') {
                    select.classList.add('invalid-field');
                    formIsValid = false;
                } else {
                    select.classList.remove('invalid-field');
                }
            });

            if (customerSupportForm.checkValidity() && formIsValid) {
                const customerName = document.getElementById('customerName')?.value || '';
                const reasonForCall = document.getElementById('reasonForCall')?.value || '';
                const troubleshooting = document.getElementById('troubleshooting')?.value || '';
                const resolution = document.getElementById('resolution')?.value || '';

                const fullText = `S/W:\n${customerName.trim()}\n
Reason for Call:\n${reasonForCall.trim()}\n
Troubleshooting Performed:\n${troubleshooting.trim()}\n
Resolution or Next Steps:\n${resolution.trim()}`;

                navigator.clipboard.writeText(fullText).then(() => {
                    showNotification();
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            } else {
                applyValidationStyles(customerSupportForm); // Apply validation styles
            }
        });
    }

    // RMA Type: Show or hide fields based on the selected RMA type
    const rmaTypeField = document.getElementById('rmaType');
    const warrantyField = document.getElementById('warrantyField');
    const warranty = document.getElementById('warranty');
    const inspectionField = document.getElementById('inspectionField');
    const bsoField = document.getElementById('bsoField');
    const warrantyLevelField = document.getElementById('warrantyLevelField');
    if (rmaTypeField) {
        rmaTypeField.addEventListener('change', function () {
            const selectedRMAType = rmaTypeField.value || '';
            if (selectedRMAType === 'Paid Repair - HT22X / Safe-XPP Only') {
                inspectionField?.classList.remove('hidden');
                warrantyField?.classList.add('hidden');
                bsoField?.classList.add('hidden');
                warrantyLevelField?.classList.add('hidden');
            } else if (selectedRMAType === 'Warranty ADV Replace') {
                inspectionField?.classList.remove('hidden');
                warrantyField?.classList.remove('hidden');
                warranty.addEventListener('change', function () {
                    if (warranty.value === 'Limited') {
                        bsoField?.classList.remove('hidden');
                        warrantyLevelField?.classList.add('hidden');
                    } else if (warranty.value === 'Extended') {
                        bsoField?.classList.add('hidden');
                        warrantyLevelField?.classList.remove('hidden');
                    }
                    else {
                        bsoField?.classList.add('hidden');
                        warrantyLevelField?.classList.add('hidden');
                    }
                });
            } else if (selectedRMAType === 'Concession ADV Replace') {
                inspectionField?.classList.remove('hidden');
                warrantyField?.classList.add('hidden');
                bsoField?.classList.add('hidden');
                warrantyLevelField?.classList.add('hidden');
            } else {
                inspectionField?.classList.add('hidden');
                warrantyField?.classList.add('hidden');
                bsoField?.classList.add('hidden');
                warrantyLevelField?.classList.add('hidden');
            }
        });
    }

    const copyButtonRMA = document.getElementById('copyButtonRMA');
    const rmaForm = document.getElementById('rmaForm');
    if (copyButtonRMA && rmaForm) {
        copyButtonRMA.addEventListener('click', function () {
            clearValidationStyles(rmaForm); // Clear previous validation styles
            const selectElements = rmaForm.querySelectorAll('select');
            let formIsValid = true;

            // Validate "None" selections
            selectElements.forEach(select => {
                if (!isElementOrParentHidden(select)) {
                    if (select.value === 'Not Selected') {
                        select.classList.add('invalid-field');
                        formIsValid = false;
                    } else {
                        select.classList.remove('invalid-field');
                    }
                }
            });

            if (rmaForm.checkValidity() && formIsValid) {
                const rmaType = document.getElementById('rmaType')?.value || '';
                const failureReason = document.getElementById('failureReason')?.value || '';
                const redDot = document.getElementById('redDot')?.value || '';
                const shippingType = document.getElementById('shippingType')?.value || '';
                const callTag = document.getElementById('callTag')?.value || '';
                const warrantyField = document.getElementById('warranty')?.value || '';
                const inspectionChecked = document.getElementById('inspectionCheckbox')?.checked ? 'Yes' : 'No';

                const bsoNumber = document.getElementById('bso')?.value || '';
                const warrantyLevel = document.getElementById('warrantyLevel')?.value || '';

                let fullText = `RMA Type: ${rmaType}\n`;
                if (inspectionChecked === "Yes") {
                    fullText += ` **08 Inspection Requested**\n`;
                }
                fullText += `Warranty: ${warrantyField}`
                if (warrantyField === 'Limited') {
                    fullText += `\nWarranty Limited BSO: ${bsoNumber}`;
                } else if (warrantyField === 'Extended') {
                    fullText += `\nWarranty Extended Level: ${warrantyLevel}`;
                }
                fullText += `\nFailure Reason: ${failureReason.trim()}
Red Dot: ${redDot}
Shipping Type: ${shippingType}
Call Tag: ${callTag}`;

                const partNumbers = document.querySelectorAll('input[name="partNumber[]"]');
                const quantities = document.querySelectorAll('input[name="quantity[]"]');

                if (partNumbers.length > 0 && quantities.length > 0) {
                    fullText += `\n\nParts List:\n`;
                    partNumbers.forEach((partNumberInput, index) => {
                        const partNumber = partNumberInput.value || 'N/A';
                        const quantity = quantities[index]?.value || 'N/A';
                        fullText += `Part Number: ${partNumber}, Quantity: ${quantity}\n`;
                    });
                }

                navigator.clipboard.writeText(fullText).then(() => {
                    showNotification();
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            } else {
                applyValidationStyles(rmaForm); // Apply validation styles
            }
        });
    }

    // Call both functions on page load
    populateFormData();
    saveFormData();
}); // End of DOM

// Function to automatically adjust textarea height
function autoResizeTextarea(textarea) {
    // Only auto-resize if the user hasn't manually resized the textarea
    if (!textarea.dataset.userResized) {
        textarea.style.height = 'auto'; // Reset the height
        textarea.style.height = textarea.scrollHeight + 'px'; // Set new height based on content
    }
}

// Apply the auto-resize behavior on input event
document.querySelectorAll('textarea').forEach(textarea => {
    // Automatically resize on input
    textarea.addEventListener('input', function () {
        autoResizeTextarea(this); // Auto-adjust height as the user types
    });

    // Detect user resize
    textarea.addEventListener('mousedown', function (e) {
        // Detect if the user is resizing the textarea manually (bottom-right corner click)
        const initialHeight = textarea.offsetHeight;
        const initialY = e.clientY;

        const onMouseMove = (moveEvent) => {
            const newHeight = initialHeight + (moveEvent.clientY - initialY);
            if (newHeight !== textarea.scrollHeight) {
                textarea.dataset.userResized = 'true'; // Mark as user-resized
            }
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    });

    let clickCount = 0;
    let clickTimer;

    textarea.addEventListener('click', function (event) {
        clickCount++;

        if (clickCount === 1) {
            // Start a timer to reset click count after a short period
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 600); // Adjust the timeout duration as needed (500ms is typical for triple-click detection)
        }

        if (clickCount === 4) {

            textarea.dataset.userResized = ''; // Reset the user-resized state
            autoResizeTextarea(textarea); // Reapply automatic resizing
            // Reset click count and clear the timer
            clearTimeout(clickTimer);
            clickCount = 0;
        }
    });
});


