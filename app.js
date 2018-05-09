'use strict';

// get the DOM elements

const $todoList = document.querySelector('.todo-list');
const $inputForm = document.querySelector('.input-form');

// data source

const data = {
  "todoList": [
    {
      "id": 0,
      "text": "Buy some fruit after school",
      "isDone": false
    },
    {
      "id": 1,
      "text": "Read the CLRS book to the page of 178",
      "isDone": false
    },
    {
      "id": 2,
      "text": "Discuss the Network problem with Bill",
      "isDone": true
    },
    {
      "id": 3,
      "text": "Finish the assignment of Database course",
      "isDone": false
    }
  ]
};


// logic

todoListRender();

// 使用表单提交input的内容
$inputForm.addEventListener('submit', function(event) {
  // 防止表单的提交
  event.preventDefault();

  const inputData = $inputForm.elements['todo-input'].value;
  addTodo(inputData);

  // 重置表单数据
  $inputForm.reset();
});

// 使用事件委托，将todoStatusToggle绑定到todoList上，在处理函数内部加上event.target判断
$todoList.addEventListener('click', todoStatusToggle);

// methods

/**
 * createNewElementNode()
 * 自定义创建元素节点方法
 *
 * @param tagName 标签名
 * @param className 样式名称
 * @param content 文本内容
 * @param attributeData 设置节点的属性，属性值应为成对出现，前者为属性名称，后者为属性值
 * @returns 返回创建的元素节点
 */
function createNewElementNode(tagName, className='', content='', ...attributeData) {
  const newElement = document.createElement(tagName);
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
 * 添加一条新的todo，同时将一个新的todo对象的加入data.todoList数组中
 *
 * @param text todo的文本内容
 */
function addTodo(text) {
  const $li = createNewElementNode('li', 'todo', '');
  const $checkbox = createNewElementNode('input', 'todo-checkbox', '',  'type', 'checkbox');
  const $todoContent = createNewElementNode('span', 'todo-content', text, 'data-is-done', 'false', 'data-id', data.todoList.length);

  // 将checkbox和todo-content节点分别添加到li节点，作为其子节点
  $li.appendChild($checkbox);
  $li.appendChild($todoContent);
  $todoList.appendChild($li);

  data.todoList.push({
    // todo的id从0开始，新的todo的id刚好可以等于之前的todoList.length
    "id": data.todoList.length,
    "text": text,
    "isDone": false
  });
}


/**
 * todoListRender()
 * 渲染todoList，并给相应的节点加上合适的属性
 * 每个todo为一个li元素，li元素内部包括一个checkbox和inline-block的todo-content
 */
function todoListRender() {
  data.todoList.forEach(function (todo) {
    const $li = createNewElementNode('li', 'todo', '');
    const $checkbox = createNewElementNode('input', 'todo-checkbox', '',  'type', 'checkbox');
    const $todoContent =  createNewElementNode('span', 'todo-content', todo.text, 'data-is-done', todo.isDone, 'data-id', todo.id);

    if (todo.isDone) {
      // 为todo-content添加class 'todo-is-done'
      $todoContent.classList.toggle('todo-is-done');
      // 由于todo为已完成状态，需要将checkbox设置为已勾选状态
      $checkbox.setAttribute('checked', 'checked');
    }

    $li.appendChild($checkbox);
    $li.appendChild($todoContent);

    $todoList.appendChild($li);
  });
}

// todo 有没有需要将全部todo移除，重新渲染todoList的需要
function removeAllChildren(parent) {
  if(parent.children.length !== 0) {

  }
}


/**
 * todoStatusToggle()
 * 切换todo的完成状态，更改显示样式，更改data中的数据，用作事件处理函数
 *
 * @param event 事件对象
 */
function todoStatusToggle(event) {
  // 判断点击的是否是checkbox
  if (event.target.classList.contains('todo-checkbox')) {
    // 每一个todo的todo-content是checkbox的下一个同级元素
    const $todoContent = event.target.nextElementSibling;

    if ($todoContent.dataset.isDone === 'false') {
      $todoContent.classList.toggle('todo-is-done');

      $todoContent.dataset.isDone = 'true';
      // 改变data中的值，其中todo的id刚好等于在todoList中的下标
      data.todoList[$todoContent.dataset.id].isDone = true;

    } else {
      $todoContent.classList.toggle('todo-is-done');

      $todoContent.dataset.isDone = 'false';
      data.todoList[$todoContent.dataset.id].isDone = false;
    }
  }
}