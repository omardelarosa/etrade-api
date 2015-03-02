Object.prototype.merge = function(object, inherit){
  if(inherit) {
    for (var attrname in object) { this[attrname] = object[attrname]; }
  } else {
    for( var attrname in object) {
      if(!this[attrname]) {
        this[attrname] = object[attrname];
      }
    }
  }
};
