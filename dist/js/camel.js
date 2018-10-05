/** 
 * @license Copyright (c) 2018 tikubonn.
 * Released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

(function (){

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

var camelMimeTable = {
  ".js": "application/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".html": "text/html",
  ".htm": "text/html",
  ".xml": "application/xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".oga": "audio/ogg",
  ".ogv": "video/ogg",
  ".aac": "audio/aac",
  ".avi": "video/x-msvideo",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".mpeg": "video/mpeg",
  ".wav": "audio/wav",
  ".mid": "audio/midi",
  ".midi": "audio/midi",
  ".weba": "audio/webm",
  ".webm": "video/webm",
  ".webp": "image/webp"
};

/**
 * @param {string} fname
 * @return {?string}
 */

function camelMime (fname){
  var extensions = Object.keys(camelMimeTable);
  var index = 0;
  while (index < extensions.length){
    var extension = extensions[index];
    if (fname.endsWith(extension)){
      var mime = camelMimeTable[extension];
      if (mime instanceof String || typeof mime == "string"){
        return camelMimeTable[extension];
      }
      else {
        throw new Error("value must be string in camelMimeTable.");
      }
    }
    index = (index+1)|0;
  }
  return null;
}

window["camelMimeTable"] = camelMimeTable;

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

})();
