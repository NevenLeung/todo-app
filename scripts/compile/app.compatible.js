'use strict';

// get the DOM elements

var $todoList = document.querySelector('.todo-list');
var $inputForm = document.querySelector('.input-form');
var $lastEditedTodoContent = void 0;
var lastEditedTodoData = void 0;

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

  // 不允许修改后，todo的内容为空，或者为纯空白字符
  if (inputData.trim().length === 0) {
    alert('You should type something in the input bar.');
  } else {
    addTodo(inputData);
  }

  // 重置表单数据
  $inputForm.reset();
});

// 使用事件委托，将点击事件绑定到todo-list上，一个是checkbox的点击，另一个是content的点击(开启edit in place), 还有删除按钮的点击。在处理函数内部加上event.target判断
$todoList.addEventListener('click', clickOnTodo);

// 使用事件委托，将mouseover与mouseout事件绑定到todo-list，实现当鼠标悬浮以及离开todo时，显示或隐藏删除按钮的效果。在处理函数对event.target作判断
$todoList.addEventListener('mouseover', deleteButtonDisplay);
$todoList.addEventListener('mouseout', deleteButtonHidden);
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
function createNewElementNode(tagName) {
  var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var content = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  var newElement = document.createElement(tagName);
  if (content !== '') {
    newElement.textContent = content;
  }
  if (className !== '') {
    newElement.className = className;
  }

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
 *
 * 添加一条新的todo，同时将一个新的todo对象的加入data.todoList数组中
 *
 * @param text todo的文本内容
 */
function addTodo(text) {
  var $li = createNewElementNode('li', 'todo');
  var $div = createNewElementNode('div', 'todo-display');
  var $table = createNewElementNode('table');
  var $tr = createNewElementNode('tr');
  var $td_1 = createNewElementNode('td');
  var $td_2 = createNewElementNode('td');
  var $td_3 = createNewElementNode('td');
  var $checkbox = createNewElementNode('input', 'todo-checkbox', '', 'type', 'checkbox');
  var $todoContent = createNewElementNode('span', 'todo-content', text, 'data-is-done', 'false', 'data-id', data.todoList.length);
  var $deleteButton = createNewElementNode('button', 'button button-delete-todo', 'X');

  // 将checkbox和todo-content节点分别添加到div节点，作为其子节点
  $td_1.appendChild($checkbox);
  $td_2.appendChild($todoContent);
  $td_3.appendChild($deleteButton);

  $tr.appendChild($td_1);
  $tr.appendChild($td_2);
  $tr.appendChild($td_3);

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
            <button class='button button-delete-todo'>
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
    var $li = createNewElementNode('li', 'todo');
    var $div = createNewElementNode('div', 'todo-display');
    var $table = createNewElementNode('table');
    var $tr = createNewElementNode('tr');
    var $td_1 = createNewElementNode('td');
    var $td_2 = createNewElementNode('td');
    var $td_3 = createNewElementNode('td');
    var $checkbox = createNewElementNode('input', 'todo-checkbox', '', 'type', 'checkbox');
    var $todoContent = createNewElementNode('span', 'todo-content', todo.text, 'data-is-done', todo.isDone, 'data-id', todo.id);
    var $deleteButton = createNewElementNode('button', 'button button-delete-todo', 'X');

    if (todo.isDone) {
      // 为todo-content添加class 'todo-is-done'
      $todoContent.classList.toggle('todo-is-done');
      // 由于todo为已完成状态，需要将checkbox设置为已勾选状态
      $checkbox.setAttribute('checked', 'checked');
    }

    $td_1.appendChild($checkbox);
    $td_2.appendChild($todoContent);
    $td_3.appendChild($deleteButton);

    $tr.appendChild($td_1);
    $tr.appendChild($td_2);
    $tr.appendChild($td_3);

    $table.appendChild($tr);

    $div.appendChild($table);

    $li.appendChild($div);

    $todoList.appendChild($li);
  });
}

// todo 有没有需要将全部todo移除，重新渲染todoList的需要
function removeAllChildren(parent) {
  if (parent.children.length !== 0) {}
}

var todoEditInPlaceModule = function () {
  var $lastEditedTodoContent = void 0;
  var lastEditedTodoData = void 0;

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
   <button class='button button-delete-todo'>X</button>
   </div>
   <div class='todo-edit'>
   <input class='todo-edit-bar'>
   <button class='button button-edit-save'>save</button>
   <button class='button button-edit-cancel'>cancel</button>
   </div>
   </li>
   </ul>
   *
   */
  function editTodoInPlace($el) {
    // 判断点击元素的是不是todo-content
    if ($el.classList.contains('todo-content') && $el.style.display !== 'none') {
      // 判断是否有前一次的编辑操作
      if (typeof $lastEditedTodoContent !== 'undefined') {
        saveUnsavedEdition();
      }

      var $todoDisplay = $el.parentElement.parentElement.parentElement.parentElement;

      // 判断是否已经有下一个兄弟元素，即todo-edit，防止重复添加todo-edit
      if ($todoDisplay.nextElementSibling === null) {
        $todoDisplay.classList.toggle('todo-display-hide');

        var $div = createNewElementNode('div', 'todo-edit todo-edit-show');
        var $editBar = createNewElementNode('input', 'todo-edit-bar', '', 'value', $el.textContent);
        var $saveButton = createNewElementNode('button', 'button button-edit-save', 'save');
        var $cancelButton = createNewElementNode('button', 'button button-edit-cancel', 'cancel');

        $saveButton.addEventListener('click', todoEditSave);
        $cancelButton.addEventListener('click', todoEditCancel);

        $div.appendChild($editBar);
        $div.appendChild($saveButton);
        $div.appendChild($cancelButton);

        $todoDisplay.parentNode.appendChild($div);
      } else {
        // 由于已经有了todo-edit，只需要改变display属性即可，无需重复创建，提高性能
        $todoDisplay.classList.toggle('todo-display-hide');
        $todoDisplay.nextElementSibling.classList.toggle('todo-edit-show');

        // 确保input中的value与todo的content相同
        $todoDisplay.nextElementSibling.children[0].value = $el.textContent;
      }

      // 将当前的操作的todo-content节点保存起来
      saveTodoEditForTemporaryBackup($el);
    }
  }

  /**
   * todoEditSave()
   *
   * 作为todo-edit中save button的事件处理方法，用于保存content的修改，修改todo-content的内容，
   * 以及将修改更新到data，以及改变todo-display和todo-edit的display属性
   */
  function todoEditSave(event) {
    var $todoEditBar = event.target.previousElementSibling;
    var $todoEdit = $todoEditBar.parentElement;
    var $todoDisplay = $todoEdit.previousElementSibling;
    var $todoContent = $todoDisplay.children[0].children[0].children[1].children[0];

    // 不允许修改后，todo的内容为空，或者为纯空白字符
    if ($todoEditBar.value.trim().length === 0) {
      alert('The content of todo should not be empty. Please write something you need to do.');
    } else {
      $todoContent.textContent = $todoEditBar.value;
      data.todoList[$todoContent.dataset.id].text = $todoEditBar.value;

      $todoDisplay.classList.toggle('todo-display-hide');
      $todoEdit.classList.toggle('todo-edit-show');

      $lastEditedTodoContent = undefined;
      lastEditedTodoData = undefined;
    }
  }

  // 如何保存一个todo未修改之前的值，用于取消操作的回滚，
  // 不需要做回滚操作，input上的值，不影响span的textContent

  /**
   * todoEditCancel()
   *
   * 作为todo-edit中cancel button的事件处理方法，用于抛弃修改结果后，改变todo-display和todo-edit的display属性
   */
  function todoEditCancel(event) {
    var $todoEditBar = event.target.previousElementSibling.previousElementSibling;
    var $todoEdit = $todoEditBar.parentElement;
    var $todoDisplay = $todoEdit.previousElementSibling;

    $todoDisplay.classList.toggle('todo-display-hide');
    $todoEdit.classList.toggle('todo-edit-show');

    $lastEditedTodoContent = undefined;
    lastEditedTodoData = undefined;
  }

  /**
   * saveUnsavedEdition()
   *
   * 每次开启edit in place，先尝试执行该函数
   *
   * 作用：
   * - 当已经有一个todo处于可编辑状态，此时点击另一个todo，需要保存前一个todo的数据，还需要将数据修改进行保存，同时进行class toggle
   * - 简单来说是为了，编辑todo的操作互斥，同时会对未点击save按钮的修改进行保存
   */
  function saveUnsavedEdition() {
    if (typeof $lastEditedTodoContent !== 'undefined' && typeof lastEditedTodoData !== 'undefined') {
      var $lastTodoDisplay = $lastEditedTodoContent.parentElement.parentElement.parentElement.parentElement;
      var $lastTodoEdit = $lastTodoDisplay.nextElementSibling;
      // 待保存的content应该是input中的value，而不是$todoContent中的textContent，那应该如何保存value呢？
      // 通过todo-display节点，找到todo-edit，再找到相应todo-edit-bar，因为其中input的值，只有在重新进入edit in place才会被更新，所以这时input中value就是被修改后的值
      var lastTodoContentAfterEdited = $lastTodoEdit.children[0].value;
      var index = data.todoList.findIndex(function (todo) {
        return todo.id === parseInt(lastEditedTodoData.id);
      });

      // 保存修改
      $lastEditedTodoContent.textContent = lastTodoContentAfterEdited;
      data.todoList[index].text = lastTodoContentAfterEdited;

      // 让前一个未保存的todo恢复正常的显示
      $lastTodoDisplay.classList.remove('todo-display-hide');
      $lastTodoEdit.classList.remove('todo-edit-show');
    }
  }

  /**
   * saveTodoEditForTemporaryBackup()
   *
   * 当一个todo被点击进入可编辑状态时，调用该函数，记录当前被点击的todo-content节点，以及todo的id值
   *
   * @param $todoContent 被点击的todo-content节点
   */
  function saveTodoEditForTemporaryBackup($todoContent) {
    $lastEditedTodoContent = $todoContent;

    lastEditedTodoData = {
      id: $todoContent.dataset.id
    };
  }

  return {
    activatedTodoEditInPlace: editTodoInPlace
  };
}();

/**
 * clickOnTodo()
 *
 * 作为在todo上点击事件的事件处理函数，不同的点击元素会触发不同的处理事件
 */
function clickOnTodo(event) {
  // 判断点击的元素是不是todo-checkbox
  if (event.target.classList.contains('todo-checkbox')) {
    todoStatusToggle(event.target);
  }
  // 判断点击元素的是不是todo-content，是的话，开启edit in place
  if (event.target.classList.contains('todo-content')) {
    todoEditInPlaceModule.activatedTodoEditInPlace(event.target);
  }
  // 判断点击的元素是不是删除按钮
  if (event.target.classList.contains('button-delete-todo')) {
    deleteTodo(event.target);
  }
}

/**
 * todoStatusToggle()
 *
 * 切换todo的完成状态，更改显示样式，更改data中的数据，用作事件处理函数
 */
function todoStatusToggle($el) {
  // 每一个todo的todo-content是checkbox的下一个同级元素
  var $todoContent = $el.parentElement.nextElementSibling.children[0];
  if ($todoContent.dataset.isDone === 'false') {
    $todoContent.classList.toggle('todo-is-done');
    $todoContent.dataset.isDone = 'true';

    data.todoList[$todoContent.dataset.id].isDone = true;
  } else {
    $todoContent.classList.toggle('todo-is-done');
    $todoContent.dataset.isDone = 'false';

    data.todoList[$todoContent.dataset.id].isDone = false;
  }
}

/**
 * deleteTodo()
 *
 * 删除todo，从DOM上移除相应的$todo与相应的数据
 */
function deleteTodo($el) {
  var $todoDisplay = $el.parentElement.parentElement.parentElement.parentElement;
  var $todo = $todoDisplay.parentElement;
  var $todoContent = $todoDisplay.children[0].children[0].children[1].children[0];
  var id = parseInt($todoContent.dataset.id);
  var index = data.todoList.findIndex(function (todo) {
    return todo.id === id;
  });

  data.todoList.splice(index, 1);
  $todoList.removeChild($todo);
}

/**
 * deleteButtonDisplay()
 *
 * 作为mouseover的事件处理函数，当鼠标hover在todo上时，显示删除按钮
 */
function deleteButtonDisplay(event) {
  if (event.target.classList.contains('todo-checkbox') || event.target.classList.contains('todo-content') || event.target.classList.contains('button-delete-todo')) {
    var $todoDisplay = event.target.parentElement.parentElement.parentElement.parentElement;
    var $deleteButton = $todoDisplay.children[0].children[0].children[2].children[0];

    // 由于display: none和visibility: hidden时不能触发鼠标的mouseover事件，所以使用opacity实现隐藏效果
    $deleteButton.classList.add('button-delete-todo-show');
  }
}

/**
 * deleteButtonHidden()
 *
 * 作为mouseout的事件处理函数，当鼠标离开todo时，隐藏删除按钮
 */
function deleteButtonHidden(event) {
  if (event.target.classList.contains('todo-checkbox') || event.target.classList.contains('todo-content') || event.target.classList.contains('button-delete-todo')) {
    var $todoDisplay = event.target.parentElement.parentElement.parentElement.parentElement;
    var $deleteButton = $todoDisplay.children[0].children[0].children[2].children[0];

    $deleteButton.classList.remove('button-delete-todo-show');
  }
}
