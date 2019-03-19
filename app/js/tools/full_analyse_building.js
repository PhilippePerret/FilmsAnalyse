'use strict'
/**
 * Module de construction de l'analyse complète
 */
// const fs = require('fs')

// +format+ peut être 'html' ou 'markdown'. C'est 'html' par défaut pour
// le moment, en attendant de savoir quel format sera le plus pratique.
module.exports = format => {
  var my = current_analyse

  if(!fs.existsSync(my.html_path)){
    console.log("Le format HTML n'existe pas. Je dois le construire.")
    my.exportAs('md')
    my.exportAs('html')
  }

  // Demander le chargement de la page dans la fenêtre de visualisation
  // de l'analyse.
  ipc.send('load-url-in-pubwindow', {path: my.html_path})

}
