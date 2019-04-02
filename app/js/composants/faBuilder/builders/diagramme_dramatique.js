'use strict'

module.exports = function(options){
  my.log("* Construction du diagramme dramatique")
  let str = ''
  str += '<h1 id="diagramme_dramatique-title">Diagramme dramatique</h1>'
  str += '<section id="diagramme_dramatique">'
  str += my.generalDescriptionOf('diagramme_dramatique')
  // TODO Faire le diagramme à partir des events qrd (utilise le filtre universel)
  str += '</section>'
  return str
}
