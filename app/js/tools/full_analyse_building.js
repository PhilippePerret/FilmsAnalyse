'use strict'
/**
 * Module de construction de l'analyse complète
 */
// const fs = require('fs')

// +format+ peut être 'html' ou 'markdown'. C'est 'html' par défaut pour
// le moment, en attendant de savoir quel format sera le plus pratique.
module.exports = function(format){
  var my = current_analyse

  var temp_html_path = path.join('./app/building/template.html')
  fs.copyFileSync(temp_html_path, my.html_path)

}
