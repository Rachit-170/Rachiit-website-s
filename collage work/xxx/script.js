// Get the canvas element
const canvas = document.getElementById('canvas');

// Add event listener for clicks on the canvas
canvas.addEventListener('click', function(event) {
    // Get the click position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // X position
    const y = event.clientY - rect.top;  // Y position
    
    // Create a new editable element at the clicked position
    const newElement = document.createElement('div');
    newElement.className = 'editable-element';
    newElement.contentEditable = true; // Make it editable
    newElement.style.left = `${x}px`;  // Set left position
    newElement.style.top = `${y}px`;   // Set top position
    newElement.textContent = 'Edit me'; // Default text
    
    canvas.appendChild(newElement); // Add to canvas
    
    // Focus on the new element for immediate editing
    newElement.focus();
    
    // Make the element draggable
    makeDraggable(newElement);
});

// Function to handle pasting
canvas.addEventListener('paste', function(event) {
    event.preventDefault(); // Prevent default paste behavior
    const text = event.clipboardData.getData('text/plain'); // Get pasted text
    const activeElement = document.activeElement; // Get the focused element
    
    if (activeElement && activeElement.contentEditable === 'true') {
        // Insert pasted text into the focused editable element
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        selection.deleteFromDocument(); // Delete selected text
        selection.getRangeAt(0).insertNode(document.createTextNode(text)); // Insert pasted text
    } else {
        // If no element is focused, create a new one with the pasted content
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const newElement = document.createElement('div');
        newElement.className = 'editable-element';
        newElement.contentEditable = true;
        newElement.style.left = `${x}px`;
        newElement.style.top = `${y}px`;
        newElement.textContent = text; // Set pasted text
        
        canvas.appendChild(newElement);
        makeDraggable(newElement);
        newElement.focus();
    }
});

// Function to make an element draggable
function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;
    
    element.addEventListener('mousedown', function(event) {
        isDragging = true;
        offsetX = event.clientX - element.offsetLeft; // Calculate offset
        offsetY = event.clientY - element.offsetTop;
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    
    function onMouseMove(event) {
        if (!isDragging) return;
        event.preventDefault(); // Prevent text selection
        
        // Update element position
        const x = event.clientX - offsetX;
        const y = event.clientY - offsetY;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    }
    
    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}