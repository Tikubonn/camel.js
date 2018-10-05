
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
