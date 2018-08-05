/**
 * @module todoEditInPlaceModule
 *
 * 就地编辑(edit in place)的相关功能
 *
 * @export {Object} {activatedTodoEditInPlace, saveTodoEdit, cancelTodoEdit}
 */

// --------------- module start ---------------------

import { createNewElementNode } from '../utility/general-functions.js';
import DOM_OperationModule from '../DOM/DOM-operations.js';
import indexedDBModule from '../utility/indexedDB.js';

const todoStore = function () {
  return indexedDBModule('TodoApp', 1, 'todo');
};

let $lastEditedTodo;

/**
 * @function activatedTodoEditInPlace()
 *
 * 开启edit in place功能
 *
 * 响应todo-content被点击时的一系列操作，比如重置todo显示内容，todo-display与todo-edit的display属性的toggle
 *
 * @param $el 传入 .todo-content 节点
 *
 * DOM 结构
 *
 <ul class='todo-list'>
   <li class="todo">
     <div class='todo-display'>
       <span class='todo-drag-handle'></span>
       <div class='todo-main'>
         <label class='todo-checkbox'>
         <input type='checkbox' class='hidden-checkbox'>
         <span class='display-checkbox'></span>
       </label>
       <span class='todo-content'></span>
       </div>
       <button class='button button-delete-todo'>X</button>
     </div>
     <div class='todo-edit'>
       <div class='input-bar'>
         <input type='text' class='todo-edit-bar'>
         <span class='focus-border'></span>
       </div>
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
    if (typeof $lastEditedTodo !== 'undefined') {
      saveUnsavedEdition();
    }

    const $todoDisplay = DOM_OperationModule.findClosestAncestor($el, '.todo-display');
    const $todo = DOM_OperationModule.findClosestAncestor($todoDisplay, '.todo');

    // 判断是否已经有下一个兄弟元素，即todo-edit，防止重复添加todo-edit
    if(DOM_OperationModule.query($todo, '.todo-edit') === null) {
      $todoDisplay.classList.add('todo-display-hidden');

      const $div = createNewElementNode('div', 'todo-edit todo-edit-show');
      const $inputBar = createNewElementNode('div', 'input-bar');
      const $editBar = createNewElementNode('input', 'todo-edit-input', '', 'type', 'text', 'value', $el.textContent);
      const $focusBorder = createNewElementNode('span', 'focus-border');
      const $saveButton =  createNewElementNode('button', 'button button-save-todo-edit', 'save');
      const $cancelButton =  createNewElementNode('button', 'button button-cancel-todo-edit', 'cancel');

      DOM_OperationModule.appendMultiChild($inputBar, $editBar, $focusBorder);

      DOM_OperationModule.appendMultiChild($div, $inputBar, $saveButton, $cancelButton);

      $todo.appendChild($div);
    } else {
      // 由于已经有了todo-edit，只需要改变display属性即可，无需重复创建，提高性能
      const $todoEdit = DOM_OperationModule.query($todo, '.todo-edit');
      const $todoEditBar = DOM_OperationModule.query($todoEdit, '.todo-edit-input');
      $todoDisplay.classList.add('todo-display-hidden');
      $todoEdit.classList.add('todo-edit-show');

      // 确保input中的value与todo的content相同
      $todoEditBar.value = $el.textContent;
    }

    // 记录当前被点击的todo节点，todo节点中包含有数据的id值（data-id）
    $lastEditedTodo = $todo;
  }
}

/**
 * @function saveTodoEdit()
 *
 * 保存修改，并关闭edit in place功能
 *
 * 作为todo-edit中save button的事件处理方法，用于保存content的修改，修改todo-content的内容，
 * 以及将修改更新到data，以及改变todo-display和todo-edit的display属性
 *
 * @param $el 传入 .button-save-todo-edit 节点
 */
async function saveTodoEdit($el) {
  if ($el.matches('.button-save-todo-edit')) {
    const $todo = DOM_OperationModule.findClosestAncestor($el, '.todo');
    const $todoEdit = DOM_OperationModule.findClosestAncestor($el, '.todo-edit');
    const $todoEditBar = DOM_OperationModule.query($todoEdit, '.todo-edit-input');
    const $todoDisplay = DOM_OperationModule.query($todo, '.todo-display');
    const $todoContent = DOM_OperationModule.query($todoDisplay, '.todo-content');

    // 不允许修改后，todo的内容为空，或者为纯空白字符
    if ($todoEditBar.value.trim().length === 0) {
      alert('The content of todo should not be empty. Please write something you need to do.');
    } else {
      const id = parseInt($todo.dataset.id);
      const data = {
        text: $todoEditBar.value
      };

      try {
        const result = await todoStore().update(id, data);
        if (result) {
          $todoContent.textContent = $todoEditBar.value;

          $todoDisplay.classList.remove('todo-display-hidden');
          $todoEdit.classList.remove('todo-edit-show');

          $lastEditedTodo = undefined;
        }
      }
      catch (err) {
        console.error(err);
      }
    }
  }
}

/**
 * @function cancelTodoEdit()
 *
 * 放弃修改，并关闭edit in place功能
 *
 * 作为todo-edit中cancel button的事件处理方法，用于抛弃修改结果后，改变todo-display和todo-edit的display属性
 *
 * @param $el 传入 .button-cancel-todo-edit 节点
 */
function cancelTodoEdit($el) {
  if ($el.matches('.button-cancel-todo-edit')) {
    // 如何保存一个todo未修改之前的值，用于取消操作的回滚，
    // 不需要做回滚操作，input上的值，不影响span的textContent
    const $todoEdit = DOM_OperationModule.findClosestAncestor($el, '.todo-edit');
    const $todoDisplay = DOM_OperationModule.findSibling($todoEdit, '.todo-display', 'forward');

    $todoDisplay.classList.remove('todo-display-hidden');
    $todoEdit.classList.remove('todo-edit-show');

    $lastEditedTodo = undefined;
  }
}

/**
 * @function saveUnsavedEdition()
 *
 * 每次开启edit in place，先尝试执行该函数
 *
 * 作用：
 * - 当已经有一个todo处于可编辑状态，此时点击另一个todo，需要保存前一个todo的数据，还需要将数据修改进行保存，同时进行class toggle
 * - 简单来说是，为了编辑todo时的操作互斥，同时会对未点击save按钮的修改进行保存
 */
async function saveUnsavedEdition() {
  if (typeof $lastEditedTodo !== 'undefined') {
    const $todoDisplay = DOM_OperationModule.query($lastEditedTodo, '.todo-display');
    const $todoContent = DOM_OperationModule.query($todoDisplay, '.todo-content');
    const $todoEdit = DOM_OperationModule.query($lastEditedTodo, '.todo-edit');

    // 待保存的content应该是input中的value，而不是$todoContent中的textContent，那应该如何保存value呢？
    // 通过todo-display节点，找到todo-edit，再找到相应todo-edit-bar，因为其中input的值，只有在重新进入edit in place才会被更新，所以此时input中value仍然是被修改后的值
    const todoContentAfterEdited = DOM_OperationModule.query($todoEdit, '.todo-edit-input').value;
    const id = parseInt($lastEditedTodo.dataset.id);
    const data = {
      text: todoContentAfterEdited
    };

    try {
      const result = await todoStore().update(id, data);
      if (result) {
        // 保存修改
        $todoContent.textContent = todoContentAfterEdited;

        // 让前一个未保存的todo恢复正常的显示
        $todoDisplay.classList.remove('todo-display-hidden');
        $todoEdit.classList.remove('todo-edit-show');
      }

    }
    catch (err) {
      console.error(err);
    }
  }
}

export default {
  activatedTodoEditInPlace,
  saveTodoEdit,
  cancelTodoEdit
};
