'use strict';

// get the DOM elements

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

var $inputForm = document.querySelector('.input-form');
var $displayCtrl = document.querySelector('.display-ctrl');
var $todoList = document.querySelector('.todo-list');

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

// ------------------------- modules --------------------------------

// polyfills
(function () {
  //closest- https://developer.mozilla.org/zh-CN/docs/Web/API/Element/closest
  if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

  if (!Element.prototype.closest) Element.prototype.closest = function (s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement;
    } while (el !== null);
    return null;
  };
})();

/**
 * @module domOperationModule  将常用的DOM操作进行封装
 *
 * @return {object} {appendMultiChild, query, queryAll, findClosestAncestor, findSibling, findSiblings}
 *
 ******************************************************************************************
 * @method appendMultiChild()  将多个节点按顺序添加到parentNode，作为其子节点
 *
 * @param parentNode  父节点
 * @param childrenNodes  一个或多个待添加的子节点，多个节点用','隔开
 ******************************************************************************************
 * @method query()  基于$el去查找第一个符合selector的元素
 *
 * @param $el  基准元素
 * @param selector {string} 合法的css选择器字符串
 ******************************************************************************************
 * @method queryAll()  基于$el去查找符合selector的元素集合
 *
 * @param $el  基准元素
 * @param selector {string} 合法的css选择器字符串
 ******************************************************************************************
 * @method findClosestAncestor()  寻找第一个符合selector的祖先节点
 *
 * @param $el  开始寻找的基准元素
 * @param selector {string} 合法的css选择器字符串
 ******************************************************************************************
 * @method findSibling()  寻找第一个符合selector的兄弟元素
 *
 * @param $el  开始寻找的基准元素
 * @param selector {string} 合法的css选择器字符串
 * @param option {string}  查找选项 forward(default)|backward
 ******************************************************************************************
 * @method findSiblings()  寻找符合selector的兄弟元素集合(排除$el本身)
 *
 * @param $el  开始寻找的基准元素
 * @param selector {string} 合法的css选择器字符串
 * @param option {string}  查找选项 all(default)|forward|backward
 ******************************************************************************************
 */
var domOperationModule = function () {
  // 将多个节点按顺序添加到parentNode，作为其子节点
  function appendMultiChild(parentNode) {
    try {
      for (var _len = arguments.length, childrenNodes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        childrenNodes[_key - 1] = arguments[_key];
      }

      if (parentNode instanceof Node && childrenNodes.length !== 0) {
        childrenNodes.forEach(function (childNode) {
          if (childNode instanceof Node) {
            parentNode.appendChild(childNode);
          } else {
            throw new Error(childNode + ' is not of type \'Node\'');
          }
        });
      } else {
        console.log('ParentNode or childrenNodes is not defined.');
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  // 基于$el去查找第一个符合selector的元素
  // 将document.querySelector与element.querySelector区分开，对后者作了一些改进，基于element向子代元素查找，使得查找的结果符合预期
  function query($el, selector) {
    try {
      if ($el instanceof Node && typeof selector === 'string') {
        if ($el instanceof Document) {
          return $el.querySelector(selector);
        } else {
          var originID = $el.getAttribute('id');
          var newID = originID || 'temp';

          $el.setAttribute('id', newID);
          selector = '#' + newID + ' ' + selector;

          var result = $el.querySelector(selector);

          // 移除临时的id属性
          if (!originID) {
            $el.removeAttribute('id');
          }

          return result;
        }
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  // 基于$el去查找符合selector的元素集合
  // 将document.querySelectorAll与element.querySelectorAll区分开，对后者作了一些改进，基于element向子代元素查找，使得查找的结果符合预期
  function queryAll($el, selector) {
    try {
      if ($el instanceof Node && typeof selector === 'string') {
        if ($el instanceof Document) {
          return $el.querySelectorAll(selector);
        } else {
          var originID = $el.getAttribute('id');
          var newID = originID || 'temp';

          $el.setAttribute('id', newID);
          selector = '#' + newID + ' ' + selector;

          var result = $el.querySelectorAll(selector);

          // 移除临时的id属性
          if (!originID) {
            $el.removeAttribute('id');
          }

          return result;
        }
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  // 寻找第一个符合selector的祖先节点
  // $el.closest()会返回自身，这并不符合实际的使用需求，以下代码对这一点作了特殊处理
  function findClosestAncestor($el, selector) {
    try {
      if ($el instanceof Element && typeof selector === 'string') {
        if ($el.closest(selector) === $el) {
          if ($el.parentElement instanceof Element) {
            return $el.parentElement.closest(selector);
          } else {
            return null;
          }
        } else {
          return $el.closest(selector);
        }
      } else {
        return null;
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  // 向前寻找第一个符合selector的兄弟元素
  function findSiblingForward($el, selector) {
    if ($el instanceof Element && typeof selector === 'string' && $el.previousElementSibling) {
      if ($el.previousElementSibling.matches(selector)) {
        return $el.previousElementSibling;
      } else {
        return findSiblingForward($el.previousElementSibling, selector);
      }
    } else {
      return null;
    }
  }

  // 向后寻找第一个符合selector的兄弟元素
  function findSiblingBackward($el, selector) {
    if ($el instanceof Element && typeof selector === 'string' && $el.nextElementSibling) {
      if ($el.nextElementSibling.matches(selector)) {
        return $el.nextElementSibling;
      } else {
        return findSiblingBackward($el.nextElementSibling, selector);
      }
    } else {
      return null;
    }
  }

  // 寻找第一个符合selector的兄弟元素
  function findSibling($el, selector) {
    var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'backward';

    try {
      if (option === 'backward') {
        return findSiblingBackward($el, selector);
      } else if (option === 'forward') {
        return findSiblingForward($el, selector);
      } else {
        return null;
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  // 寻找符合selector的兄弟元素集合(排除$el本身)
  function findSiblings($el, selector) {
    var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'all';

    try {
      if ($el instanceof Element && typeof selector === 'string' && $el.parentElement instanceof Element) {
        var result = [];
        if (option === 'all') {
          var _result;

          var index = void 0;
          (_result = result).push.apply(_result, _toConsumableArray($el.parentElement.children));
          index = result.indexOf($el);
          result.splice(index, 1); // 移除$el本身

          result = result.filter(function (el) {
            return el.matches(selector);
          });

          return result;
        } else if (option === 'backward') {
          var _result2;

          var _index = void 0;
          (_result2 = result).push.apply(_result2, _toConsumableArray($el.parentElement.children));
          _index = result.indexOf($el);
          result.splice(0, _index + 1); // 从头开始移除sibling，直到把$el也一起移除

          result = result.filter(function (el) {
            return el.matches(selector);
          });

          return result;
        } else if (option === 'forward') {
          var _result3;

          var _index2 = void 0;
          (_result3 = result).push.apply(_result3, _toConsumableArray($el.parentElement.children));
          _index2 = result.indexOf($el);
          result.splice(_index2, result.length - _index2); // 从$el开始移除，直到把$el后面的所有sibling全部移除

          result = result.filter(function (el) {
            return el.matches(selector);
          });

          return result;
        } else {
          return null;
        }
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  return {
    appendMultiChild: appendMultiChild,
    query: query,
    queryAll: queryAll,
    findClosestAncestor: findClosestAncestor,
    findSibling: findSibling,
    findSiblings: findSiblings
  };
}();

/**
 * @module todoEditInPlaceModule 就地编辑(edit in place)的相关功能
 *
 * @return {Object} {activatedTodoEditInPlace, todoEditSave, todoEditCancel}
 *
 * *****************************************************************************
 * @method activatedTodoEditInPlace() 开启edit in place功能
 *
 * @param $el 传入todo-content节点
 * *****************************************************************************
 * @method todoEditSave() 保存修改，并关闭edit in place功能
 *
 * @param $el 传入button-save-todo-edit节点
 * *****************************************************************************
 * @method todoEditCancel() 放弃修改，并关闭edit in place功能
 *
 * @param $el 传入button-cancel-todo-edit节点
 */
var todoEditInPlaceModule = function (domWrapper) {
  var $lastEditedTodoContent = void 0;
  var lastEditedTodoData = void 0;

  /**
   * activatedTodoEditInPlace()
   *
   * 响应todo-content被点击时的一系列操作，比如重置todo显示内容，todo-display与todo-edit的display属性的toggle
   *
   * @param $el todo-content节点
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
  function activatedTodoEditInPlace($el) {
    // 判断点击元素的是不是todo-content
    if ($el.matches('.todo-content') && $el.style.display !== 'none') {
      // 判断是否有前一次的编辑操作
      if (typeof $lastEditedTodoContent !== 'undefined') {
        saveUnsavedEdition();
      }

      var $todoDisplay = domWrapper.findClosestAncestor($el, '.todo-display');
      var $todo = domWrapper.findClosestAncestor($todoDisplay, '.todo');

      // 判断是否已经有下一个兄弟元素，即todo-edit，防止重复添加todo-edit
      if (domWrapper.query($todo, '.todo-edit') === null) {
        $todoDisplay.classList.add('todo-display-hidden');

        var $div = createNewElementNode('div', 'todo-edit todo-edit-show');
        var $editBar = createNewElementNode('input', 'todo-edit-bar', '', 'value', $el.textContent);
        var $saveButton = createNewElementNode('button', 'button button-save-todo-edit', 'save');
        var $cancelButton = createNewElementNode('button', 'button button-cancel-todo-edit', 'cancel');

        domWrapper.appendMultiChild($div, $editBar, $saveButton, $cancelButton);

        $todo.appendChild($div);
      } else {
        // 由于已经有了todo-edit，只需要改变display属性即可，无需重复创建，提高性能
        var $todoEdit = domWrapper.query($todo, '.todo-edit');
        var $todoEditBar = domWrapper.query($todoEdit, '.todo-edit-bar');
        $todoDisplay.classList.add('todo-display-hidden');
        $todoEdit.classList.add('todo-edit-show');

        // 确保input中的value与todo的content相同
        $todoEditBar.value = $el.textContent;
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
   *
   * @param $el button-save-todo-edit节点
   */
  function todoEditSave($el) {
    if ($el.matches('.button-save-todo-edit')) {
      var $todoEdit = domWrapper.findClosestAncestor($el, '.todo-edit');
      var $todoEditBar = domWrapper.query($todoEdit, '.todo-edit-bar');
      var $todoDisplay = domWrapper.findSibling($todoEdit, '.todo-display', 'forward');
      var $todoContent = domWrapper.query($todoDisplay, '.todo-content');

      // 不允许修改后，todo的内容为空，或者为纯空白字符
      if ($todoEditBar.value.trim().length === 0) {
        alert('The content of todo should not be empty. Please write something you need to do.');
      } else {
        $todoContent.textContent = $todoEditBar.value;
        data.todoList[$todoContent.dataset.id].text = $todoEditBar.value;

        $todoDisplay.classList.remove('todo-display-hidden');
        $todoEdit.classList.remove('todo-edit-show');

        $lastEditedTodoContent = undefined;
        lastEditedTodoData = undefined;
      }
    }
  }

  /**
   * todoEditCancel()
   *
   * 作为todo-edit中cancel button的事件处理方法，用于抛弃修改结果后，改变todo-display和todo-edit的display属性
   *
   * @param $el button-cancel-todo-edit节点
   */
  function todoEditCancel($el) {
    if ($el.matches('.button-cancel-todo-edit')) {
      // 如何保存一个todo未修改之前的值，用于取消操作的回滚，
      // 不需要做回滚操作，input上的值，不影响span的textContent
      var $todoEdit = domWrapper.findClosestAncestor($el, '.todo-edit');
      var $todoDisplay = domWrapper.findSibling($todoEdit, '.todo-display', 'forward');

      $todoDisplay.classList.remove('todo-display-hidden');
      $todoEdit.classList.remove('todo-edit-show');

      $lastEditedTodoContent = undefined;
      lastEditedTodoData = undefined;
    }
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
      var $lastTodoDisplay = domWrapper.findClosestAncestor($lastEditedTodoContent, '.todo-display');
      var $lastTodoEdit = domWrapper.findSibling($lastTodoDisplay, '.todo-edit');

      // 待保存的content应该是input中的value，而不是$todoContent中的textContent，那应该如何保存value呢？
      // 通过todo-display节点，找到todo-edit，再找到相应todo-edit-bar，因为其中input的值，只有在重新进入edit in place才会被更新，所以此时input中value仍然是被修改后的值
      var lastTodoContentAfterEdited = domWrapper.query($lastTodoEdit, '.todo-edit-bar').value;
      var index = data.todoList.findIndex(function (todo) {
        return todo.id === parseInt(lastEditedTodoData.id);
      });

      // 保存修改
      $lastEditedTodoContent.textContent = lastTodoContentAfterEdited;
      data.todoList[index].text = lastTodoContentAfterEdited;

      // 让前一个未保存的todo恢复正常的显示
      $lastTodoDisplay.classList.remove('todo-display-hidden');
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
    activatedTodoEditInPlace: activatedTodoEditInPlace,
    todoEditSave: todoEditSave,
    todoEditCancel: todoEditCancel
  };
}(domOperationModule);

/**
 * @module displayCtrlModule todo的显示选项控制
 *
 * @return {Object} {getDisplayOption, selectAnOption, displayTodoAll, displayTodoIsDone, displayTodoIsNotDone}
 *
 * *****************************************************************************
 * @method getDisplayOption() 获取当前的display option
 *
 * *****************************************************************************
 * @method selectAnOption() 选中一个display option，对option tab的样式进行更改
 *
 * @param $el 传入一个tab的button节点
 * *****************************************************************************
 * @method displayTodoAll() 显示全部todo
 *
 * @param $el 传入display-all节点
 * *****************************************************************************
 * @method displayTodoIsDone() 显示已完成的todo
 *
 * @param $el 传入display-done节点
 * *****************************************************************************
 * @method displayTodoIsNotDone() 显示未完成的todo
 *
 * @param $el 传入display-not-done节点
 *
 */
var displayCtrlModule = function (domWrapper) {
  var $lastOption = void 0;

  // 获取当前的display option
  function getDisplayOption() {
    return $lastOption;
  }

  // 选中一个display option，对option tab的样式进行更改
  function selectAnOption($el) {
    if (typeof $lastOption === 'undefined') {
      $lastOption = domWrapper.query($displayCtrl, '.display-all');
      $lastOption.classList.add('selected');
    } else {
      $lastOption.classList.remove('selected');
      $el.classList.add('selected');

      $lastOption = $el;
    }
  }

  // 显示全部todo
  function displayTodoAll($el) {
    if ($el.matches('.display-all')) {
      var $todoNodes = [];
      $todoNodes.push.apply($todoNodes, _toConsumableArray($todoList.children));

      $todoNodes.forEach(function ($todo) {
        $todo.classList.remove('todo-hidden');
      });

      selectAnOption($el);
    }
  }

  // 显示完成的todo
  function displayTodoIsDone($el) {
    if ($el.matches('.display-done')) {
      var $todoNodes = [];
      $todoNodes.push.apply($todoNodes, _toConsumableArray($todoList.children));

      $todoNodes.forEach(function ($todo) {
        if ($todo.dataset.isDone === 'true') {
          $todo.classList.remove('todo-hidden');
        } else {
          $todo.classList.add('todo-hidden');
        }
      });

      selectAnOption($el);
    }
  }

  // 显示为完成的todo
  function displayTodoIsNotDone($el) {
    if ($el.matches('.display-not-done')) {
      var $todoNodes = [];
      $todoNodes.push.apply($todoNodes, _toConsumableArray($todoList.children));

      $todoNodes.forEach(function ($todo) {
        if ($todo.dataset.isDone === 'true') {
          $todo.classList.add('todo-hidden');
        } else {
          $todo.classList.remove('todo-hidden');
        }
      });

      selectAnOption($el);
    }
  }

  return {
    getDisplayOption: getDisplayOption,
    selectAnOption: selectAnOption,
    displayTodoAll: displayTodoAll,
    displayTodoIsDone: displayTodoIsDone,
    displayTodoIsNotDone: displayTodoIsNotDone
  };
}(domOperationModule);

// ---------------------------- methods ----------------------------------

/**
 * createNewElementNode()
 *
 * 自定义创建元素节点方法
 *
 * @param tagName 标签名
 * @param className 样式名称
 * @param content 文本内容
 * @param attributeData 设置节点的属性，属性值应为成对出现，前者为属性名称，后者为属性值
 * @returns Element 返回创建的元素节点
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

  for (var _len2 = arguments.length, attributeData = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    attributeData[_key2 - 3] = arguments[_key2];
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
  var $li = createNewElementNode('li', 'todo', '', 'data-is-done', 'false');
  var $div = createNewElementNode('div', 'todo-display');
  var $checkbox = createNewElementNode('input', 'todo-checkbox', '', 'type', 'checkbox');
  var $todoContent = createNewElementNode('span', 'todo-content', text, 'data-id', data.todoList.length);
  var $deleteButton = createNewElementNode('button', 'button button-delete-todo', 'X');

  // 将checkbox和todo-content、delete-button节点分别添加到div节点，作为其子节点

  domOperationModule.appendMultiChild($div, $checkbox, $todoContent, $deleteButton);

  $li.appendChild($div);

  // 把li添加到todo-list上
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
     <input class='todo-checkbox'>
     <span class='todo-content'></span>
     <button class='button button-delete-todo'>X</button>
   </div>
   </li>
 </ul>
 *
 */
function todoListRender() {
  data.todoList.forEach(function (todo) {
    var $li = createNewElementNode('li', 'todo', '', 'data-is-done', todo.isDone);
    var $div = createNewElementNode('div', 'todo-display');
    var $checkbox = createNewElementNode('input', 'todo-checkbox', '', 'type', 'checkbox');
    var $todoContent = createNewElementNode('span', 'todo-content', todo.text, 'data-id', todo.id);
    var $deleteButton = createNewElementNode('button', 'button button-delete-todo', 'X');

    if (todo.isDone) {
      // 为todo-content添加class 'todo-is-done'
      $todoContent.classList.add('todo-is-done');
      // 由于todo为已完成状态，需要将checkbox设置为已勾选状态
      $checkbox.setAttribute('checked', 'checked');
    }

    domOperationModule.appendMultiChild($div, $checkbox, $todoContent, $deleteButton);

    $li.appendChild($div);

    $todoList.appendChild($li);
  });
}

/**
 * clickOnTodo()
 *
 * 作为在todo上点击事件的事件处理函数，不同的点击元素会触发不同的处理事件
 */
function clickOnTodo(event) {
  var $el = event.target;
  // 判断点击的元素是不是todo-checkbox
  if ($el.matches('.todo-checkbox')) {
    todoStatusToggle(event.target);
  }
  // 判断点击元素的是不是todo-content，是的话，开启edit in place功能
  if ($el.matches('.todo-content')) {
    todoEditInPlaceModule.activatedTodoEditInPlace(event.target);
  }
  // 判断点击的元素是不是删除按钮
  if ($el.matches('.button-delete-todo')) {
    deleteTodo(event.target);
  }
  // 判断点击的元素是不是save按钮
  if ($el.matches('.button-save-todo-edit')) {
    todoEditInPlaceModule.todoEditSave(event.target);
  }
  // 判断点击的元素是不是cancel按钮
  if ($el.matches('.button-cancel-todo-edit')) {
    todoEditInPlaceModule.todoEditCancel(event.target);
  }
}

/**
 * todoStatusToggle()
 *
 * 切换todo的完成状态，更改显示样式，更改data中的数据，用作事件处理函数
 *
 * $el为todo-checkbox节点
 */
function todoStatusToggle($el) {
  // 每一个todo的todo-content是checkbox的下一个同级元素
  var $todo = domOperationModule.findClosestAncestor($el, '.todo');
  var $todoContent = domOperationModule.query($todo, '.todo-content');
  var $displayOptionSelected = displayCtrlModule.getDisplayOption();
  if ($todo.dataset.isDone === 'false') {
    $todoContent.classList.add('todo-is-done');
    $todo.dataset.isDone = 'true';

    // 如果display option不是All，则在其他两个tab中，对todo的状态进行toggle操作，都是需要在当前的tab中使它消失
    if (!$displayOptionSelected.matches('.display-all')) {
      $todo.classList.add('todo-hidden');
    }

    data.todoList[$todoContent.dataset.id].isDone = true;
  } else {
    $todoContent.classList.remove('todo-is-done');
    $todo.dataset.isDone = 'false';

    // 如果display option不是All，则在其他两个tab中，对todo的状态进行toggle操作，都是需要在当前的tab中使它消失
    if (!$displayOptionSelected.matches('.display-all')) {
      $todo.classList.add('todo-hidden');
    }

    data.todoList[$todoContent.dataset.id].isDone = false;
  }
}

/**
 * deleteTodo()
 *
 * 删除todo，从DOM上移除相应的$todo与相应的数据
 *
 * $el为button-delete-todo节点
 */
function deleteTodo($el) {
  var $todo = domOperationModule.findClosestAncestor($el, '.todo');
  var $todoContent = domOperationModule.findSibling($el, '.todo-content', 'forward');

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
  var $el = event.target;
  if (domOperationModule.findClosestAncestor($el, '.todo-display') instanceof Element) {
    var $todoDisplay = domOperationModule.findClosestAncestor($el, '.todo-display');
    var $deleteButton = domOperationModule.query($todoDisplay, '.button-delete-todo');

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
  var $el = event.target;
  if (domOperationModule.findClosestAncestor($el, '.todo-display') instanceof Element) {
    var $todoDisplay = domOperationModule.findClosestAncestor($el, '.todo-display');
    var $deleteButton = domOperationModule.query($todoDisplay, '.button-delete-todo');

    $deleteButton.classList.remove('button-delete-todo-show');
  }
}

function displayTabsRender() {
  var $displayOption1 = createNewElementNode('li', 'display-option');
  var $displayOption2 = createNewElementNode('li', 'display-option');
  var $displayOption3 = createNewElementNode('li', 'display-option');
  var $buttonDisplayAll = createNewElementNode('button', 'button display-all', 'All');
  var $buttonDisplayDone = createNewElementNode('button', 'button display-done', 'Done');
  var $buttonDisplayNotDone = createNewElementNode('button', 'button display-not-done', 'Not Done');

  $displayOption1.appendChild($buttonDisplayAll);
  $displayOption2.appendChild($buttonDisplayNotDone);
  $displayOption3.appendChild($buttonDisplayDone);

  domOperationModule.appendMultiChild($displayCtrl, $displayOption1, $displayOption2, $displayOption3);

  displayCtrlModule.selectAnOption($buttonDisplayAll);
}

function clickOnDisplayCtrl(event) {
  var $el = event.target;
  if ($el.matches('.display-all')) {
    displayCtrlModule.displayTodoAll($el);
  }

  if ($el.matches('.display-done')) {
    displayCtrlModule.displayTodoIsDone($el);
  }

  if ($el.matches('.display-not-done')) {
    displayCtrlModule.displayTodoIsNotDone($el);
  }
}

// ----------------------------------- logic ---------------------------------------

displayTabsRender();
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

// 使用事件委托，将三种显示状态切换的点击绑定到display-ctrl节点上
$displayCtrl.addEventListener('click', clickOnDisplayCtrl);

// 使用事件委托，将点击事件绑定到todo-list上，一个是checkbox的点击，另一个是content的点击(开启edit in place), 还有删除按钮的点击。在处理函数内部加上event.target判断
$todoList.addEventListener('click', clickOnTodo);

// 使用事件委托，将mouseover与mouseout事件绑定到todo-list，实现当鼠标悬浮以及离开todo时，显示或隐藏删除按钮的效果。在处理函数对event.target作判断
$todoList.addEventListener('mouseover', deleteButtonDisplay);
$todoList.addEventListener('mouseout', deleteButtonHidden);
