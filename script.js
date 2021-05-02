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

// Get Arrays from localStorage if available, set default values if not
const getSavedColumns = ()  => {
  if (localStorage.getItem('todoItems')) {
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

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// update item or delete
const updateItem = (id, column) => {
  const selectedArr = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!selectedColumnEl[id].textContent) {
    delete selectedArr[id];
  }
  updateDOM();
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
  todoListArray = [];
  for (let i = 0; i < todoList.children.length; i++) {
    todoListArray.push(todoList.children[i].textContent);
  }

  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }

  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }

  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }

  updateDOM();

}

// when items drag

const drag = (ev) => {
  draggedItem = ev.target;
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

  rebuildArrays();
}

updateDOM();

