'use strict';

// DOM
// let _app = document.getElementsByClassName('app')[0];
let _todoList = document.getElementsByClassName('todo-list')[0];
let _inputBar = document.getElementById('input-bar');

// data source
// let todoList = [
//   {
//     text: 'Buy some fruit after school',
//     isDone: false
//   },
//   {
//     text: 'Read the CLRS book to the page 178',
//     isDone: false
//   },
//   {
//     text: 'Discuss the Network problem with Bill',
//     isDone: true
//   },
//   {
//     text: 'Finish the assignment of Database course',
//     isDone: false
//   }
// ];
let data = {
  "todoList": [
    {
      "text": "Buy some fruit after school",
      "isDone": false
    },
    {
      "text": "Read the CLRS book to the page 178",
      "isDone": false
    },
    {
      "text": "Discuss the Network problem with Bill",
      "isDone": true
    },
    {
      "text": "Finish the assignment of Database course",
      "isDone": false
    }
  ]
};


// logic

todoListRender();

// 使用表单提交input的内容
_inputBar.addEventListener('submit', function(event) {

  // 防止表单的提交
  event.preventDefault();

  let inputData = _inputBar.elements['todo-input'].value;
  addTodo(inputData);

  // 重置表单数据
  _inputBar.reset();
});

// methods

/**
 * createNewElementNode()
 * 自定义创建元素节点方法
 *
 * @param tagName 标签名
 * @param content 文本内容
 * @param className 样式名称
 * @param attributeData 设置节点的属性，属性值应为成对出现，前者为属性名称，后者为属性值
 * @returns 返回创建的元素节点
 */
function createNewElementNode(tagName, content='', className='', ...attributeData) {

  let newElement = document.createElement(tagName);
  newElement.textContent = content;
  newElement.className = className;

  if (attributeData.length !== 0) {
    for (let i = 0; i < attributeData.length; i = i + 2) {
      newElement.setAttribute(attributeData[i], attributeData[i + 1]);
    }
  }

  return newElement;
}


/**
 * addTodo()
 * 添加一个新的todo（节点），同时将text的内容加入data.todoList中
 *
 * @param text todo的文本内容
 */
function addTodo(text) {

  let _newElement = createNewElementNode('li', text);
  _todoList.appendChild(_newElement);

  data.todoList.push({
    "text": text,
    "isDone": false
  });
}


/**
 * todoListRender()
 * 渲染todoList，并给相应的节点加上data-is-done属性
 */
function todoListRender() {

  data.todoList.forEach(function (todo) {
    let todoNode =  createNewElementNode('li', todo.text, '', 'data-is-done', todo.isDone);
    /**
     * todo
     *
     * 在每个todo前加上一个checkbox，最理想的情况下是在li内部加checkbox，但又容易hardcoded,
     * 同时，这个checkbox与todo的data-is-done需要关联起来，由checkbox来改变todo的状态，
     * 之后在改变样式
     */

    // let todoStatusNode = createNewElementNode('input');
     todoNode.className = checkTodoIsDone(todoNode);
    _todoList.appendChild(todoNode);
  });
}

// todo 有没有需要将全部todo移除，重新渲染todoList的需要
function removeAllChildren(parent) {
  if(parent.children.length !== 0) {

  }
}

/**
 * checkTodoIsDone()
 * 检查todo是否已经完成，返回相应的className
 *
 * @param todoNode 传入一个todo节点，检查它的dataSet.isDone(类型为字符串，不是布尔值)，
 * @returns {string} 返回
 */
function checkTodoIsDone(todoNode) {
  return todoNode.dataset.isDone === 'true'? 'todo-is-done': '';
}