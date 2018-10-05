
/**
 * @param {CamelRequest} request
 * @param {Array.<CamelRequestReference>} depends
 * @extends {CamelRequestBase}
 * @constructor
 */

function CamelBoundRequest (request, depends){
  this.__request = request;
  this.__depends = depends;
}

CamelBoundRequest.prototype = 
  Object.create(CamelRequestBase.prototype);

/**
 * @return {string}
 */

CamelBoundRequest.prototype.name = function (){
  return this.__request.name();
};

/**
 * @return {Promise}
 */

CamelBoundRequest.prototype.download = function (){
  return Promise.all(
    this.__depends.map(
      function (depend){
        return depend.download();
      })).then(
    this.__request.download.bind(
      this.__request));
};

/**
 * @return {XMLHttpRequest}
 */

CamelBoundRequest.prototype.get = function (){
  return this.__request.get();
};

/**
 * @param {Array} previousRequests
 * @return {boolean}
 */

CamelBoundRequest.prototype.__circularp = function (previousRequests){
  if (this.__request.circularp(previousRequests)){
    return true;
  }
  else {
    var index;
    for (index = 0; index < this.__depends.length; index++){
      var depend = this.__depends[index];
      var previous = previousRequests.slice();
      previous.push(this.__request);
      if (depend.circularp(previous)){
        return true;
      }
    }
    return false;
  }
};
