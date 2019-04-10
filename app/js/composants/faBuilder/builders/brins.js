'use strict'
/**
  Module de construction des brins pour le livre
**/

module.exports = function(options){
  let my = this
  my.log("* Construction des brins du film…")
  let str = ''
  str += '<h1 id="brins-title">Brins du film</h1>'
  str += '<section id="brins">'
  str += my.generalDescriptionOf('brins')
  str += BrinsBuilder.output({format:'html'})
  str += '</section>'
  return str
}

const BrinsBuilder = {
/**
  Sortie générale du code des brins
**/
output(options){
  var inner
  if(undefined === options) options = {}
  if(FABrins.count === 0) {
    log.warning('Construction du chapitre des BRINS demandée, mais aucun brin défini.')
    return '<span class="warning">[LES BRINS SONT À DÉFINIR]</span>'
  }
  
  if(options.format === 'html'){
    return inner.outerHTML
  } else {
    return inner
  }
}


}// /Fin BrinsBuilder
