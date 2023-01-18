/* Drag and Drop Interface
   ========================================================================== */

const duplicator = document.getElementById('duplicator');
const targetViewGrid = document.getElementById('target-view-grid');
const targetViewFreeLocation = document.getElementById('target-view-free-location');

class CursorOverBox {
    #pageX;
    #pageY;
    constructor(pageX, pageY) {
        this.#pageX = pageX;
        this.#pageY = pageY;
    }

    getCursorPosition() {
        return [this.#pageX, this.#pageY];
    }
}

class Box {
    #color;
    #border;
    constructor(color, border) {
        this.#color = color;
        this.#border = border;
    }

    getBoxData() {
        return [this.#color, this.#border];
    }
}

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
    event.dataTransfer.dropEffect = 'copy';
    const targetBox = event.currentTarget.getBoundingClientRect();
    const cursor = new CursorOverBox(event.pageX - targetBox.left, event.pageY - targetBox.top);
    const box = new Box(randomRGB(), 'dashed');
    event.currentTarget.style.background = box.getBoxData()[0];
    event.currentTarget.style.border = box.getBoxData()[1];
    const transferArray = [cursor.getCursorPosition(), box.getBoxData()];
    event.dataTransfer.setData('text/plain', JSON.stringify(transferArray));
}

duplicator.addEventListener('dragstart', dragStartHandler);

function dragEndHandler(event) {
    event.currentTarget.style.border = 'solid black';
    event.dataTransfer.clearData();
}

duplicator.addEventListener('dragend', dragEndHandler);

/* Define a Drop Zone
   ========================================================================== */

function dragOverHandler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    event.currentTarget.style.background = 'lightblue';
}

targetViewGrid.addEventListener('dragover', dragOverHandler);
targetViewFreeLocation.addEventListener('dragover', dragOverHandler);

function dropHandler(event) {
    const rect = targetViewFreeLocation.getBoundingClientRect();
    event.preventDefault();
    const inputData = JSON.parse(event.dataTransfer.getData('text/plain'));
    const dragCursor = inputData[0];
    const dragBox = inputData[1];
    const newBox = document.createElement('div');
    newBox.classList.add('action-area__box');
    newBox.style.border = dragBox[1];
    newBox.style.background = dragBox[0];
    if (event.target.id === 'target-view-grid') {
        event.target.appendChild(newBox);
    }
    if (event.target.id === 'target-view-free-location') {
        newBox.style.position = 'absolute';
        newBox.style.left = `${event.pageX - rect.left - dragCursor[0]}px`;
        newBox.style.top = `${event.pageY - rect.top - dragCursor[1]}px`;
        event.target.appendChild(newBox);
    }
}

targetViewGrid.addEventListener('drop', dropHandler);
targetViewFreeLocation.addEventListener('drop', dropHandler);
