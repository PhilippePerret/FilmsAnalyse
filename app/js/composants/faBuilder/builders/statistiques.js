'use strict'

module.exports = function(options){
  my.log("* Construction des statistiques…")
  let str = ''
  str += '<h1 id="statistiques-title">Statistiques</h1>'
  str += '<section id="statistiques">'
  str += my.generalDescriptionOf('statistiques')
  // TODO Créer les statistiques
  str += '</section>'
  return str
}
