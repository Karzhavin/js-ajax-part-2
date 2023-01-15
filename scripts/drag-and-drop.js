/* Drag and Drop Interface
   ========================================================================== */

const dragBox = document.getElementById('drag-box');
const targetView = document.getElementById('target-view');

/* Color Generator
   ========================================================================== */

/**
 * 1. Function to Generate Random Number
 */

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

/**
 * 2. Function to Generate Random Color
 */

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

/* Define a Drag Element
   ========================================================================== */

function dragStartHandler(event) {
    // event.dataTransfer.dropEffect = 'copy';
    event.currentTarget.style.border = 'dashed';
    event.dataTransfer.setData('text/plain', event.target.id);
    // event.effectAllowed = 'copyMove';
}

dragBox.addEventListener('dragstart', dragStartHandler);

function dragEndHandler(ev) {
    ev.target.style.border = 'solid black';
    ev.dataTransfer.clearData();
}

/* Define a Drop Zone
   ========================================================================== */

function dragOverHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    event.currentTarget.style.background = 'lightblue';
}

function dropHandler(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const nodeCopy = document.getElementById(data).cloneNode(true);
    nodeCopy.id = 'box-1';
    event.target.appendChild(nodeCopy);
}
