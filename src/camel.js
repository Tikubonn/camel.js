
/**
 * @constructor 
 */

function Camel (){
  
  /**
   * @type {Array.<CamelBoundRequest>}
   */
  
  this.__requests = new Array();
}

/**
 * @param {CamelRequest|string} some
 * @return {?CamelBoundRequest}
 */

Camel.prototype.find = function (some){
  if (some instanceof String || typeof some == "string"){
    return this.__findByName(some);
  }
  else if (some instanceof CamelRequest){
    return this.__findByRequest(some);
  }
  else {
    throw new Error("argument of 1 is unsupported type.");
  }
};

/** 
 * @param {string} name
 * @return {?CamelBoundRequest}
 */

Camel.prototype.__findByName = function (name){
  var index;
  for (index = 0; index < this.__requests.length; index++){
    var boundRequest = this.__requests[index];
    if (boundRequest.name() == name){
      return boundRequest;
    }
  }
  return null;
};

/**
 * @param {CamelRequest} request
 * @return {?CamelBoundRequest}
 */

Camel.prototype.__findByRequest = function (request){
  var index;
  for (index = 0; index < this.__requests.length; index++){
    var boundRequest = this.__requests[index];
    if (boundRequest == request){
      return boundRequest;
    }
  }
  return null;
};

/**
 * @param {CamelRequest|string} some
 * @return {CamelRequest}
 */

Camel.prototype.__makeRequest = function (some, options){
  if (some instanceof String || typeof some == "string"){
    return new CamelRequest(some, options);
  }
  else if (some instanceof CamelRequest){
    return some;
  }
  else {
    throw new Error("argument of 1 is unsupported type.");
  }
};

/**
 * @param {Array.<CamelRequest|string>} depends 
 * @return {Array.<CamelRequestReference>}
 */

Camel.prototype.__makeDepends = function (depends){
  return depends.map(
    function (depend){
      if (depend instanceof String || typeof depend == "string"){
        return new CamelRequestReference(this, depend);
      }
      else if (depend instanceof CamelRequest){
        return new CamelRequestReference(this, depend);
      }
      else {
        throw new Error("argument of 1 is unsupported type.");
      }
    }, this);
};

/**
 * @param {CamelRequest|string} some 
 * @param {Array} depends
 * @param {Object} options
 * @return {void}
 */

Camel.prototype.register = function (some, depends, options){
  
  if (depends == undefined){
    depends = new Array();
  }
  
  if (options == undefined){
    options = new Object();
  }
  
  var found = this.find(some);
  if (found){
    throw new Error("already defined.");
  }
  var request = this.__makeRequest(some, options);
  var requestDepends = this.__makeDepends(depends);
  var boundRequest = new CamelBoundRequest(request, requestDepends);
  this.__requests.push(boundRequest);
};

/**
 * @param {CamelRequest|string} some
 * @return {Promise}
 */

Camel.prototype.download = function (some){
  var found = this.find(some);
  if (found){
    if (found.__circularp(new Array())){
      throw new Error("circular reference was detected in dependation.");
    }
    else {
      return found.download();
    }
  }
  else {
    throw new Error("argument of 1 is could not be found in Camel instance.");
  }
};

/**
 * @param {CamelRequest|string} some
 * @return {XMLHttpRequest}
 */

Camel.prototype.get = function (some){
  var found = this.find(some);
  if (found){
    return found.get();
  }
  else {
    throw new Error("argument of 1 is could not be found in Camel instance.");
  }
};

/**
 * @return {Promise}
 */

Camel.prototype.downloadAll = function (){
  return Promise.all(
    this.__requests.map(
      function (request){
        if (request.__circularp(new Array())){
          throw new Error("circular reference was detected in dependation.");
        }
        else {
          return request.download();
        }
      }
    ));
};

window["Camel"] = Camel;
