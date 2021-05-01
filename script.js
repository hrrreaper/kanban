const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const itemLists = document.querySelectorAll('.drag-item-list');
const todoList = document.getElementById('todo-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let todoListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;

// Get Arrays from localStorage if available, set default values if not
const getSavedColumns = ()  => {
  if (localStorage.getItem('backlogItems')) {
    todoListArray = JSON.parse(localStorage.todoItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    todoListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}



// Set localStorage Arrays
const updateSavedColumns = () => {
  listArrays = [todoListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['todo', 'progress', 'complete', 'onHold']

  arrayNames.forEach((arrName, index) => {
    localStorage.setItem(`${arrName}Items`, JSON.stringify(listArrays[index]));
  });
}


// Create DOM Elements for each list item
const createItemEl = (columnEl, column, item, index) => {

  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  // Append
  columnEl.appendChild(listEl);

}


// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
const updateDOM = () => {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // to-do Column
  todoList.textContent = '';
  todoListArray.forEach((todoItem, index) => {
    createItemEl(todoList, 0, todoItem, index);
  });

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });

  // Run getSavedColumns only once, Update Local Storage

}


// when items drag

const drag = (ev) => {
  draggedItem = ev.target;
  
}

// allow item to drop
const allowDrop = (ev) => {
  ev.preventDefault();
}

// dropping item

const drop = (ev) => {
  ev.preventDefault(); 

}

const dragEnter = () => {
  
}


updateDOM();

