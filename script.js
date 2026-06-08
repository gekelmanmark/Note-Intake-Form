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
    // Skip elements that won't be validated by the browser (e.g., disabled, type="hidden")
    if (!element.willValidate) return;

    // Determine requirement (consider ARIA too if you use it)
    const isRequired =
      element.required || element.getAttribute("aria-required") === "true";

    // Handle "empty" consistently across inputs and selects
    const isSelect = element.tagName === "SELECT";
    const isEmpty =
      (isSelect &&
        (element.selectedIndex === -1 ||
          element.value === "" ||
          element.value === "Not Selected")) ||
      (!isSelect && element.value === "");

    // Optional fields should be styled only if they have a value and are invalid
    const shouldConsider = isRequired || (!isRequired && !isEmpty); // required OR (optional but user entered something)

    // Browser validity + your custom "Not Selected" placeholder rule for <select>
    const isInvalid =
      !element.validity.valid ||
      (isSelect && element.value === "Not Selected");

    // Only apply styles if we decided to consider the field AND it’s invalid AND it’s visible
    if (shouldConsider && isInvalid && !isElementOrParentHidden(element)) {
      element.classList.add("invalid-field");
    } else {
      // Always clear the class if it no longer applies
      element.classList.remove("invalid-field");
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


// Expand Border
const expandButton = document.getElementById("toggle-border");
if (expandButton) {
  expandButton.addEventListener("click", () => {
    toggleExpandModeClasses();
    const isExpanded = document.body.classList.contains("expand-mode");
    localStorage.setItem("expandmode", isExpanded ? "expanded" : "normal");
  });

  // Function to toggle dark mode classes
  function toggleExpandModeClasses() {
    document.body.classList.toggle("expand-mode");
    const elementsToToggle = [
      document.querySelector(".container"),
      document.querySelector(".navbar"),
      document.querySelector("header"),
    ];

    elementsToToggle.forEach((el) => {
      if (el) el.classList.toggle("expand-mode");
    });

    var icon = document.getElementById("toggle-border").getElementsByClassName('material-icons')[0]
    icon.innerHTML = document.body.classList.contains('expand-mode') ? 'fullscreen_exit' : 'fullscreen'
  }

  // Apply saved dark mode from localStorage
  const expandMode = localStorage.getItem("expandmode") || "normal";
  if (expandMode === "expanded") {
    toggleExpandModeClasses();
  }
}


const copyButton = document.getElementById("copyButton");
const templateForm = document.getElementById("templateForm");
copyButton.addEventListener("click", function () {
  clearValidationStyles(templateForm); // Clear previous validation styles
  const selectElements = templateForm.querySelectorAll("select");
  let formIsValid = true;

  // Validate "None" selections
  selectElements.forEach((select) => {
    if (select.value === "Not Selected" && !isElementOrParentHidden(select)) {
      select.classList.add("invalid-field"); // Highlight the field with red
      formIsValid = false;
    } else {
      select.classList.remove("invalid-field"); // Remove red highlight if valid
    }
  });

  if (templateForm.checkValidity() && formIsValid) {
    // Method declared in html script header, or loaded prior from scripts/ folder
    var fullText = copyPage();
    
    navigator.clipboard
      .writeText(fullText)
      .then(() => {
        showNotification();
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  } else {
    applyValidationStyles(templateForm); // Apply validation styles
  }
});

// Clear buttons for forms
let lastFormState = null; // Variable to store the form's state before clearing
const clearButton = document.getElementById("clearButton");
if (clearButton) {
  clearButton.addEventListener("click", function () {
    // Method declared in html script header, or loaded prior from scripts/ folder
    lastFormState = clearPage({});;

    const form = document.getElementById("templateForm");
    if (form) {
      // Save the current form state before clearing
      const formElements = form.querySelectorAll("input, textarea, select");
      formElements.forEach((element) => {
        lastFormState[element.id] = element.value; // Save field value
      });
      
      form.reset();

      // Hide Undo button if no state is saved
      if (Object.keys(lastFormState).length > 0) {
        undoClearButton.classList.remove("hidden"); // Show "Undo Clear" button
      }
    }

    var formElements = document.querySelectorAll("input, textarea, select");
    formElements.forEach((element) => {
      localStorage.removeItem(element.id);
    });
  });
}

const undoClearButton = document.getElementById("undoClearButton");
if (undoClearButton) {
  undoClearButton.addEventListener("click", function () {
    if (lastFormState) {
      // Method declared in html script header, or loaded prior from scripts/ folder
      undoClear(lastFormState);

      const form = document.getElementById("templateForm");
      if (form) {
        // Restore static form fields
        const formElements = form.querySelectorAll(
          "input, textarea, select",
        );
        
        formElements.forEach((element) => {
          if (lastFormState[element.id] !== undefined) {
            element.value = lastFormState[element.id]; // Restore field value
          }
        });

        // Clear the saved state
        lastFormState = null;
        undoClearButton.classList.add("hidden"); // Hide "Undo Clear" button
      }
    }
  });
}

// Load all form data from storage
const formElements = document.querySelectorAll("input, textarea, select");
formElements.forEach((element) => {
  const savedValue = localStorage.getItem(element.id);

  if (element.type === "checkbox") {
    if (savedValue !== null)
      element.checked = savedValue === "true";
    element.addEventListener("input", () => { localStorage.setItem(element.id, element.checked); })
  } else {
    if (savedValue !== null)
      element.value = savedValue;
    element.addEventListener("input", () => { localStorage.setItem(element.id, element.value); })
  }
});
// Method declared in html script header, or loaded prior from scripts/ folder
// Trigger page template to load any additional values from storage
loadSavedValues();


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
const colorPicker = document.getElementById("highlight-color-picker");
const colorPreviewBox = document.getElementById("color-preview-box");
const applyColorButton = document.getElementById("apply-color");
const resetColorButton = document.getElementById("reset-color");

// CSS Variable for highlights
document.documentElement.style.setProperty("--highlight-color", "#da5fff");

const openSettings = document.getElementById("toggle-settings")
// Open the color selector modal
openSettings.addEventListener("click", () => {
  colorModal.classList.toggle("hidden");
  var icon = openSettings.getElementsByClassName('material-icons')[0]
  icon.innerHTML = colorModal.classList.contains('hidden') ? 'settings' : 'close'
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
    selectedColor,
  );
  colorModal.classList.add("hidden");
});

// Reset to default color
resetColorButton.addEventListener("click", () => {
  const defaultColor = "#da5fff";
  localStorage.setItem("highlightColor", defaultColor); // Save color
  document.documentElement.style.setProperty(
    "--highlight-color",
    defaultColor,
  );
  colorPicker.value = defaultColor;
  colorPreviewBox.style.backgroundColor = defaultColor;
});

// Load saved color on page load
const lastColor = localStorage.getItem("highlightColor");
if (lastColor) {
  document.documentElement.style.setProperty("--highlight-color", lastColor);
  colorPicker.value = lastColor;
  colorPreviewBox.style.backgroundColor = lastColor;
}



// Function to automatically adjust textarea height
function autoResizeTextarea(textarea) {
  // Only auto-resize if the user hasn't manually resized the textarea
  if (!textarea.dataset.userResized) {
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = textarea.scrollHeight + "px"; // Set new height based on content
  }
  localStorage.setItem(`textareaHeight-${textarea.id}`, textarea.style.height); // Save the height
}

// Initialize the textarea height on page load
const textareaElements = document.querySelectorAll("textarea");
textareaElements.forEach((element) => {
  var savedHeight = localStorage.getItem(`textareaHeight-${element.id}`);
  if (savedHeight) {
    element.style.height = savedHeight; // Restore the height from localStorage
  }
});


