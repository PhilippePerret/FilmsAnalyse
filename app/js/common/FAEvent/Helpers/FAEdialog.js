'use strict'
/**
  Helpers pour les QRD
**/

Object.assign(FAEdialog,{

})


Object.assign(FAEdialog.prototype,{

// Par exemple pour le reader
asFull(){
  var str = ''
  str +=  `« ${this.quote} » <span class="bold">${this.titre||''}</span> — ${this.content}`
  return str
}

})


Object.defineProperties(FAEdialog.prototype,{
})
