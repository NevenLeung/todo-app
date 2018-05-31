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

// ------------------------- modules --------------------------------

/**
 * domOperationModule  将常用的DOM操作进行封装
 *
 * @return {object} {appendMultiChild, hasClass, query, queryAll, findClosestAncestor, findSiblingForward, findSiblingBackward}
 *
 ******************************************************************************************
 * appendMultiChild()  将多个节点按顺序添加到parentNode，作为其子节点
 *
 * @param parentNode  父节点
 * @param childrenNodes  一个或多个待添加的子节点，多个节点用','隔开
 ******************************************************************************************
 * hasClass()  判断某个元素是否含有相应的className
 *
 * @param $el  需要判断的元素
 * @param {string} className  单个class名称
 ******************************************************************************************
 * query()  基于$el去查找第一个符合selector的元素
 *
 * @param $el  基准元素
 * @param {string} selector  合法的css选择器字符串
 ******************************************************************************************
 * queryAll()  基于$el去查找符合selector的元素集合
 *
 * @param $el  基准元素
 * @param {string} selector  合法的css选择器字符串
 ******************************************************************************************
 * findClosestAncestor()  寻找第一个拥有相应className的祖先节点
 *
 * @param $el  开始寻找的基准元素
 * @param {string} selector  单个class名称
 ******************************************************************************************
 * findSiblingForward()  向前寻找第一个拥有相应className的兄弟元素
 *
 * @param $el  开始寻找的基准元素
 * @param {string} className  单个class名称
 ******************************************************************************************
 * findSiblingBackward()  向后寻找第一个拥有相应className的兄弟元素
 *
 * @param $el  开始寻找的基准元素
 * @param {string} className  单个class名称
 ******************************************************************************************
 */

const domOperationModule = (function () {
  function appendMultiChild(parentNode, ...childrenNodes) {
    if(typeof parentNode !== 'undefined' && typeof childrenNodes !== 'undefined') {
      childrenNodes.forEach((childNode) => {
        parentNode.appendChild(childNode);
      })
    } else {
      console.log('ParentNode or childrenNodes is not defined.');
    }
  }

  function hasClass($el, className) {
    if ('classList' in $el) {
      return $el.classList.contains(className);
    }
  }

  // 将document.querySelector与element.querySelector区分开，对后者作了一些改进，基于element向子代元素查找，使得查找的结果符合预期
  function query($el, selector) {
    if (typeof $el !== 'undefined' && typeof selector !== 'undefined') {
      if ($el === document) {
        return $el.querySelector(selector);
      } else {
        const originID = $el.getAttribute('id');
        const newID = originID || 'temp';

        $el.setAttribute('id', newID);
        selector = `#${newID} ${selector}`;

        const result = $el.querySelector(selector);

        // 移除临时的id属性
        if (!originID) {
          $el.removeAttribute('id');
        }

        return result;
      }
    }
  }

  // 将document.querySelectorAll与element.querySelectorAll区分开，对后者作了一些改进，基于element向子代元素查找，使得查找的结果符合预期
  function queryAll($el, selector) {
    if (typeof $el !== 'undefined' && typeof selector !== 'undefined') {
      if ($el === document) {
        return $el.querySelectorAll(selector);
      } else {
        const originID = $el.getAttribute('id');
        const newID = originID || 'temp';

        $el.setAttribute('id', newID);
        selector = `#${newID} ${selector}`;

        const result = $el.querySelectorAll(selector);

        // 移除临时的id属性
        if (!originID) {
          $el.removeAttribute('id');
        }

        return result;
      }
    }
  }

  // $el.closest()会返回自身，这并不符合实际的使用需求，以下代码对这一点作了特殊处理
  function findClosestAncestor($el, selector) {
    if (typeof $el !== 'undefined' && typeof selector !== 'undefined') {
      if ($el.closest(selector) === $el) {
        if ($el.parentElement && $el.parentElement !== document) {
          return $el.parentElement.closest(selector);
        } else {
          return null;
        }
      } else {
        return $el.closest(selector);
      }
    }
  }

  function findSiblingForward($el, className) {
    if (typeof $el !== 'undefined' && typeof className !== 'undefined' && $el.previousElementSibling) {
      if (hasClass($el.previousElementSibling, className)) {
        return $el.previousElementSibling;
      } else {
        return findSiblingForward($el.previousElementSibling, className);
      }
    } else {
      console.log('Such a previous sibling element node is not found');
    }
  }

  function findSiblingBackward($el, className) {
    if (typeof $el !== 'undefined' && typeof className !== 'undefined' && $el.nextElementSibling) {
      if (hasClass($el.nextElementSibling, className)) {
        return $el.nextElementSibling;
      } else {
        return findSiblingBackward($el.nextElementSibling, className);
      }
    } else {
      console.log('Such a next sibling element node is not found');
    }
  }

  return {
    appendMultiChild,
    hasClass,
    query,
    queryAll,
    findClosestAncestor,
    findSiblingForward,
    findSiblingBackward
  }
})();

const todoEditInPlaceModule = (function (domWrapper) {
  let $lastEditedTodoContent;
  let lastEditedTodoData;

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
  function activatedTodoEditInPlace($el) {
    // 判断点击元素的是不是todo-content
    if (domWrapper.hasClass($el,'todo-content') && $el.style.display !== 'none') {
      // 判断是否有前一次的编辑操作
      if (typeof $lastEditedTodoContent !== 'undefined') {
        saveUnsavedEdition();
      }

      const $todoDisplay = domWrapper.findClosestAncestor($el, '.todo-display');
      const $todo = domWrapper.findClosestAncestor($todoDisplay, '.todo');

      // 判断是否已经有下一个兄弟元素，即todo-edit，防止重复添加todo-edit
      if(domWrapper.query($todo, '.todo-edit') === null) {
        $todoDisplay.classList.toggle('todo-display-hide');

        const $div = createNewElementNode('div', 'todo-edit todo-edit-show');
        const $editBar = createNewElementNode('input', 'todo-edit-bar', '',  'value', $el.textContent);
        const $saveButton =  createNewElementNode('button', 'button button-save-todo-edit', 'save');
        const $cancelButton =  createNewElementNode('button', 'button button-cancel-todo-edit', 'cancel');

        domWrapper.appendMultiChild($div,$editBar, $saveButton, $cancelButton);

        $todo.appendChild($div);
      } else {
        // 由于已经有了todo-edit，只需要改变display属性即可，无需重复创建，提高性能
        const $todoEdit = domWrapper.query($todo, '.todo-edit');
        const $todoEditBar = domWrapper.query($todoEdit, '.todo-edit-bar');
        $todoDisplay.classList.toggle('todo-display-hide');
        $todoEdit.classList.toggle('todo-edit-show');

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
   */
  function todoEditSave($el) {
    const $todoEdit = domWrapper.findClosestAncestor($el, '.todo-edit');
    const $todoEditBar = domWrapper.query($todoEdit, '.todo-edit-bar');
    const $todo = domWrapper.findClosestAncestor($todoEdit, '.todo');
    const $todoDisplay = domWrapper.query($todo, '.todo-display');
    const $todoContent = domWrapper.query($todoDisplay, '.todo-content');

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


  /**
   * todoEditCancel()
   *
   * 作为todo-edit中cancel button的事件处理方法，用于抛弃修改结果后，改变todo-display和todo-edit的display属性
   */
  function todoEditCancel($el) {
    // 如何保存一个todo未修改之前的值，用于取消操作的回滚，
    // 不需要做回滚操作，input上的值，不影响span的textContent
    const $todoEdit = domWrapper.findClosestAncestor($el, '.todo-edit');
    const $todo = domWrapper.findClosestAncestor($todoEdit, '.todo');
    const $todoDisplay = domWrapper.query($todo, '.todo-display');

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
      const $lastTodoDisplay = domWrapper.findClosestAncestor($lastEditedTodoContent, '.todo-display');
      const $lastTodo = domWrapper.findClosestAncestor($lastTodoDisplay, '.todo');
      const $lastTodoEdit = domWrapper.query($lastTodo, '.todo-edit');

      // 待保存的content应该是input中的value，而不是$todoContent中的textContent，那应该如何保存value呢？
      // 通过todo-display节点，找到todo-edit，再找到相应todo-edit-bar，因为其中input的值，只有在重新进入edit in place才会被更新，所以这时input中value就是被修改后的值
      const lastTodoContentAfterEdited = domWrapper.query($lastTodoEdit, '.todo-edit-bar').value;
      const index = data.todoList.findIndex((todo) => {
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
      id: $todoContent.dataset.id,
    };
  }

  return {
    activatedTodoEditInPlace,
    todoEditSave,
    todoEditCancel
  };

}(domOperationModule));

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
 * @returns 返回创建的元素节点
 */
function createNewElementNode(tagName, className='', content='', ...attributeData) {
  const newElement = document.createElement(tagName);
  if (content !== '') {
    newElement.textContent = content;
  }
  if (className !== '') {
    newElement.className = className;
  }

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
  const $li = createNewElementNode('li', 'todo');
  const $div = createNewElementNode('div', 'todo-display');
  const $checkbox = createNewElementNode('input', 'todo-checkbox', '',  'type', 'checkbox');
  const $todoContent = createNewElementNode('span', 'todo-content', text, 'data-is-done', 'false', 'data-id', data.todoList.length);
  const $deleteButton = createNewElementNode('button', 'button button-delete-todo', 'X');

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
    const $li = createNewElementNode('li', 'todo');
    const $div = createNewElementNode('div', 'todo-display');
    const $checkbox = createNewElementNode('input', 'todo-checkbox', '',  'type', 'checkbox');
    const $todoContent =  createNewElementNode('span', 'todo-content', todo.text, 'data-is-done', todo.isDone, 'data-id', todo.id);
    const $deleteButton = createNewElementNode('button', 'button button-delete-todo', 'X');

    if (todo.isDone) {
      // 为todo-content添加class 'todo-is-done'
      $todoContent.classList.toggle('todo-is-done');
      // 由于todo为已完成状态，需要将checkbox设置为已勾选状态
      $checkbox.setAttribute('checked', 'checked');
    }

    domOperationModule.appendMultiChild($div, $checkbox, $todoContent, $deleteButton);

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
 * clickOnTodo()
 *
 * 作为在todo上点击事件的事件处理函数，不同的点击元素会触发不同的处理事件
 */
function clickOnTodo(event) {
  const $el = event.target;
  // 判断点击的元素是不是todo-checkbox
  if (domOperationModule.hasClass($el, 'todo-checkbox')) {
    todoStatusToggle(event.target);
  }
  // 判断点击元素的是不是todo-content，是的话，开启edit in place功能
  if (domOperationModule.hasClass($el, 'todo-content')) {
    todoEditInPlaceModule.activatedTodoEditInPlace(event.target);
  }
  // 判断点击的元素是不是删除按钮
  if (domOperationModule.hasClass($el, 'button-delete-todo')) {
    deleteTodo(event.target);
  }
  // 判断点击的元素是不是save按钮
  if (domOperationModule.hasClass($el, 'button-save-todo-edit')) {
    todoEditInPlaceModule.todoEditSave(event.target);
  }
  // 判断点击的元素是不是cancel按钮
  if (domOperationModule.hasClass($el, 'button-cancel-todo-edit')) {
    todoEditInPlaceModule.todoEditCancel(event.target);
  }
}


/**
 * todoStatusToggle()
 *
 * 切换todo的完成状态，更改显示样式，更改data中的数据，用作事件处理函数
 */
function todoStatusToggle($el) {
  // 每一个todo的todo-content是checkbox的下一个同级元素
  const $todoDisplay = domOperationModule.findClosestAncestor($el, '.todo-display');
  const $todoContent = domOperationModule.query($todoDisplay, '.todo-content');
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
  const $todoDisplay = domOperationModule.findClosestAncestor($el, '.todo-display');
  const $todo = domOperationModule.findClosestAncestor($todoDisplay, '.todo');
  const $todoContent = domOperationModule.query($todoDisplay, '.todo-content');
  const id = parseInt($todoContent.dataset.id);
  const index = data.todoList.findIndex((todo) => {
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
  const $el = event.target;
  if (domOperationModule.findClosestAncestor($el, '.todo-display')) {
    const $todoDisplay = domOperationModule.findClosestAncestor($el, '.todo-display');
    const $deleteButton = domOperationModule.query($todoDisplay, '.button-delete-todo');

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
  const $el = event.target;
  if (domOperationModule.findClosestAncestor($el, '.todo-display')) {
    const $todoDisplay = domOperationModule.findClosestAncestor($el, '.todo-display');
    const $deleteButton = domOperationModule.query($todoDisplay, '.button-delete-todo');

    $deleteButton.classList.remove('button-delete-todo-show');
  }
}


// ----------------------------------- logic ---------------------------------------

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

// 使用事件委托，将点击事件绑定到todo-list上，一个是checkbox的点击，另一个是content的点击(开启edit in place), 还有删除按钮的点击。在处理函数内部加上event.target判断
$todoList.addEventListener('click', clickOnTodo);

// 使用事件委托，将mouseover与mouseout事件绑定到todo-list，实现当鼠标悬浮以及离开todo时，显示或隐藏删除按钮的效果。在处理函数对event.target作判断
$todoList.addEventListener('mouseover', deleteButtonDisplay);
$todoList.addEventListener('mouseout', deleteButtonHidden);
