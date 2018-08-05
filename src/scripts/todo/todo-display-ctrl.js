/**
 * @module Display Ctrl Module
 *
 * todo的显示选项控制
 *
 * @export {Object} {getDisplayOption, selectAnOption, displayTodoAll, displayTodoIsDone, displayTodoIsNotDone}
 */

// -------------------- module start -------------------

import {$todoList, $displayCtrl} from "../DOM/DOM-elements";
import DOM_OperationModule from '../DOM/DOM-operations.js';


let $lastOption;

/**
 * @function getDisplayOption()
 *
 * 获取当前的display option
 *
 * @return {Element} $lastOption  当前的display option节点
 */
function getDisplayOption() {
  return $lastOption;
}

/**
 * @function selectAnOption()
 *
 * 选中一个display option，对option tab的样式进行更改
 *
 * @param $el 传入一个tab的button节点
 */
function selectAnOption($el) {
  if (typeof $lastOption === 'undefined') {
    $lastOption = DOM_OperationModule.query($displayCtrl, '.display-all');
    $lastOption.classList.add('selected');
  } else {
    $lastOption.classList.remove('selected');
    $el.classList.add('selected');

    $lastOption = $el;
  }
}

/**
 * @function displayTodoAll()
 *
 * 显示全部todo
 *
 * @param $el 传入 .display-all 节点
 */
function displayTodoAll($el) {
  if ($el.matches('.display-all')) {
    const $todoNodes = [];
    $todoNodes.push(...$todoList.children);

    $todoNodes.forEach(($todo) => {
      $todo.classList.remove('todo-hidden');
    });

    selectAnOption($el);
  }
}

/**
 * @function displayTodoIsDone()
 *
 * 显示已完成的todo
 *
 * @param $el 传入 .display-done 节点
 */
function displayTodoIsDone($el) {
  if ($el.matches('.display-done')) {
    const $todoNodes = [];
    $todoNodes.push(...$todoList.children);

    $todoNodes.forEach(($todo) => {
      if ($todo.dataset.isDone === 'true') {
        $todo.classList.remove('todo-hidden');
      } else {
        $todo.classList.add('todo-hidden');
      }
    });

    selectAnOption($el);
  }
}

/**
 * @function displayTodoIsNotDone()
 *
 * 显示未完成的todo
 *
 * @param $el 传入 .display-not-done 节点
 */
function displayTodoIsNotDone($el) {
  if ($el.matches('.display-not-done')) {
    const $todoNodes = [];
    $todoNodes.push(...$todoList.children);

    $todoNodes.forEach(($todo) => {
      if ($todo.dataset.isDone === 'true') {
        $todo.classList.add('todo-hidden');
      } else {
        $todo.classList.remove('todo-hidden');
      }
    });

    selectAnOption($el);
  }
}

export default {
  getDisplayOption,
  selectAnOption,
  displayTodoAll,
  displayTodoIsDone,
  displayTodoIsNotDone
};