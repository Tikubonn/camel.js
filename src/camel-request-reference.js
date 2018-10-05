
/**
 * @extends {CamelRequestBase}
 * @constructor
 */

function CamelRequestReference (camel, name){
  this.__camel = camel;
  this.__name = name;
}

CamelRequestReference.prototype = 
  Object.create(CamelRequestBase.prototype);

/**
 * @return {string}
 */

CamelRequestReference.prototype.name = function (){
  return this.__name;
};

/**
 * @return {Promise}
 */

CamelRequestReference.prototype.download = function (){
  var found = this.__camel.find(this.__name);
  if (found){
    return found.download();
  }
  else {
    throw new Error("" + this.__name + " is undefined in Camel instance.");
  }
};

/**
 * @return {XMLHttpRequest}
 */

CamelRequestReference.prototype.get = function (){
  var found = this.__camel.find(this.__name);
  if (found){
    return found.get();
  }
  else {
    throw new Error("" + this.__name + " is undefined in Camel instance.");
  }
};

/**
 * @param {Array} previousRequests
 * @return {boolean}
 */

CamelRequestReference.prototype.__circularp = function (previousRequests){
  var found = this.__camel.find(this.__name);
  if (found){
    return found.circularp(previousRequests);
  }
  else {
    throw new Error("" + this.__name + " is undefined in Camel instance.");
  }
};
