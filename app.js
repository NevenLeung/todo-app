// DOM
// let _app = document.getElementsByClassName('app')[0];
let _todoList = document.getElementsByClassName('todo-list')[0];


// data source
let todoList = [
  {
    msg: 'Buy some fruit after school',
    isDone: false
  },
  {
    msg: 'Read the CLRS book to the page 178',
    isDone: false
  },
  {
    msg: 'Discuss the Network problem with Bill',
    isDone: true
  },
  {
    msg: 'Finish the assignment of Database course',
    isDone: false
  }
];


// logic
todoList.forEach(function (todo) {
  let _newElement =  newElementNode('li', todo.msg);
  _todoList.appendChild(_newElement);
});


// methods
function newElementNode(tag, text='', className='') {
  let newElement = document.createElement(tag);
  newElement.textContent = text;
  newElement.className = className;
  return newElement;
}

