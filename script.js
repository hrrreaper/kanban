const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
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
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
const getSavedColumns = ()  => {
  if (localStorage.getItem('todoItems')) {
    todoListArray = JSON.parse(localStorage.todoItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
    completeListArray = JSON.parse(localStorage.completeItems);
  } else {
    todoListArray = [];
    progressListArray = [];
    completeListArray = [];
    onHoldListArray = [];
  }
}


// Set localStorage Arrays
const updateSavedColumns = () => {
  listArrays = [todoListArray, progressListArray, onHoldListArray, completeListArray];
  const arrayNames = ['todo', 'progress', 'onHold', 'complete']

  arrayNames.forEach((arrName, index) => {
    localStorage.setItem(`${arrName}Items`, JSON.stringify(listArrays[index]));
  });
}

// filter array to remove empty spots

const filterArray = (array) => {
  const filteredArr = array.filter(item => item !== null);
  return filteredArr;
}

// Create DOM Elements for each list item
const createItemEl = (columnEl, column, item, index) => {

  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);

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
  todoListArray = filterArray(todoListArray);

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

   // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 2, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 3, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

 
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// update item or delete
const updateItem = (id, column) => {
  const selectedArr = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
    delete selectedArr[id];
  } else {
    selectedArr[id] = selectedColumnEl[id].textContent;
  }
  updateDOM();
  }
}

// add item to column and save it
const addToColumn = (column) => {
  const itemText = addItems[column].textContent;
  const selectedArr = listArrays[column];
  selectedArr.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}


// show add item box
const showInputBox = (column) => {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// hide add item box
const hideInputBox = (column) => {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// allow saved arrays to update

const rebuildArrays = () => {
  todoListArray = Array.from(todoList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);
  completeListArray = Array.from(completeList.children).map(i => i.textContent);
  updateDOM();
}

// when items drag
const drag = (ev) => {
  draggedItem = ev.target;
  dragging = true;
}

//  when item enters column area
const dragEnter = (column) => {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// allow item to drop
const allowDrop = (ev) => {
  ev.preventDefault();
}

// dropping item

const drop = (ev) => {
  ev.preventDefault(); 
  // remove bg color
  listColumns.forEach((column) => {
    column.classList.remove('over');
  })
  // add add to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // dragging done
  dragging = false;
  rebuildArrays();
}

updateDOM();

