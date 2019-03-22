'use strict'

ABuilder.prototype.builderScenier = function(options){
  // Note : on doit se servir de l'objet PFA pour le faire
  my.log("* Construction du scénier du film…")
  let str = ''
  current_analyse.forEachScene(function(scene){ str += scene.output(options)})
  return str
}
