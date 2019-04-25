'use strict'
/**
  Helpers pour les QRD
**/

Object.assign(FAEnote,{

})


Object.assign(FAEnote.prototype,{
/**
  Version note de l'event

  Noter que l'indice de la note (this.indice_note) doit avoir été défini
  avant d'appeler cette méthode.
  @param {Object} options   Options de formatage
**/
asNote(options){
  var str = ''
  if(undefined === this.indice_note) this.indice_note = FATexte.newIndiceNote()
  str += `<div class="note"><span class="note-indice">[${this.indice_note}]</span> ${DFormater(this.content)}</div>`
  return str
}

})


Object.defineProperties(FAEnote.prototype,{
})
