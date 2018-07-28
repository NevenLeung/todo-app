'use strict';

// import domOperationModule from './dom.js';
import indexedDBModule from './indexedDBModule.js';

import '../styles/normalize.css';
import '../styles/main.css';

// get the DOM elements

const $inputForm = document.querySelector('.input-form');
const $displayCtrl = document.querySelector('.display-ctrl');
// const $todoList = document.querySelector('.todo-list');
const $todoList = document.getElementsByClassName('todo-list')[0];
// data example

// const data = {
//   "todoList": [
//     {
//       "_id": 0,
//       "text": "Buy some fruit after school",
//       "isDone": false
//     },
//     {
//       "_id": 1,
//       "text": "Read the CLRS book to the page of 178",
//       "isDone": false
//     },
//     {
//       "_id": 2,
//       "text": "Discuss the Network problem with Bill",
//       "isDone": true
//     },
//     {
//       "_id": 3,
//       "text": "Finish the assignment of Database course",
//       "isDone": false
//     }
//   ]
// };

// polyfills
(function () {
  // Element.matches() - https://developer.mozilla.org/zh-CN/docs/Web/API/Element/matches
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        let matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {
        }
        return i > -1;
      };
  }

  // Element.closest() - https://developer.mozilla.org/zh-CN/docs/Web/API/Element/closest
  if (!Element.prototype.closest)
    Element.prototype.closest = function (s) {
      let el = this;
      if (!document.documentElement.contains(el)) return null;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement;
      } while (el !== null);
      return null;
    };
})();

// ------------------------- modules --------------------------------

/**
 * @module indexedDBModule  使用indexedDB管理数据
 *
 * @param {String} dbName  数据库名称
 * @param {Number} version  数据库版本
 * @param {String} objectStorage  对象存储空间（相当于table name）
 * @param {Function} afterDataBaseConnected  需要在数据库初始化完成后执行的函数，一般为应用的初始化函数
 *
 * @return {Object} {getAll, get, create, update, delete, removeAll}
 *
 ---------------------------------------------------------------------------------------
 * @method getAll()  获取todo object storage中的全部记录
 *
 * @return  返回一个Promise
 *
 * @resolve {Array}  一个包含数据记录的数组对象
 * @reject {Object}  获取过程中的异常信息
 *
 ---------------------------------------------------------------------------------------
 * @method get(query)  查找_id为query的数据记录
 *
 * @param {Number} query  数据记录的_id值，正整数
 *
 * @return  返回一个Promise
 *
 * @resolve {Object|Undefined}  查找到的数据对象，或者未查找到相应的数据记录时为undefined
 * @reject {Object}  查找过程中的异常信息
 * ---------------------------------------------------------------------------------------
 * @method create(data)  创建新的数据记录（无需传入_id值，数据库会采用自增的主值）
 *
 * @param {Object} data 数据记录对象，包含除_id以外的其他对象属性
 *                      如果传入的_id值与数据当前object storage中的数据记录相同，会抛出错误
 *
 * @return  返回一个Promise
 *
 * @resolve {Object}  仅包含新增的数据记录的_id属性的对象
 * @reject {Object}  新增数据记录过程中的异常信息
 * ---------------------------------------------------------------------------------------
 * @method update(query， data)  更新_id为query的数据记录
 *                               根据data更新数据库已有的记录，覆盖已有的属性，新增原本没有的属性
 *                               如果传入的_id不存在于数据库的数据记录中，不会创建新的数据记录
 *
 * @param {Number} query  数据记录的_id值，正整数
 * @param {Object} data  需要更新的数据对象，仅包含需要更新的部分
 *
 * @return  返回一个Promise
 *
 * @resolve {Object}  仅包含更新的数据记录的_id属性的对象
 * @reject {Object}  更新数据记录过程中的异常信息
 * ---------------------------------------------------------------------------------------
 * @method delete(query)  删除_id为query的数据记录
 *
 * @param {Number} query  数据记录的_id值，正整数
 *
 * @return  返回一个Promise
 *
 * @resolve {String}  成功删除_id为query的数据记录的消息
 * @reject {Object}  删除数据记录过程中的异常信息
 * ---------------------------------------------------------------------------------------
 * @method removeAll()  删除todo object storage中的全部记录
 *
 * @return  返回一个Promise
 *
 * @resolve {String}  成功删除所有数据记录的消息
 * @reject {Object}  删除数据记录过程中的异常信息
 */
// const indexedDBModule = function (dbName, version, objectStorage, afterDataBaseConnected) {
//   const dbOpenRequest = window.indexedDB.open(dbName, version);
//
//   // 模块中的局部变量，用于存储连接成功的数据库连接
//   let db;
//
//   dbOpenRequest.onerror = function (event) {
//     console.log('Something bad happened while trying to open: ' + event.target.errorCode);
//     reject(event.target);
//   };
//
//   dbOpenRequest.onupgradeneeded = function () {
//     const db = dbOpenRequest.result;
//     // 创建存储空间，使用自增的主值
//     const store = db.createObjectStore(objectStorage, {
//       keyPath: '_id',
//       autoIncrement: true
//     });
//   };
//
//   dbOpenRequest.onsuccess = function () {
//     db = dbOpenRequest.result;
//     afterDataBaseConnected();
//   };
//
//   function useIndexedDB(action, dataParam) {
//     return new Promise(function (resolve, reject) {
//       // 创建事务
//       const transaction = db.transaction(objectStorage, 'readwrite');
//       // 在事务上得到相应的存储空间，用于数据的读取与修改
//       const objectStore = transaction.objectStore(objectStorage);
//
//       transaction.onabort = function (event) {
//         console.log('tx has been aborted.');
//         console.log(event.target);
//       };
//
//       let txOperationRequest;
//
//       switch (action) {
//         case 'getAll':
//           txOperationRequest = objectStore.getAll();
//           break;
//         case 'get':
//           txOperationRequest = objectStore.get(dataParam);
//           break;
//         case 'post':
//           txOperationRequest = objectStore.add(dataParam);
//           break;
//         case 'put':
//           txOperationRequest = objectStore.put(dataParam);
//           break;
//         case 'delete':
//           txOperationRequest = objectStore.delete(dataParam);
//           break;
//         case 'removeAll':
//           txOperationRequest = objectStore.clear();
//       }
//
//       txOperationRequest.onerror = function (event) {
//         console.log(event.target);
//         reject(event.target);
//       };
//
//       txOperationRequest.onsuccess = function (event) {
//         switch (action) {
//           case 'getAll':
//             resolve(txOperationRequest.result);
//             break;
//           case 'get':
//             resolve(txOperationRequest.result);
//             break;
//           case 'post':
//             console.log(`Item with _id ${txOperationRequest.result} has been added.`);
//             resolve({_id: txOperationRequest.result});
//             break;
//           case 'put':
//             console.log(`Item with _id ${txOperationRequest.result} has been updated.`);
//             resolve({_id: txOperationRequest.result});
//             break;
//           case 'delete':
//             console.log('Item has been removed.');
//             resolve('Item has been removed.');
//             break;
//           case 'removeAll':
//             console.log('All items have been removed.');
//             resolve('All items have been removed.');
//         }
//       };
//     });
//   }
//
//   return {
//     getAll: function () {
//       return useIndexedDB('getAll', '');
//     },
//     get: function (query) {
//       return useIndexedDB('get', query);
//     },
//     create: function (data) {
//       return useIndexedDB('post', data);
//     },
//     update: async function (query, data) {
//       try {
//         const queryResult = await useIndexedDB('get', query);
//         if (typeof queryResult !== 'undefined') {
//           const newData = Object.assign(queryResult, data);
//           return useIndexedDB('put', newData);
//         } else {
//           console.log('Can not find the data according to the query');
//         }
//       }
//       catch (err) {
//         console.error(err);
//       }
//     },
//     // put: function (data) {
//     //   return useIndexedDB('put', data);
//     // },
//     delete: function (query) {
//       return useIndexedDB('delete', query);
//     },
//     removeAll: function () {
//       return useIndexedDB('removeAll', '');
//     },
//   }
// };

// 创建TodoApp的数据库管理实例
const todoStore = indexedDBModule('TodoApp', 1, 'todo', afterDataBaseConnected);

/**
 * @module domOperationModule  将常用的DOM操作进行封装
 *
 * @return {object} {appendMultiChild, query, queryAll, findClosestAncestor, findSibling, findSiblings}
 *
 ---------------------------------------------------------------------------------------
 * @method appendMultiChild(parentNode, ...childrenNodes)  将多个节点按顺序添加到parentNode，作为其子节点
 *
 * @param parentNode  父节点
 * @param childrenNodes  一个或多个待添加的子节点，多个节点用','隔开
 *
 ---------------------------------------------------------------------------------------
 * @method query($el, selector)  基于$el去查找第一个符合selector的元素
 *
 * @param $el  基准元素
 * @param selector {string} 合法的css选择器字符串
 *
 ---------------------------------------------------------------------------------------
 * @method queryAll($el, selector)  基于$el去查找符合selector的元素集合
 *
 * @param $el  基准元素
 * @param selector {string} 合法的css选择器字符串
 *
 ---------------------------------------------------------------------------------------
 * @method findClosestAncestor($el, selector)  寻找第一个符合selector的祖先节点
 *
 * @param $el  开始寻找的基准元素
 * @param selector {string} 合法的css选择器字符串
 *
 ---------------------------------------------------------------------------------------
 * @method findSibling($el, selector, option = 'backward')  寻找第一个符合selector的兄弟元素
 *
 * @param $el  开始寻找的基准元素
 * @param selector {string} 合法的css选择器字符串
 * @param option {string}  查找选项 forward(default)|backward
 *
 ---------------------------------------------------------------------------------------
 * @method findSiblings($el, selector, option = 'all')  寻找符合selector的兄弟元素集合(排除$el本身)
 *
 * @param $el  开始寻找的基准元素
 * @param selector {string} 合法的css选择器字符串
 * @param option {string}  查找选项 all(default)|forward|backward
 */
const domOperationModule = (function () {
  // 将多个节点按顺序添加到parentNode，作为其子节点
  function appendMultiChild(parentNode, ...childrenNodes) {
    try {
      if (parentNode instanceof Node && childrenNodes.length !== 0) {
        childrenNodes.forEach((childNode) => {
          if (childNode instanceof Node) {
            parentNode.appendChild(childNode);
          } else {
            throw new Error(`${childNode} is not of type 'Node'`);
          }
        })
      } else {
        console.log('ParentNode or childrenNodes is not defined.');
      }
    }
    catch (ex) {
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
    catch (ex) {
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
    catch (ex) {
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
    }
    catch (ex) {
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
  function findSibling($el, selector, option = 'backward') {
    try {
      if (option === 'backward') {
        return findSiblingBackward($el, selector);
      } else if (option === 'forward') {
        return findSiblingForward($el, selector)
      } else {
        return null;
      }
    }
    catch (ex) {
      console.error(ex);
    }
  }

  // 寻找符合selector的兄弟元素集合(排除$el本身)
  function findSiblings($el, selector, option = 'all') {
    try {
      if ($el instanceof Element && typeof selector === 'string' && $el.parentElement instanceof Element) {
        let result = [];
        if (option === 'all') {
          let index;
          result.push(...$el.parentElement.children);
          index = result.indexOf($el);
          // 移除$el本身
          result.splice(index, 1);

          result = result.filter((el) => {
            return el.matches(selector);
          });

          return result;
        } else if (option === 'backward') {
          let index;
          result.push(...$el.parentElement.children);
          index = result.indexOf($el);
          // 从头开始移除sibling，直到把$el也一起移除
          result.splice(0, index + 1);

          result = result.filter((el) => {
            return el.matches(selector);
          });

          return result;
        } else if (option === 'forward') {
          let index;
          result.push(...$el.parentElement.children);
          index = result.indexOf($el);
          // 从$el开始移除，直到把$el后面的所有sibling全部移除
          result.splice(index, result.length - index);

          result = result.filter((el) => {
            return el.matches(selector);
          });

          return result;
        } else {
          return null;
        }
      }

    }
    catch (ex) {
      console.error(ex);
    }
  }

  return {
    appendMultiChild,
    query,
    queryAll,
    findClosestAncestor,
    findSibling,
    findSiblings
  }
})();

/**
 * @module todoEditInPlaceModule 就地编辑(edit in place)的相关功能
 *
 * @return {Object} {activatedTodoEditInPlace, saveTodoEdit, cancelTodoEdit}
 *
 ---------------------------------------------------------------------------------------
 * @method activatedTodoEditInPlace($el) 开启edit in place功能
 *
 * @param $el 传入todo-content节点
 *
 ---------------------------------------------------------------------------------------
 * @method saveTodoEdit($el) 保存修改，并关闭edit in place功能
 *
 * @param $el 传入button-save-todo-edit节点
 *
 ---------------------------------------------------------------------------------------
 * @method cancelTodoEdit($el) 放弃修改，并关闭edit in place功能
 *
 * @param $el 传入button-cancel-todo-edit节点
 */
const todoEditInPlaceModule = (function (domWrapper) {
  let $lastEditedTodo;

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
         <div class='todo-main'>
           <span class='todo-drag-handle'></span>
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

      const $todoDisplay = domWrapper.findClosestAncestor($el, '.todo-display');
      const $todo = domWrapper.findClosestAncestor($todoDisplay, '.todo');

      // 判断是否已经有下一个兄弟元素，即todo-edit，防止重复添加todo-edit
      if(domWrapper.query($todo, '.todo-edit') === null) {
        $todoDisplay.classList.add('todo-display-hidden');

        const $div = createNewElementNode('div', 'todo-edit todo-edit-show');
        const $inputBar = createNewElementNode('div', 'input-bar');
        const $editBar = createNewElementNode('input', 'todo-edit-input', '', 'type', 'text', 'value', $el.textContent);
        const $focusBorder = createNewElementNode('span', 'focus-border');
        const $saveButton =  createNewElementNode('button', 'button button-save-todo-edit', 'save');
        const $cancelButton =  createNewElementNode('button', 'button button-cancel-todo-edit', 'cancel');

        domOperationModule.appendMultiChild($inputBar, $editBar, $focusBorder);

        domWrapper.appendMultiChild($div, $inputBar, $saveButton, $cancelButton);

        $todo.appendChild($div);
      } else {
        // 由于已经有了todo-edit，只需要改变display属性即可，无需重复创建，提高性能
        const $todoEdit = domWrapper.query($todo, '.todo-edit');
        const $todoEditBar = domWrapper.query($todoEdit, '.todo-edit-input');
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
   * saveTodoEdit()
   *
   * 作为todo-edit中save button的事件处理方法，用于保存content的修改，修改todo-content的内容，
   * 以及将修改更新到data，以及改变todo-display和todo-edit的display属性
   *
   * @param $el button-save-todo-edit节点
   */
  async function saveTodoEdit($el) {
    if ($el.matches('.button-save-todo-edit')) {
      const $todo = domWrapper.findClosestAncestor($el, '.todo');
      const $todoEdit = domWrapper.findClosestAncestor($el, '.todo-edit');
      const $todoEditBar = domWrapper.query($todoEdit, '.todo-edit-input');
      const $todoDisplay = domWrapper.query($todo, '.todo-display');
      const $todoContent = domWrapper.query($todoDisplay, '.todo-content');

      // 不允许修改后，todo的内容为空，或者为纯空白字符
      if ($todoEditBar.value.trim().length === 0) {
        alert('The content of todo should not be empty. Please write something you need to do.');
      } else {
        const id = parseInt($todo.dataset.id);
        const data = {
          text: $todoEditBar.value
        };

        try {
          const result = await todoStore.update(id, data);
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
   * cancelTodoEdit()
   *
   * 作为todo-edit中cancel button的事件处理方法，用于抛弃修改结果后，改变todo-display和todo-edit的display属性
   *
   * @param $el button-cancel-todo-edit节点
   */
  function cancelTodoEdit($el) {
    if ($el.matches('.button-cancel-todo-edit')) {
      // 如何保存一个todo未修改之前的值，用于取消操作的回滚，
      // 不需要做回滚操作，input上的值，不影响span的textContent
      const $todoEdit = domWrapper.findClosestAncestor($el, '.todo-edit');
      const $todoDisplay = domWrapper.findSibling($todoEdit, '.todo-display', 'forward');

      $todoDisplay.classList.remove('todo-display-hidden');
      $todoEdit.classList.remove('todo-edit-show');

      $lastEditedTodo = undefined;
    }
  }

  /**
   * saveUnsavedEdition()
   *
   * 每次开启edit in place，先尝试执行该函数
   *
   * 作用：
   * - 当已经有一个todo处于可编辑状态，此时点击另一个todo，需要保存前一个todo的数据，还需要将数据修改进行保存，同时进行class toggle
   * - 简单来说是，为了编辑todo时的操作互斥，同时会对未点击save按钮的修改进行保存
   */
  async function saveUnsavedEdition() {
    if (typeof $lastEditedTodo !== 'undefined') {
      const $todoDisplay = domWrapper.query($lastEditedTodo, '.todo-display');
      const $todoContent = domWrapper.query($todoDisplay, '.todo-content');
      const $todoEdit = domWrapper.query($lastEditedTodo, '.todo-edit');

      // 待保存的content应该是input中的value，而不是$todoContent中的textContent，那应该如何保存value呢？
      // 通过todo-display节点，找到todo-edit，再找到相应todo-edit-bar，因为其中input的值，只有在重新进入edit in place才会被更新，所以此时input中value仍然是被修改后的值
      const todoContentAfterEdited = domWrapper.query($todoEdit, '.todo-edit-input').value;
      const id = parseInt($lastEditedTodo.dataset.id);
      const data = {
        text: todoContentAfterEdited
      };

      try {
        const result = await todoStore.update(id, data);
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

  return {
    activatedTodoEditInPlace,
    saveTodoEdit,
    cancelTodoEdit
  };

})(domOperationModule);

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
const displayCtrlModule = (function (domWrapper) {
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

})(domOperationModule);

/**
 * sortable  function for sortable list
 *
 * @param rootEl  需要设置为draggable的元素的直接父元素
 * @param handleSelector  鼠标点击符合handleSelector的元素，才会触发拖拽事件
 * @param dndSelector  符合dndSelector的元素，才能进行排序，防止放置到预期外的位置上
 * @param onUpdate  在拖放完成后，会触发该回调函数。在元素原地拾起，并在该元素上释放，不会触发该回调函数
 */
function sortable(rootEl, handleSelector, dndSelector, onUpdate){
  let dragEl, nextEl, mouseDownEl, clientYBefore, isMouseMoveDown, sortedFlag, positionBefore, positionAfter;

  // make all children draggable
  let sortingList = [];
  sortingList.push(...rootEl.children);

  sortingList.forEach((itemEl) => {
    itemEl.draggable = true;
    itemEl.dataset.order = sortingList.indexOf(itemEl);
  });

  // Sorting start
  rootEl.addEventListener('mousedown', _onMouseDown, false);
  rootEl.addEventListener('dragstart', _onDragStart, false);

  function _onMouseDown(evt) {
    mouseDownEl = evt.target;
  }

  function _onDragStart(evt) {

    if (mouseDownEl.matches(handleSelector)) {
      // Remember the element that will move
      dragEl = evt.target;
      // Remember the nextSibling for judging valid movement
      nextEl = dragEl.nextSibling;

      // 使用sortingList作为判断节点位置初始位置的依据
      sortingList = [];
      sortingList.push(...rootEl.children);

      // 使用sortingList中的位置，而不使用rootEl中的位置，是因为假如鼠标移动得太快，positionBefore的值有一定几率会是错误的。
      // 在dragover过程中如果很快的完成了节点插入，这就会影响到了positionBefore的值并不是一开始的位置值，而变成插入位置的值。
      // 同时也就使得了后续其他节点位置不能正确的更新。
      // 上面的这个解释不一定完全正确，但确实避免了positionBefore错误的情况。
      positionBefore = sortingList.indexOf(dragEl);

      // Limit the type of dragging
      evt.dataTransfer.effectAllowed = 'move';

      // Text未被使用
      evt.dataTransfer.setData('Text', dragEl.textContent);

      // We are writing about events with dnd
      rootEl.addEventListener('dragover', _onDragOver, false);
      rootEl.addEventListener('dragend', _onDragEnd, false);

      dragEl.classList.add('grabbing');
    } else {
      evt.preventDefault();
    }
  }

  // Function responsible for sorting, the dragEl is hovering above the target element
  function _onDragOver(evt) {
    sortedFlag = false;
    const target = evt.target;

    // dragover的target有可能是item中的其他元素，或者item本身。element.closest()包括元素本身的这种情况。
    let dropPlace = target.closest(dndSelector);

    // 当item已经被移动另一个位置，但鼠标原地并未释放时，dropPlace和dragEl是同一个元素，这时不再重复触发节点插入。
    if(dropPlace && dropPlace !== dragEl){
      // use evt.preventDefault() to allow drop
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'move';

      isMouseMoveDown = evt.clientY >= clientYBefore;

      // 从上到下，插入到target当前的位置
      if (isMouseMoveDown && target.nextSibling && !sortedFlag) {
        rootEl.insertBefore(dragEl, dropPlace.nextSibling);
        sortedFlag = true;
      }

      // 从下到上，插入到target的前一个位置
      if (!isMouseMoveDown && !sortedFlag) {
        rootEl.insertBefore(dragEl, dropPlace);
        sortedFlag = true;
      }

      // 保存当前的鼠标纵坐标，用作之后判断鼠标移动方向
      clientYBefore = evt.clientY;
    }
  }

  // End of Sorting
  function _onDragEnd(evt) {
    evt.preventDefault();

    dragEl.classList.remove('grabbing');

    rootEl.removeEventListener('dragover', _onDragOver, false);
    rootEl.removeEventListener('dragend', _onDragEnd, false);

    // 防止鼠标拾起之后，又原地放开，减少不必要的更新操作
    if (nextEl !== dragEl.nextSibling) {
      positionAfter = [].indexOf.call(rootEl.children, dragEl);

      console.log(`positionBefore: ${positionBefore}, positionAfter: ${positionAfter}`);

      onUpdate(positionBefore, positionAfter, undefined, rootEl, isMouseMoveDown);
    }
  }
}

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
 * stringToBoolean()  用于将作为DOM节点属性时被转换为字符串的true与false值，转换为相应的布尔值
 *
 * @param str 'true' | 'false' boolean like string
 * @return {boolean}
 */
function stringToBoolean(str) {
  if (typeof str === 'string') {
    return str === 'true';
  }
}

/**
 * addTodo()
 *
 * 添加一条新的todo，同时将一个新的todo对象的加入data.todoList数组中
 *
 * @param text todo的文本内容
 */
async function addTodo(text) {
  const data = {
    text: text,
    isDone: false,
    order: $todoList.children.length
  };

  try {
    const result = await todoStore.create(data);
    if (result) {
      // 因为result只包含一个_id值，所以order直接使用提交时的order值
      const $li = createNewElementNode('li', 'todo stretch-fade', '', 'draggable', 'true', 'data-is-done', 'false', 'data-id', result._id, 'data-order', data.order);
      const $todoDisplay = createNewElementNode('div', 'todo-display');
      const $todoMain = createNewElementNode('div', 'todo-main');
      const $dragHandle = createNewElementNode('span', 'todo-drag-handle', '.. .. ..');
      const $todoCheckbox = createNewElementNode('label', 'todo-checkbox');
      const $hiddenCheckbox = createNewElementNode('input', 'hidden-checkbox', '',  'type', 'checkbox');
      const $displayCheckbox = createNewElementNode('span', 'display-checkbox');
      const $todoContent = createNewElementNode('span', 'todo-content', text);
      const $deleteButtonWrapper = createNewElementNode('div', 'delete-button-wrapper ');
      const $deleteButton = createNewElementNode('button', 'button button-delete-todo');
      const textNode = document.createTextNode(' ');

      domOperationModule.appendMultiChild($todoCheckbox, $hiddenCheckbox, $displayCheckbox);

      // 将checkbox和todo-content、delete-button节点分别添加到div节点，作为其子节点
      domOperationModule.appendMultiChild($todoMain, $todoCheckbox, $todoContent);

      $deleteButtonWrapper.appendChild($deleteButton);

      domOperationModule.appendMultiChild($todoDisplay, $dragHandle, $todoMain, $deleteButtonWrapper);

      $li.appendChild($todoDisplay);

      // 把li添加到todo-list上
      domOperationModule.appendMultiChild($todoList, $li, textNode);

      // 每个setTimeout的延时时间大致与前一个动画的持续时间相同
      setTimeout(() => {
        $todoDisplay.classList.add('show-todo');
      }, 20);

      // setTimeout(() => {
      //   $todoContent.classList.add('show-content');
      // }, 200);

    } else {
      console.log('Data creation is failed');
    }
  }
  catch (err) {
    console.error(err);
  }

}

/**
 * sortTodoInAscendingOrder()
 *
 * 将todoList数组中的todo根据order从小到大排列
 *
 * @param {Array} list  todo list array object
 */
function sortTodoInAscendingOrder(list) {
  if (Array.isArray(list)) {
    list.sort(function (prev, next) {
      return prev.order - next.order;
    })
  }
}

/**
 * renderTodoList()
 *
 * 渲染todoList，并给相应的节点加上合适的属性
 *
 * @param {Array} data  一个包含todo数据的数组
 *
 * DOM 结构
 *
 <ul class="todo-list">
   <li class='todo'>
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
   </li>
 </ul>
 *
 */
function renderTodoList(data) {
  // 根据order属性，对todo进行从小到大排序
  sortTodoInAscendingOrder(data);

  data.forEach(function (todo) {
    // 由sortable()对初始化时的todo节点，写入data-order，因此data-order不在这里添加
    const $li = createNewElementNode('li', 'todo stretch-fade', '', 'data-is-done', todo.isDone, 'data-id', todo._id);
    const $todoDisplay = createNewElementNode('div', 'todo-display show-todo');
    const $todoMain = createNewElementNode('div', 'todo-main');
    const $dragHandle = createNewElementNode('span', 'todo-drag-handle', '.. .. ..');
    const $todoCheckbox = createNewElementNode('label', 'todo-checkbox');
    const $hiddenCheckbox = createNewElementNode('input', 'hidden-checkbox', '',  'type', 'checkbox');
    const $displayCheckbox = createNewElementNode('span', 'display-checkbox');
    const $todoContent = createNewElementNode('span', 'todo-content', todo.text);
    const $deleteButtonWrapper = createNewElementNode('div', 'delete-button-wrapper ');
    const $deleteButton = createNewElementNode('button', 'button button-delete-todo');
    const textNode = document.createTextNode(' ');

    if (todo.isDone) {
      // 为todo-content添加class 'todo-is-done'
      $todoContent.classList.add('todo-is-done');
      // 由于todo为已完成状态，需要将checkbox设置为已勾选状态
      $hiddenCheckbox.setAttribute('checked', 'checked');
    }

    domOperationModule.appendMultiChild($todoCheckbox, $hiddenCheckbox, $displayCheckbox);

    domOperationModule.appendMultiChild($todoMain, $todoCheckbox, $todoContent);

    $deleteButtonWrapper.appendChild($deleteButton);

    domOperationModule.appendMultiChild($todoDisplay, $dragHandle, $todoMain, $deleteButtonWrapper);

    $li.appendChild($todoDisplay);

    domOperationModule.appendMultiChild($todoList, $li, textNode);

    // 只在todo的添加、删除使用动画，这样可以让打开app时，更快的显示内容，同时不会由于todo太多，需要加载太多的动画

    // setTimeout(() => {
    //   $todoDisplay.classList.add('show-todo');
    // }, 20);
    //
    // setTimeout(() => {
    //   $todoContent.classList.add('show-content');
    // }, 200);
  });
}

/**
 * addMockData()
 *
 * 如果数据库没有数据，写入用作演示的数据
 */
async function addMockData() {
  const mockData = [
    {
      text: "Finish the assignment of geometry",
      isDone: false,
      order: 0
    },
    {
      text: "Call sam to discuss supper ",
      isDone: true,
      order: 1
    }
  ];

  // 添加模拟的数据
  const createPromises = mockData.map(item => {
    return todoStore.create(item);
  });
  await Promise.all(createPromises);

  // 在数据添加的完成后，再进行getAll操作
  const queryResult = await todoStore.getAll();
  if (Array.isArray(queryResult) && queryResult.length !== 0) {
    renderTodoList(queryResult);
  }
}

/**
 * initRenderTodoList()
 *
 * 初始化渲染todo list
 */
async function initRenderTodoList() {
  try {
    const queryResult = await todoStore.getAll();
    if (Array.isArray(queryResult) && queryResult.length !== 0) {
      renderTodoList(queryResult);
    } else {
      await addMockData();
    }
  }
  catch (err) {
    console.error(err);
  }
}

/**
 * toggleTodoStatus()
 *
 * 切换todo的完成状态，更改显示样式，更改data中的数据，用作事件处理函数
 *
 * $el为todo-checkbox节点中的hidden-checkbox
 */
async function toggleTodoStatus($el) {
  // 每一个todo的todo-content是checkbox的下一个同级元素
  const $todo = domOperationModule.findClosestAncestor($el, '.todo');
  const $todoContent = domOperationModule.query($todo, '.todo-content');
  const $displayOptionSelected = displayCtrlModule.getDisplayOption();

  const id = parseInt($todo.dataset.id);
  const data = {
    isDone: !stringToBoolean($todo.dataset.isDone)
  };


  try {
    const result = await todoStore.update(id, data);
    if (result) {
      if ($todo.dataset.isDone === 'false') {
        $todoContent.classList.add('todo-is-done');
        $todo.dataset.isDone = 'true';

        // 如果display option不是All，则在其他两个tab中，对todo的状态进行toggle操作，都是需要在当前的tab中使它消失
        if (!$displayOptionSelected.matches('.display-all')) {
          $todo.classList.add('todo-hidden');
        }

      } else {
        $todoContent.classList.remove('todo-is-done');
        $todo.dataset.isDone = 'false';

        // 如果display option不是All，则在其他两个tab中，对todo的状态进行toggle操作，都是需要在当前的tab中使它消失
        if (!$displayOptionSelected.matches('.display-all')) {
          $todo.classList.add('todo-hidden');
        }

      }
    }
  }
  catch (err) {
    console.error(err);
  }

}

/**
 * deleteTodo()
 *
 * 删除todo，从DOM上移除相应的$todo与相应的数据
 *
 * $el为button-delete-todo节点
 */
async function deleteTodo($el) {
  const $todo = domOperationModule.findClosestAncestor($el, '.todo');
  const $todoDisplay = domOperationModule.query($todo, '.todo-display');
  const $todoContent = domOperationModule.query($todo, '.todo-content');
  const id = parseInt($todo.dataset.id);
  const order = parseInt($todo.dataset.order);

  try {
    await todoStore.delete(id);

    // $todoContent.classList.remove('show-content');

    // 每个setTimeout的延时时间大致与前一个动画的持续时间相同
    // setTimeout(() => {
      $todoDisplay.classList.remove('show-todo');

      setTimeout(() => {
        $todoList.removeChild($todo);

        updatePositionChanged(undefined, undefined, order, $todoList, undefined);
      }, 300);

    // }, 200);


  }
  catch (err) {
    console.error(err);
  }
}

/**
 * displayCtrlInit()
 *
 * 初始化应用时，默认选中display all，显示所有的todo
 */
function displayCtrlInit() {
  const $buttonDisplayAll = domOperationModule.query($displayCtrl, 'display-all');

  // 应用初始化时，默认选中display all
  displayCtrlModule.selectAnOption($buttonDisplayAll);
}

/**
 * updatePositionChanged()
 *
 * 负责更新位置发生改变的节点信息。只有dragEl移动前后位置之间的节点，以及dragEL本身的位置信息需要更新，同时包括数据库的更新
 *
 * @param {number} positionBefore  dragEl被移动前所处的位置
 * @param {number} positionAfter  dragEl被移动后所处的位置
 * @param {number} deleteElPosition  被删除的todo节点所处的位置
 * @param rootEl  sortable list的直接父元素
 * @param {boolean} isMouseMoveDown  鼠标在纵坐标上是否是向下移动
 */
async function updatePositionChanged(positionBefore, positionAfter, deleteElPosition, rootEl, isMouseMoveDown) {
  const sortingList = [];
  sortingList.push(...rootEl.children);

  if (typeof deleteElPosition !== 'undefined') {
    // 从删除的元素的位置开始，遍历到rootEle的最后一个元素
    for (let i = deleteElPosition; i < rootEl.children.length; i++) {
      const node = rootEl.children[i];
      const id = parseInt(node.dataset.id);
      const orderValue = sortingList.indexOf(node);

      node.dataset.order = orderValue;

      try {
        await todoStore.update(id, {order: orderValue});
      } catch (err) {
        console.error(err);
      }
    }
    return;
  }

  if (typeof isMouseMoveDown !== 'undefined' && isMouseMoveDown) {
    // 从上方移动到下方，中间节点位置减1。dragEl在移动之前，位于数值较小的positionBefore
    for (let i = positionBefore; i <= positionAfter; i++) {
      const node = rootEl.children[i];
      const id = parseInt(node.dataset.id);
      const orderValue = sortingList.indexOf(node);

      node.dataset.order = orderValue;

      try {
        await todoStore.update(id, {order: orderValue});
      } catch (err) {
        console.error(err);
      }

      // console.log(node);
    }
  } else {
    // 从下方移动到上方，中间节点位置加1。dragEl在移动之前，位于数值较大的positionBefore
    for (let i = positionAfter; i <= positionBefore; i++) {
      const node = rootEl.children[i];
      const id = parseInt(node.dataset.id);
      const orderValue = sortingList.indexOf(node);

      node.dataset.order = orderValue;

      try {
        await todoStore.update(id, {order: orderValue});
      } catch (err) {
        console.error(err);
      }

      // console.log(node);
    }
  }
}

/**
 * displayTabsOnClick()
 *
 * 作为display tab中button的点击事件处理函数，绑定到display-ctrl节点
 */
function displayTabsOnClick(event) {
  const $el = event.target;
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

/**
 * todoOnClick()
 *
 * 作为在todo上点击事件的事件处理函数，不同的点击元素会触发不同的处理事件
 */
function todoOnClick(event) {
  const $el = event.target;
  // 判断点击的元素是不是todo-checkbox中的hidden-checkbox，虽然hidden-checkbox不显示，但由于它在label里面，实际点击到的还是它
  if ($el.matches('.hidden-checkbox')) {
    toggleTodoStatus(event.target);
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
    todoEditInPlaceModule.saveTodoEdit(event.target);
  }
  // 判断点击的元素是不是cancel按钮
  if ($el.matches('.button-cancel-todo-edit')) {
    todoEditInPlaceModule.cancelTodoEdit(event.target);
  }
}

/**
 * appInit()  应用的初始化函数，包括各种事件处理函数绑定，控制元素的渲染
 */
function appInit() {
  displayCtrlInit();

// 使用表单提交input的内容
  $inputForm.addEventListener('submit', function (event) {
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

// 使用事件委托，将三种显示状态切换的点击绑定到display-ctrl节点上
  $displayCtrl.addEventListener('click', displayTabsOnClick);

// 使用事件委托，将点击事件绑定到todo-list上，一个是checkbox的点击，另一个是content的点击(开启edit in place), 还有删除按钮的点击。在处理函数内部加上event.target判断
  $todoList.addEventListener('click', todoOnClick);

  sortable($todoList, '.todo-drag-handle', '.todo', updatePositionChanged);
}

/**
 * afterDataBaseConnected()  包含需要在数据库初始化（连接）成功后，才能进行的操作。此函数在todoStore内部，当数据库连接成功后才会被调用
 */
async function afterDataBaseConnected() {
  await initRenderTodoList();
  appInit();
}

