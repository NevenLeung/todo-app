'use strict';

// get the DOM elements

/**
 * addTodo()
 *
 * 添加一条新的todo，同时将一个新的todo对象的加入data.todoList数组中
 *
 * @param text todo的文本内容
 */
var addTodo = function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee4(text) {
    var data, result, $li, $div, $checkbox, $todoContent, $deleteButton, textNode;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            data = {
              text: text,
              isDone: false,
              order: $todoList.children.length
            };
            _context4.prev = 1;
            _context4.next = 4;
            return todoStore.create(data);

          case 4:
            result = _context4.sent;

            if (result) {
              $li = createNewElementNode('li', 'todo', '', 'draggable', 'true', 'data-is-done', 'false', 'data-id', result._id, 'data-order', result.order);
              $div = createNewElementNode('div', 'todo-display');
              $checkbox = createNewElementNode('input', 'todo-checkbox', '', 'type', 'checkbox');
              $todoContent = createNewElementNode('span', 'todo-content', text);
              $deleteButton = createNewElementNode('button', 'button button-delete-todo', 'X');
              textNode = document.createTextNode(' ');

              // 将checkbox和todo-content、delete-button节点分别添加到div节点，作为其子节点

              domOperationModule.appendMultiChild($div, $checkbox, $todoContent, $deleteButton);

              $li.appendChild($div);

              // 把li添加到todo-list上
              domOperationModule.appendMultiChild($todoList, $li, textNode);
            } else {
              console.log('Data creation is failed');
            }
            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](1);

            console.error(_context4.t0);

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[1, 8]]);
  }));

  return function addTodo(_x8) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * sortTodoInAscendingOrder()
 *
 * 将todoList数组中的todo根据order从小到大排列
 *
 * @param {Array} list  todo list array object
 */


/**
 * addMockData()
 *
 * 如果数据库没有数据，写入用作演示的数据
 */
var addMockData = function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var mockData, createPromises, queryResult;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            mockData = [{
              text: "Finish the assignment of geometry",
              isDone: false,
              order: 0
            }, {
              text: "Call sam to discuss supper ",
              isDone: true,
              order: 1
            }];

            // 添加模拟的数据

            createPromises = mockData.map(function (item) {
              return todoStore.create(item);
            });
            _context5.next = 4;
            return Promise.all(createPromises);

          case 4:
            _context5.next = 6;
            return todoStore.getAll();

          case 6:
            queryResult = _context5.sent;

            if (Array.isArray(queryResult) && queryResult.length !== 0) {
              renderTodoList(queryResult);
            }

          case 8:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function addMockData() {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * initRenderTodoList()
 *
 * 初始化渲染todo list
 */


var initRenderTodoList = function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var queryResult;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return todoStore.getAll();

          case 3:
            queryResult = _context6.sent;

            if (!(Array.isArray(queryResult) && queryResult.length !== 0)) {
              _context6.next = 8;
              break;
            }

            renderTodoList(queryResult);
            _context6.next = 10;
            break;

          case 8:
            _context6.next = 10;
            return addMockData();

          case 10:
            _context6.next = 15;
            break;

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6['catch'](0);

            console.error(_context6.t0);

          case 15:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this, [[0, 12]]);
  }));

  return function initRenderTodoList() {
    return _ref6.apply(this, arguments);
  };
}();

/**
 * toggleTodoStatus()
 *
 * 切换todo的完成状态，更改显示样式，更改data中的数据，用作事件处理函数
 *
 * $el为todo-checkbox节点
 */


var toggleTodoStatus = function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee7($el) {
    var $todo, $todoContent, $displayOptionSelected, id, data, result;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            // 每一个todo的todo-content是checkbox的下一个同级元素
            $todo = domOperationModule.findClosestAncestor($el, '.todo');
            $todoContent = domOperationModule.query($todo, '.todo-content');
            $displayOptionSelected = displayCtrlModule.getDisplayOption();
            id = parseInt($todo.dataset.id);
            data = {
              isDone: !stringToBoolean($todo.dataset.isDone)
            };
            _context7.prev = 5;
            _context7.next = 8;
            return todoStore.update(id, data);

          case 8:
            result = _context7.sent;

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
            _context7.next = 15;
            break;

          case 12:
            _context7.prev = 12;
            _context7.t0 = _context7['catch'](5);

            console.error(_context7.t0);

          case 15:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this, [[5, 12]]);
  }));

  return function toggleTodoStatus(_x9) {
    return _ref7.apply(this, arguments);
  };
}();

/**
 * deleteTodo()
 *
 * 删除todo，从DOM上移除相应的$todo与相应的数据
 *
 * $el为button-delete-todo节点
 */


var deleteTodo = function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee8($el) {
    var $todo, id, order;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            $todo = domOperationModule.findClosestAncestor($el, '.todo');
            id = parseInt($todo.dataset.id);
            order = parseInt($todo.dataset.order);
            _context8.prev = 3;
            _context8.next = 6;
            return todoStore.delete(id);

          case 6:
            $todoList.removeChild($todo);
            updatePositionChanged(undefined, undefined, order, $todoList, undefined);
            _context8.next = 13;
            break;

          case 10:
            _context8.prev = 10;
            _context8.t0 = _context8['catch'](3);

            console.error(_context8.t0);

          case 13:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this, [[3, 10]]);
  }));

  return function deleteTodo(_x10) {
    return _ref8.apply(this, arguments);
  };
}();

/**
 * displayCtrlInit()
 *
 * 初始化应用时，默认选中display all，显示所有的todo
 */


/**
 * updatePositionChanged()
 *
 * 负责更新位置发生改变的节点信息。只有dragEl移动前后位置之间的节点，以及dragEL本身的位置信息需要更新，同时包括数据库的更新
 *
 * @param positionBefore
 * @param positionAfter
 * @param deleteElPosition
 * @param rootEl
 * @param isMouseMoveDown
 */
var updatePositionChanged = function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee9(positionBefore, positionAfter, deleteElPosition, rootEl, isMouseMoveDown) {
    var sortingList, i, node, id, orderValue, _i, _node, _id, _orderValue, _i2, _node2, _id2, _orderValue2;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            sortingList = [];

            sortingList.push.apply(sortingList, _toConsumableArray(rootEl.children));

            if (!(typeof deleteElPosition !== 'undefined')) {
              _context9.next = 21;
              break;
            }

            i = deleteElPosition;

          case 4:
            if (!(i < rootEl.children.length)) {
              _context9.next = 20;
              break;
            }

            node = rootEl.children[i];
            id = parseInt(node.dataset.id);
            orderValue = sortingList.indexOf(node);


            node.dataset.order = orderValue;

            _context9.prev = 9;
            _context9.next = 12;
            return todoStore.update(id, {order: orderValue});

          case 12:
            _context9.next = 17;
            break;

          case 14:
            _context9.prev = 14;
            _context9.t0 = _context9['catch'](9);

            console.error(_context9.t0);

          case 17:
            i++;
            _context9.next = 4;
            break;

          case 20:
            return _context9.abrupt('return');

          case 21:
            if (!(typeof isMouseMoveDown !== 'undefined' && isMouseMoveDown)) {
              _context9.next = 41;
              break;
            }

            _i = positionBefore;

          case 23:
            if (!(_i <= positionAfter)) {
              _context9.next = 39;
              break;
            }

            _node = rootEl.children[_i];
            _id = parseInt(_node.dataset.id);
            _orderValue = sortingList.indexOf(_node);


            _node.dataset.order = _orderValue;

            _context9.prev = 28;
            _context9.next = 31;
            return todoStore.update(_id, {order: _orderValue});

          case 31:
            _context9.next = 36;
            break;

          case 33:
            _context9.prev = 33;
            _context9.t1 = _context9['catch'](28);

            console.error(_context9.t1);

          case 36:
            _i++;
            _context9.next = 23;
            break;

          case 39:
            _context9.next = 58;
            break;

          case 41:
            _i2 = positionAfter;

          case 42:
            if (!(_i2 <= positionBefore)) {
              _context9.next = 58;
              break;
            }

            _node2 = rootEl.children[_i2];
            _id2 = parseInt(_node2.dataset.id);
            _orderValue2 = sortingList.indexOf(_node2);


            _node2.dataset.order = _orderValue2;

            _context9.prev = 47;
            _context9.next = 50;
            return todoStore.update(_id2, {order: _orderValue2});

          case 50:
            _context9.next = 55;
            break;

          case 52:
            _context9.prev = 52;
            _context9.t2 = _context9['catch'](47);

            console.error(_context9.t2);

          case 55:
            _i2++;
            _context9.next = 42;
            break;

          case 58:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this, [[9, 14], [28, 33], [47, 52]]);
  }));

  return function updatePositionChanged(_x11, _x12, _x13, _x14, _x15) {
    return _ref9.apply(this, arguments);
  };
}();

/**
 * displayTabsOnClick()
 *
 * 作为display tab中button的点击事件处理函数，绑定到display-ctrl节点
 */


/**
 * afterDataBaseConnected()  包含需要在数据库初始化（连接）成功后，才能进行的操作。此函数在todoStore内部，当数据库连接成功后才会被调用
 */
var afterDataBaseConnected = function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return initRenderTodoList();

          case 2:
            appInit();

          case 3:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function afterDataBaseConnected() {
    return _ref10.apply(this, arguments);
  };
}();

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

function _asyncToGenerator(fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
}

var $inputForm = document.querySelector('.input-form');
var $displayCtrl = document.querySelector('.display-ctrl');
// const $todoList = document.querySelector('.todo-list');
var $todoList = document.getElementsByClassName('todo-list')[0];
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
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {
      }
      return i > -1;
    };
  }

  // Element.closest() - https://developer.mozilla.org/zh-CN/docs/Web/API/Element/closest
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
var indexedDBModule = function indexedDBModule(dbName, version, objectStorage, afterDataBaseConnected) {
  var dbOpenRequest = window.indexedDB.open(dbName, version);

  // 模块中的局部变量，用于存储连接成功的数据库连接
  var db = void 0;

  dbOpenRequest.onerror = function (event) {
    console.log('Something bad happened while trying to open: ' + event.target.errorCode);
    reject(event.target);
  };

  dbOpenRequest.onupgradeneeded = function () {
    var db = dbOpenRequest.result;
    // 创建存储空间，使用自增的主值
    var store = db.createObjectStore(objectStorage, {
      keyPath: '_id',
      autoIncrement: true
    });
  };

  dbOpenRequest.onsuccess = function () {
    db = dbOpenRequest.result;
    afterDataBaseConnected();
  };

  function useIndexedDB(action, dataParam) {
    return new Promise(function (resolve, reject) {
      // 创建事务
      var transaction = db.transaction(objectStorage, 'readwrite');
      // 在事务上得到相应的存储空间，用于数据的读取与修改
      var objectStore = transaction.objectStore(objectStorage);

      transaction.onabort = function (event) {
        console.log('tx has been aborted.');
        console.log(event.target);
      };

      var txOperationRequest = void 0;

      switch (action) {
        case 'getAll':
          txOperationRequest = objectStore.getAll();
          break;
        case 'get':
          txOperationRequest = objectStore.get(dataParam);
          break;
        case 'post':
          txOperationRequest = objectStore.add(dataParam);
          break;
        case 'put':
          txOperationRequest = objectStore.put(dataParam);
          break;
        case 'delete':
          txOperationRequest = objectStore.delete(dataParam);
          break;
        case 'removeAll':
          txOperationRequest = objectStore.clear();
      }

      txOperationRequest.onerror = function (event) {
        console.log(event.target);
        reject(event.target);
      };

      txOperationRequest.onsuccess = function (event) {
        switch (action) {
          case 'getAll':
            resolve(txOperationRequest.result);
            break;
          case 'get':
            resolve(txOperationRequest.result);
            break;
          case 'post':
            console.log('Item with _id ' + txOperationRequest.result + ' has been added.');
            resolve({_id: txOperationRequest.result});
            break;
          case 'put':
            console.log('Item with _id ' + txOperationRequest.result + ' has been updated.');
            resolve({_id: txOperationRequest.result});
            break;
          case 'delete':
            console.log('Item has been removed.');
            resolve('Item has been removed.');
            break;
          case 'removeAll':
            console.log('All items have been removed.');
            resolve('All items have been removed.');
        }
      };
    });
  }

  return {
    getAll: function getAll() {
      return useIndexedDB('getAll', '');
    },
    get: function get(query) {
      return useIndexedDB('get', query);
    },
    create: function create(data) {
      return useIndexedDB('post', data);
    },
    update: function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee(query, data) {
        var queryResult, newData;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return useIndexedDB('get', query);

              case 3:
                queryResult = _context.sent;

                if (!(typeof queryResult !== 'undefined')) {
                  _context.next = 9;
                  break;
                }

                newData = Object.assign(queryResult, data);
                return _context.abrupt('return', useIndexedDB('put', newData));

              case 9:
                console.log('Can not find the data according to the query');

              case 10:
                _context.next = 15;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](0);

                console.error(_context.t0);

              case 15:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 12]]);
      }));

      function update(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return update;
    }(),
    // put: function (data) {
    //   return useIndexedDB('put', data);
    // },
    delete: function _delete(query) {
      return useIndexedDB('delete', query);
    },
    removeAll: function removeAll() {
      return useIndexedDB('removeAll', '');
    }
  };
};

// 创建TodoApp的数据库管理实例
var todoStore = indexedDBModule('TodoApp', 1, 'todo', afterDataBaseConnected);

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
          // 移除$el本身
          result.splice(index, 1);

          result = result.filter(function (el) {
            return el.matches(selector);
          });

          return result;
        } else if (option === 'backward') {
          var _result2;

          var _index = void 0;
          (_result2 = result).push.apply(_result2, _toConsumableArray($el.parentElement.children));
          _index = result.indexOf($el);
          // 从头开始移除sibling，直到把$el也一起移除
          result.splice(0, _index + 1);

          result = result.filter(function (el) {
            return el.matches(selector);
          });

          return result;
        } else if (option === 'forward') {
          var _result3;

          var _index2 = void 0;
          (_result3 = result).push.apply(_result3, _toConsumableArray($el.parentElement.children));
          _index2 = result.indexOf($el);
          // 从$el开始移除，直到把$el后面的所有sibling全部移除
          result.splice(_index2, result.length - _index2);

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
var todoEditInPlaceModule = function (domWrapper) {

  /**
   * saveTodoEdit()
   *
   * 作为todo-edit中save button的事件处理方法，用于保存content的修改，修改todo-content的内容，
   * 以及将修改更新到data，以及改变todo-display和todo-edit的display属性
   *
   * @param $el button-save-todo-edit节点
   */
  var saveTodoEdit = function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee2($el) {
      var $todo, $todoEdit, $todoEditBar, $todoDisplay, $todoContent, id, data, result;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!$el.matches('.button-save-todo-edit')) {
                _context2.next = 22;
                break;
              }

              $todo = domWrapper.findClosestAncestor($el, '.todo');
              $todoEdit = domWrapper.findClosestAncestor($el, '.todo-edit');
              $todoEditBar = domWrapper.query($todoEdit, '.todo-edit-bar');
              $todoDisplay = domWrapper.query($todo, '.todo-display');
              $todoContent = domWrapper.query($todoDisplay, '.todo-content');

              // 不允许修改后，todo的内容为空，或者为纯空白字符

              if (!($todoEditBar.value.trim().length === 0)) {
                _context2.next = 10;
                break;
              }

              alert('The content of todo should not be empty. Please write something you need to do.');
              _context2.next = 22;
              break;

            case 10:
              id = parseInt($todo.dataset.id);
              data = {
                text: $todoEditBar.value
              };
              _context2.prev = 12;
              _context2.next = 15;
              return todoStore.update(id, data);

            case 15:
              result = _context2.sent;

              if (result) {
                $todoContent.textContent = $todoEditBar.value;

                $todoDisplay.classList.remove('todo-display-hidden');
                $todoEdit.classList.remove('todo-edit-show');

                $lastEditedTodo = undefined;
              }
              _context2.next = 22;
              break;

            case 19:
              _context2.prev = 19;
              _context2.t0 = _context2['catch'](12);

              console.error(_context2.t0);

            case 22:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[12, 19]]);
    }));

    return function saveTodoEdit(_x5) {
      return _ref2.apply(this, arguments);
    };
  }();

  /**
   * cancelTodoEdit()
   *
   * 作为todo-edit中cancel button的事件处理方法，用于抛弃修改结果后，改变todo-display和todo-edit的display属性
   *
   * @param $el button-cancel-todo-edit节点
   */


  /**
   * saveUnsavedEdition()
   *
   * 每次开启edit in place，先尝试执行该函数
   *
   * 作用：
   * - 当已经有一个todo处于可编辑状态，此时点击另一个todo，需要保存前一个todo的数据，还需要将数据修改进行保存，同时进行class toggle
   * - 简单来说是，为了编辑todo时的操作互斥，同时会对未点击save按钮的修改进行保存
   */
  var saveUnsavedEdition = function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var $todoDisplay, $todoContent, $todoEdit, todoContentAfterEdited, id, data, result;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(typeof $lastEditedTodo !== 'undefined')) {
                _context3.next = 17;
                break;
              }

              $todoDisplay = domWrapper.query($lastEditedTodo, '.todo-display');
              $todoContent = domWrapper.query($todoDisplay, '.todo-content');
              $todoEdit = domWrapper.query($lastEditedTodo, '.todo-edit');

              // 待保存的content应该是input中的value，而不是$todoContent中的textContent，那应该如何保存value呢？
              // 通过todo-display节点，找到todo-edit，再找到相应todo-edit-bar，因为其中input的值，只有在重新进入edit in place才会被更新，所以此时input中value仍然是被修改后的值

              todoContentAfterEdited = domWrapper.query($todoEdit, '.todo-edit-bar').value;
              id = parseInt($lastEditedTodo.dataset.id);
              data = {
                text: todoContentAfterEdited
              };
              _context3.prev = 7;
              _context3.next = 10;
              return todoStore.update(id, data);

            case 10:
              result = _context3.sent;

              if (result) {
                // 保存修改
                $todoContent.textContent = todoContentAfterEdited;

                // 让前一个未保存的todo恢复正常的显示
                $todoDisplay.classList.remove('todo-display-hidden');
                $todoEdit.classList.remove('todo-edit-show');
              }

              _context3.next = 17;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3['catch'](7);

              console.error(_context3.t0);

            case 17:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[7, 14]]);
    }));

    return function saveUnsavedEdition() {
      return _ref3.apply(this, arguments);
    };
  }();

  var $lastEditedTodo = void 0;

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
      if (typeof $lastEditedTodo !== 'undefined') {
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

      // 记录当前被点击的todo节点，todo节点中包含有数据的id值（data-id）
      $lastEditedTodo = $todo;
    }
  }

  function cancelTodoEdit($el) {
    if ($el.matches('.button-cancel-todo-edit')) {
      // 如何保存一个todo未修改之前的值，用于取消操作的回滚，
      // 不需要做回滚操作，input上的值，不影响span的textContent
      var $todoEdit = domWrapper.findClosestAncestor($el, '.todo-edit');
      var $todoDisplay = domWrapper.findSibling($todoEdit, '.todo-display', 'forward');

      $todoDisplay.classList.remove('todo-display-hidden');
      $todoEdit.classList.remove('todo-edit-show');

      $lastEditedTodo = undefined;
    }
  }

  return {
    activatedTodoEditInPlace: activatedTodoEditInPlace,
    saveTodoEdit: saveTodoEdit,
    cancelTodoEdit: cancelTodoEdit
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

/**
 * sortable  function for sortable list
 *
 * @param rootEl  Root element whose children will be draggable
 * @param className  Limit the drop place which can be insert before, if it is with such a class name
 * @param onUpdate  A callback when the drag and drop process is finished
 */
function sortable(rootEl, className, onUpdate) {
  var _sortingList;

  var dragEl = void 0,
    nextEl = void 0,
    clientYBefore = void 0,
    isMouseMoveDown = void 0,
    sortedFlag = void 0,
    positionBefore = void 0,
    positionAfter = void 0;

  // make all children draggable
  var sortingList = [];
  (_sortingList = sortingList).push.apply(_sortingList, _toConsumableArray(rootEl.children));

  sortingList.forEach(function (itemEl) {
    itemEl.draggable = true;
    itemEl.dataset.order = sortingList.indexOf(itemEl);
  });

  // Sorting start
  rootEl.addEventListener('dragstart', _onDragStart, false);

  function _onDragStart(evt) {
    var _sortingList2;

    // Remember the element that will move
    dragEl = evt.target;
    // Remember the nextSibling for judging valid movement
    nextEl = dragEl.nextSibling;

    // 使用sortingList作为判断节点位置初始位置的依据
    sortingList = [];
    (_sortingList2 = sortingList).push.apply(_sortingList2, _toConsumableArray(rootEl.children));

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
  }

  // Function responsible for sorting, the dragEl is hovering above the target element
  function _onDragOver(evt) {
    sortedFlag = false;
    var target = evt.target;

    // use evt.preventDefault() to allow drop
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';

    // 当item已经被移动另一个位置，但鼠标原地并未释放时，target和dragEl是同一个元素，这时不再重复触发节点插入。
    if (target && target !== dragEl && target.matches(className)) {
      isMouseMoveDown = evt.clientY >= clientYBefore;

      // 从上到下，插入到target当前的位置
      if (isMouseMoveDown && target.nextSibling && !sortedFlag) {
        rootEl.insertBefore(dragEl, target.nextSibling);
        sortedFlag = true;
      }

      // 从下到上，插入到target的前一个位置
      if (!isMouseMoveDown && !sortedFlag) {
        rootEl.insertBefore(dragEl, target);
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

      console.log('positionBefore: ' + positionBefore + ', positionAfter: ' + positionAfter);

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

function sortTodoInAscendingOrder(list) {
  if (Array.isArray(list)) {
    list.sort(function (prev, next) {
      return prev.order - next.order;
    });
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
 <input class='todo-checkbox'>
 <span class='todo-content'></span>
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
    var $li = createNewElementNode('li', 'todo', '', 'data-is-done', todo.isDone, 'data-id', todo._id);
    var $div = createNewElementNode('div', 'todo-display');
    var $checkbox = createNewElementNode('input', 'todo-checkbox', '', 'type', 'checkbox');
    var $todoContent = createNewElementNode('span', 'todo-content', todo.text);
    var $deleteButton = createNewElementNode('button', 'button button-delete-todo', 'X');
    var textNode = document.createTextNode(' ');

    if (todo.isDone) {
      // 为todo-content添加class 'todo-is-done'
      $todoContent.classList.add('todo-is-done');
      // 由于todo为已完成状态，需要将checkbox设置为已勾选状态
      $checkbox.setAttribute('checked', 'checked');
    }

    domOperationModule.appendMultiChild($div, $checkbox, $todoContent, $deleteButton);

    $li.appendChild($div);

    domOperationModule.appendMultiChild($todoList, $li, textNode);
  });
}

function displayCtrlInit() {
  var $buttonDisplayAll = domOperationModule.query($displayCtrl, 'display-all');

  // 应用初始化时，默认选中display all
  displayCtrlModule.selectAnOption($buttonDisplayAll);
}

function displayTabsOnClick(event) {
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

/**
 * todoOnClick()
 *
 * 作为在todo上点击事件的事件处理函数，不同的点击元素会触发不同的处理事件
 */
function todoOnClick(event) {
  var $el = event.target;
  // 判断点击的元素是不是todo-checkbox
  if ($el.matches('.todo-checkbox')) {
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
  $displayCtrl.addEventListener('click', displayTabsOnClick);

  // 使用事件委托，将点击事件绑定到todo-list上，一个是checkbox的点击，另一个是content的点击(开启edit in place), 还有删除按钮的点击。在处理函数内部加上event.target判断
  $todoList.addEventListener('click', todoOnClick);

  sortable($todoList, '.todo', updatePositionChanged);
}
