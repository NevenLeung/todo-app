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

  // 不允许修改后，todo的内容为空，或者为纯空白字符
  if (inputData.trim().length === 0) {
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
 *
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
 *
 * 添加一条新的todo，同时将一个新的todo对象的加入data.todoList数组中
 *
 * @param text todo的文本内容
 */
function addTodo(text) {
  const $li = createNewElementNode('li', 'todo', '');
  const $div = createNewElementNode('div', 'todo-display', '');
  const $table = createNewElementNode('table');
  const $tr = createNewElementNode('tr');
  const $td_1 = createNewElementNode('td');
  const $td_2 = createNewElementNode('td');
  const $checkbox = createNewElementNode('input', 'todo-checkbox', '',  'type', 'checkbox');
  const $todoContent = createNewElementNode('span', 'todo-content', text, 'data-is-done', 'false', 'data-id', data.todoList.length);

  // 将checkbox和todo-content节点分别添加到div节点，作为其子节点
  $td_1.appendChild($checkbox);
  $td_2.appendChild($todoContent);

  $tr.appendChild($td_1);
  $tr.appendChild($td_2);

  $table.appendChild($tr);

  $div.appendChild($table);

  $li.appendChild($div);

  // 最后把li添加到DOM树上，完成渲染
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
 *
 * 渲染todoList，并给相应的节点加上合适的属性
 *
 * DOM 结构
 *
 <ul class="todo-list">
   <li class='todo'>
    <div class='todo-display'>
      <table>
        <tr>
          <td>
            <input type="todo-checkbox">
          </td>
          <td>
            <span class='todo-content'></span>
          </td>
          <td>
            <button class='button todo-delete'>
              X
            </button>
          </td>
         </tr>
       </table>
     </div>
   </li>
 </ul>
 *
 */
function todoListRender() {
  data.todoList.forEach(function (todo) {
    const $li = createNewElementNode('li', 'todo', '');
    const $div = createNewElementNode('div', 'todo-display', '');
    const $table = createNewElementNode('table');
    const $tr = createNewElementNode('tr');
    const $td_1 = createNewElementNode('td');
    const $td_2 = createNewElementNode('td');
    const $checkbox = createNewElementNode('input', 'todo-checkbox', '',  'type', 'checkbox');
    const $todoContent =  createNewElementNode('span', 'todo-content', todo.text, 'data-is-done', todo.isDone, 'data-id', todo.id);

    if (todo.isDone) {
      // 为todo-content添加class 'todo-is-done'
      $todoContent.classList.toggle('todo-is-done');
      // 由于todo为已完成状态，需要将checkbox设置为已勾选状态
      $checkbox.setAttribute('checked', 'checked');
    }

    $td_1.appendChild($checkbox);
    $td_2.appendChild($todoContent);

    $tr.appendChild($td_1);
    $tr.appendChild($td_2);

    $table.appendChild($tr);

    $div.appendChild($table);

    $li.appendChild($div);

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
 *
 * 切换todo的完成状态，更改显示样式，更改data中的数据，用作事件处理函数
 *
 * @param event 事件对象
 */
function todoStatusToggle(event) {
  // 判断点击的元素是不是todo-checkbox
  if (event.target.classList.contains('todo-checkbox')) {
    // 每一个todo的todo-content是checkbox的下一个同级元素
    const $todoContent = event.target.parentElement.nextElementSibling.children[0];

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

// todo toggle时，元素位置有抖动

/**
 * editTodoInPlace()
 *
 * 响应todo-content被点击时的一系列操作，比如重置todo显示内容，todo-display与todo-edit的display属性的toggle
 *
 * @param $el 点击的元素
 *
 * DOM 结构
 *
<ul class='todo-list'>
  <li class="todo">
    <div class='todo-display'>
      <input class='todo-checkbox'>
      <span class='todo-content'></span>
       <button class='button todo-delete'>X</button>
    </div>
    <div class='todo-edit'>
      <input class='todo-edit-bar'>
      <button class='button edit-save'>save</button>
      <button class='button edit-cancel'>cancel</button>
    </div>
  </li>
</ul>
 *
 */
function editTodoInPlace($el) {
  // 判断点击元素的是不是todo-content
  if ($el.classList.contains('todo-content') && $el.style.display !== 'none') {
    // 重置所有todo的显示状态，只显示todo-display
    resetTodoDisplay();

    const $todoDisplay = $el.parentElement.parentElement.parentElement.parentElement;
    // 判断是否已经有下一个兄弟元素，即todo-edit，防止重复添加todo-edit
    if($todoDisplay.nextElementSibling === null) {
      $todoDisplay.style.display = 'none';

      const $div = createNewElementNode('div', 'todo-edit', '');
      const $editBar = createNewElementNode('input', 'todo-edit-bar', '',  'value', $el.textContent);
      const $saveButton =  createNewElementNode('button', 'button button-edit-save', 'save');
      const $cancelButton =  createNewElementNode('button', 'button button-edit-cancel', 'cancel');

      $saveButton.addEventListener('click', todoEditSave);
      $cancelButton.addEventListener('click', todoEditCancel);

      $div.appendChild($editBar);
      $div.appendChild($saveButton);
      $div.appendChild($cancelButton);

      $todoDisplay.parentNode.appendChild($div);
    } else {
      // 由于已经有了todo-edit，只需要改变display属性即可，无需重复创建，提高性能
      $todoDisplay.style.display = 'none';
      $todoDisplay.nextElementSibling.style.display = 'block';

      // 确保input中的value与todo的content相同
      $todoDisplay.nextElementSibling.children[0].value = $el.textContent;
    }
  }
}

/**
 * todoEditSave()
 *
 * 作为todo-edit中save button的事件处理方法，用于保存content的修改，修改todo-content的内容，以及将修改更新到data，以及改变todo-display和todo-edit的display属性
 *
 * * @param event
 */
function todoEditSave(event) {
  const $todoEditBar = event.target.previousElementSibling;
  const $todoEdit = $todoEditBar.parentElement;
  const $todoDisplay = $todoEdit.previousElementSibling;
  const todoContent = $todoEditBar.value;

  // 不允许修改后，todo的内容为空，或者为纯空白字符
  if (todoContent.trim().length === 0) {
    alert('The content of todo should not be empty. Please write something you need to do.');
  } else {
    $todoDisplay.children[1].textContent = todoContent;
    data.todoList[$todoDisplay.children[1].dataset.id].text = todoContent;

    $todoDisplay.style.display = 'block';
    $todoEdit.style.display = 'none';
  }
}


// 如何保存一个todo未修改之前的值，用于取消操作的回滚，
// 不需要做回滚操作，input上的值，不影响span的textContent

/**
 * todoEditCancel()
 *
 * 作为todo-edit中cancel button的事件处理方法，用于抛弃修改结果后，改变todo-display和todo-edit的display属性
 *
 * @param event
 */
function todoEditCancel(event) {
  const $todoEditBar = event.target.previousElementSibling.previousElementSibling;
  const $todoEdit = $todoEditBar.parentElement;
  const $todoDisplay = $todoEdit.previousElementSibling;

  $todoDisplay.style.display = 'block';
  $todoEdit.style.display = 'none';
}

/**
 * resetTodoDisplay()
 *
 * 重置todo list中所有todo的显示内容，让所有todo只显示todo-display
 */
function resetTodoDisplay() {
  for (let i= 0 , n = $todoList.children.length; i < n; i++) {
    const $todoDisplay = $todoList.children[i].firstElementChild;
    $todoDisplay.style.display = 'block';

    // 检查是否已经有todo-edit
    if ($todoDisplay.nextElementSibling !== null) {
      // 改变todo-edit的display属性
      $todoDisplay.nextElementSibling.style.display = 'none';
    }
  }
}