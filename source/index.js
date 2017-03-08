var log = function() {};

var deferredDictionary = {};

function runOnceResolveAll(operationMethod, operationKey) {
  if (deferredDictionary[operationKey]) {
      log('pre-existing queue for ' + operationKey);
      return deferredDictionary[operationKey];
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
      delete deferredDictionary[operationKey];
      resolve(result);
    })
    .catch(err => {
      log('rejecting deferred for ' + operationKey);
      delete deferredDictionary[operationKey];
      reject(err);
    });
  });

  return deferredDictionary[operationKey];
}

module.exports.runOnceResolveAll = runOnceResolveAll;
module.exports.setLogger = logger => {
  log = logger;
};
