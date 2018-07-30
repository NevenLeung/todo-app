import {$todoList, $displayCtrl} from "./dom-elements";

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

const displayCtrlModule = function (domWrapper) {
  let $lastOption;

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
      const $todoNodes = [];
      $todoNodes.push(...$todoList.children);

      $todoNodes.forEach(($todo) => {
        $todo.classList.remove('todo-hidden');
      });

      selectAnOption($el);
    }
  }

  // 显示完成的todo
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

  // 显示为完成的todo
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

  return {
    getDisplayOption,
    selectAnOption,
    displayTodoAll,
    displayTodoIsDone,
    displayTodoIsNotDone
  }
};

export default displayCtrlModule;