'use strict'

Number.prototype.between = function(min, max, strict){
  var v = this.valueOf()
  if(strict){
    return v > min && v < max
  } else {
    return v >= min && v <= max
  }
}
