'use strict'

module.exports = function(options){
  // Note : on doit se servir de l'objet PFA pour le faire
  var my = this
  my.log("* Construction du scénier du film…")
  my.report.add('Construction du scénier du film…', 'title')
  let str = ''
  str += "<h1>Scénier</h1>"
  Scene.forEachScene(function(scene){ str += scene.export(options)})
  return str
}
