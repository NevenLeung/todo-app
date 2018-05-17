'use strict';

// get the DOM elements

var $todoList = document.querySelector('.todo-list');
var $inputForm = document.querySelector('.input-form');

// data source

var data = {
  "todoList": [{
    "id": 0,
    "text": "Buy some fruit after school",
    "isDone": false
  }, {
    "id": 1,
    "text": "Read the CLRS book to the page of 178",
    "isDone": false
  }, {
    "id": 2,
    "text": "Discuss the Network problem with Bill",
    "isDone": true
  }, {
    "id": 3,
    "text": "Finish the assignment of Database course",
    "isDone": false
  }]
};

// logic

todoListRender();

// 使用表单提交input的内容
$inputForm.addEventListener('submit', function (event) {
  // 防止表单的提交
  event.preventDefault();

  var inputData = $inputForm.elements['todo-input'].value;
  if (inputData.length === 0) {
    alert('You should type something in the input bar.');
  } else {
    addTodo(inputData);
  }

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
function createNewElementNode(tagName) {
  var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  var newElement = document.createElement(tagName);
  newElement.textContent = content;
  newElement.className = className;

  for (var _len = arguments.length, attributeData = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    attributeData[_key - 3] = arguments[_key];
  }

  if (attributeData.length !== 0) {
    for (var i = 0; i < attributeData.length; i = i + 2) {
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
  var $li = createNewElementNode('li', 'todo', '');
  var $checkbox = createNewElementNode('input', 'todo-checkbox', '', 'type', 'checkbox');
  var $todoContent = createNewElementNode('span', 'todo-content', text, 'data-is-done', 'false', 'data-id', data.todoList.length);

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
    var $li = createNewElementNode('li', 'todo', '');
    var $div = createNewElementNode('div', 'todo-display', '');
    var $checkbox = createNewElementNode('input', 'todo-checkbox', '', 'type', 'checkbox');
    var $todoContent = createNewElementNode('span', 'todo-content', todo.text, 'data-is-done', todo.isDone, 'data-id', todo.id);

    if (todo.isDone) {
      // 为todo-content添加class 'todo-is-done'
      $todoContent.classList.toggle('todo-is-done');
      // 由于todo为已完成状态，需要将checkbox设置为已勾选状态
      $checkbox.setAttribute('checked', 'checked');
    }

    $div.appendChild($checkbox);
    $div.appendChild($todoContent);
    $li.appendChild($div);

    $todoList.appendChild($li);
  });
}

// todo 有没有需要将全部todo移除，重新渲染todoList的需要
function removeAllChildren(parent) {
  if (parent.children.length !== 0) {}
}

/**
 * todoStatusToggle()
 * 切换todo的完成状态，更改显示样式，更改data中的数据，用作事件处理函数
 *
 * @param event 事件对象
 */
function todoStatusToggle(event) {
  // 判断点击的元素是不是todo-checkbox
  if (event.target.classList.contains('todo-checkbox')) {
    // 每一个todo的todo-content是checkbox的下一个同级元素
    var $todoContent = event.target.nextElementSibling;

    if ($todoContent.dataset.isDone === 'false') {
      $todoContent.classList.toggle('todo-is-done');

      $todoContent.dataset.isDone = 'true';
      // todo 改变data中的值，其中todo的id刚好等于在todoList中的下标 (需要一个更好的方案来维护id)
      data.todoList[$todoContent.dataset.id].isDone = true;
    } else {
      $todoContent.classList.toggle('todo-is-done');

      $todoContent.dataset.isDone = 'false';
      data.todoList[$todoContent.dataset.id].isDone = false;
    }
  }

  // 判断点击元素的是不是todo-content，是的话，开启edit in place
  if (event.target.classList.contains('todo-content')) {
    editTodoInPlace(event.target);
  }
}

// let count = 1;
// todo 每次只能有一个todo能处于待编辑状态，获取所有todo跟todo-edit（需要检测是否存在），将他们reset为是否的显示状态
// todo toggle时，元素位置有抖动
function editTodoInPlace($el) {
  // 判断点击元素的是不是todo-content
  if ($el.classList.contains('todo-content') && $el.style.display !== 'none') {
    var $todoDisplay = $el.parentElement;
    // 判断是否已经有下一个兄弟元素，即todo-edit，防止重复添加todo-edit
    if ($todoDisplay.nextElementSibling === null) {
      $todoDisplay.style.display = 'none';

      var $div = createNewElementNode('div', 'todo-edit', '');
      var $editBar = createNewElementNode('input', 'todo-edit-bar', '', 'value', $el.textContent);
      var $saveButton = createNewElementNode('button', 'button todo-edit-save', 'save');
      var $cancelButton = createNewElementNode('button', 'button todo-edit-cancel', 'cancel');

      $saveButton.addEventListener('click', todoEditSave);
      $cancelButton.addEventListener('click', todoEditCancel);

      $div.appendChild($editBar);
      $div.appendChild($saveButton);
      $div.appendChild($cancelButton);

      $el.parentNode.parentNode.appendChild($div);
    } else {
      $todoDisplay.style.display = 'none';
      $todoDisplay.nextElementSibling.style.display = 'block';

      // 确保input中的value与todo的content相同
      $todoDisplay.nextElementSibling.children[0].value = $el.textContent;
    }
  }
}

// 保存content的修改，修改todo-content的内容，以及将修改更新到data中
function todoEditSave(event) {
  var $todoEditBar = event.target.previousElementSibling;
  var $todoEdit = $todoEditBar.parentElement;
  var $todoDisplay = $todoEdit.previousElementSibling;
  var todoContent = $todoEditBar.value;

  $todoDisplay.children[1].textContent = todoContent;
  data.todoList[$todoDisplay.children[1].dataset.id].text = todoContent;

  $todoDisplay.style.display = 'block';
  $todoEdit.style.display = 'none';
}

// 如何保存一个todo未修改之前的值，用于取消操作的回滚，
// 不需要做回滚操作，input上的值，不影响span的textContent
function todoEditCancel(event) {
  var $todoEditBar = event.target.previousElementSibling.previousElementSibling;
  var $todoEdit = $todoEditBar.parentElement;
  var $todoDisplay = $todoEdit.previousElementSibling;

  $todoDisplay.style.display = 'block';
  $todoEdit.style.display = 'none';
}
