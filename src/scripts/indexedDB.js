/**
 * @module indexedDBModule  使用indexedDB管理数据
 *
 * @param {String} dbName  数据库名称
 * @param {Number} version  数据库版本
 * @param {String} objectStorage  对象存储空间（相当于table name）
 * @param {Function} afterDataBaseConnected  需要在数据库初始化完成后执行的函数，一般为应用的初始化函数
 *
 * @return {Object} {init, getAll, get, create, update, delete, removeAll}
 *
 ---------------------------------------------------------------------------------------
 * @method init()  用于应用初始化，只有这个方法会执行传入的afterDataBaseConnected回调函数
 *
 * @return  返回一个Promise
 *
 * @resolve {String}  'App init.'这个字符串
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

const indexedDBModule = function (dbName, version, objectStorage, afterDataBaseConnected=()=>{}) {
  function useIndexedDB(action, dataParam) {
    return new Promise(function (resolve, reject) {
      const dbOpenRequest = window.indexedDB.open(dbName, version);

      dbOpenRequest.onerror = function (event) {
        console.log('Something bad happened while trying to open: ' + event.target.errorCode);
        reject(event.target);
      };

      dbOpenRequest.onupgradeneeded = function () {
        const db = dbOpenRequest.result;
        // 创建存储空间，使用自增的主值
        const store = db.createObjectStore(objectStorage, {
          keyPath: '_id',
          autoIncrement: true
        });
      };

      dbOpenRequest.onsuccess = function () {
        const db = dbOpenRequest.result;

        // 初始化应用
        if (action === 'init') {
          afterDataBaseConnected();
          resolve('App init.');
          db.close();
        } else {
          // 进行数据库操作

          // 创建事务
          const transaction = db.transaction(objectStorage, 'readwrite');
          // 在事务上得到相应的存储空间，用于数据的读取与修改
          const objectStore = transaction.objectStore(objectStorage);

          transaction.onabort = function (event) {
            console.log('tx has been aborted.');
            console.log(event.target);
          };

          let txOperationRequest;

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
                console.log(`Item with _id ${txOperationRequest.result} has been added.`);
                resolve({_id: txOperationRequest.result});
                break;
              case 'put':
                console.log(`Item with _id ${txOperationRequest.result} has been updated.`);
                resolve({_id: txOperationRequest.result});
                break;
              case 'delete':
                console.log('Item has been removed.');
                resolve('Item has been removed.');
                break;
              case 'removeAll':
                console.log('All items have been removed.');
                resolve('All items have been removed.');
                break;
              default:
                console.log('Database operation is not valid.');
            }
          };

          // 每个事务完成后，都会关闭当前的数据库连接
          transaction.oncomplete = function () {
            db.close();
          };
        }
      };
    });
  }

  return {
    init: function () {
      return useIndexedDB('init', '');
    },
    getAll: function () {
      return useIndexedDB('getAll', '');
    },
    get: function (query) {
      return useIndexedDB('get', query);
    },
    create: function (data) {
      return useIndexedDB('post', data);
    },
    update: async function (query, data) {
      try {
        const queryResult = await useIndexedDB('get', query);
        if (typeof queryResult !== 'undefined') {
          const newData = Object.assign(queryResult, data);
          return useIndexedDB('put', newData);
        } else {
          console.log('Can not find the data according to the query');
        }
      }
      catch (err) {
        console.error(err);
      }
    },
    // put: function (data) {
    //   return useIndexedDB('put', data);
    // },
    delete: function (query) {
      return useIndexedDB('delete', query);
    },
    removeAll: function () {
      return useIndexedDB('removeAll', '');
    },
  }
};

export default indexedDBModule;