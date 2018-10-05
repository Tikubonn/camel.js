
/**
 * @abstract
 * @constructor
 */

function CamelRequestBase (){
}

/**
 * @return {Promise}
 * @abstract
 */

CamelRequestBase.prototype.download = function (){
};

/**
 * @return {XMLHttpRequest}
 * @abstract
 */

CamelRequestBase.prototype.get = function (){
};

/**
 * @param {Array} previousRequests
 * @return {boolean}
 * @abstract
 */

CamelRequestBase.prototype.__circularp = function (previousRequests){
};
