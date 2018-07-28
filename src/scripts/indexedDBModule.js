const indexedDBModule = function (dbName, version, objectStorage, afterDataBaseConnected) {
  const dbOpenRequest = window.indexedDB.open(dbName, version);

  // 模块中的局部变量，用于存储连接成功的数据库连接
  let db;

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
    db = dbOpenRequest.result;
    afterDataBaseConnected();
  };

  function useIndexedDB(action, dataParam) {
    return new Promise(function (resolve, reject) {
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
        }
      };
    });
  }

  return {
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