/**
 * @module DOM element
 *
 * 存放常用的元素节点的模块
 *
 * @export {$inputForm, $displayCtrl, $todoList}
 */

// -------------------- module start -------------------

const $inputForm = document.querySelector('.input-form');
const $displayCtrl = document.querySelector('.display-ctrl');
const $todoList = document.getElementsByClassName('todo-list')[0];

export {
  $inputForm,
  $displayCtrl,
  $todoList
};