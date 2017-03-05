var log = function() {};

var deferredDictionary = {};

function runOnceResolveAll(operationMethod, operationKey) {
  if (deferredDictionary[operationKey]) {
      log('pre-existing queue for ' + operationKey);
      return deferredDictionary[operationKey].promise;
  }

  deferredDictionary[operationKey] = new Promise((resolve, reject) => {
    log('creating ' + operationKey + ' queue');

    var promise = (typeof operationMethod === 'function') ? operationMethod() : operationMethod;

    if (!promise.then) {
        promise = Promise.resolve(promise);
    }

    promise
    .then(result => {
      log('resolving deferred for ' + operationKey);
      resolve(result);
    })
    .catch(result => {
      log('rejecting deferred for ' + operationKey);
      reject(err);
    })
    .finally(() => {
      delete deferredDictionary[operationKey];
    });
  });

  return deferredDictionary[operationKey];
}

module.exports.runOnceResolveAll = runOnceResolveAll;
module.exports.setLogger = logger => {
  log = logger;
};
