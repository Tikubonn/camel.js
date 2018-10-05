
/**
 * @param {string} name
 * @param {Object} options
 * @extends {CamelRequestBase}
 * @constructor
 */

function CamelRequest (name, options){
  
  if (options == undefined){
    options = new Object();
  }
  
  this.__name = name;
  this.__options = options;
  this.__http = null;
}

CamelRequest.prototype = 
  Object.create(CamelRequestBase.prototype);

/** 
 * @return {string}
 */

CamelRequest.prototype.name = function (){
  return this.__name;
};

/**
 * @return {Promise}
 */

CamelRequest.prototype.__makePromise = function (){
  function promiseFunction (resolve, reject){
    function onSuccess (){
      resolve(this.__http);
    }
    function onFailed (){
      this.__options["necessary"] == undefined ? reject(this.http):
      this.__options["necessary"] ? reject(this.http): resolve(this.http);
    }
    function onReadyStateChange (){
      if (this.__http.readyState == 4){
        if (this.__http.status == 200){
          onSuccess.call(this);
        }
        else {
          onFailed.call(this);
        }
      }
    }
    if (this.__http.readyState == 4){
      if (this.__http.status == 200){
        onSuccess.call(this);
      }
      else {
        onFailed.call(this);
      }
    }
    else {
      this.__http.addEventListener(
        "readystatechange",
        onReadyStateChange.bind(this));
    }
  }
  return new Promise(
    promiseFunction.bind(this));
};

/**
 * @return {Promise}
 */

CamelRequest.prototype.download = function (){
  if (this.__http == null){
    this.__http = new XMLHttpRequest();
    this.__http.open(
      this.__options["method"] == undefined ? "GET":
      this.__options["method"],
      this.__name,
      this.__options["async"] == undefined ? true:
      this.__options["async"]
    );
    if (this.__options["header"]){
      var header = this.__options["header"];
      var names = Object.keys(header);
      var index;
      for (index = 0; index < names.length; index++){
        var name = names[index];
        this.__http.setRequestHeader(name, header[name]);
      }
    }
    if (this.__options["mime"]){
      this.__http.overrideMimeType(
        this.__options["mime"]);
    }
    else {
      var mime = camelMime(this.__name);
      if (mime){
        this.__http.overrideMimeType(mime);
      }
    }
    this.__http.send(
      this.__options["param"] == undefined ? null:
      this.__options["param"]
    );
    return this.__makePromise();
  }
  else {
    return this.__makePromise();
  }
};

/**
 * @return {XMLHttpRequest}
 */

CamelRequest.prototype.get = function (){
  if (this.__http.readyState == 4){
    if (this.__http.status == 200){
      return this.__http;
    }
    else {
      throw new Error("");
    }
  }
  else {
    throw new Error("");
  }
};

/**
 * @param {Array} previousRequests
 * @return {boolean}
 */

CamelRequest.prototype.__circularp = function (previousRequests){
  return 0 <= previousRequests.indexOf(this);
};

window["CamelRequest"] = CamelRequest;
