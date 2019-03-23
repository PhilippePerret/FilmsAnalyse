'use strict'
/**
* Sortie au format Kindle
*
* Note : pour le dépôt sur Amazone, l'image doit être à part.
*
**/

var util = require('util')
var exec = require('child_process').exec

module.exports = function(options){
  let my = this

  if(!fs.existsSync(my.a.folderExport)) fs.mkdirSync(my.a.folderExport)

  // Il faut trouver un format de fichier

  var src, format_src

  if (fs.existsSync(my.a.html_path)){
    format_src = 'HTML'
    src = my.a.html_path
  } else if (fs.existsSync(my.a.md_path)) {
    format_src = 'Markdown'
    src = my.a.md_path
  } else if (fs.existsSync(my.a.epub_path)) {
    format_src = 'ePub'
    src = my.a.epub_path
  } else {
    my.log("- Aucun fichier original trouvé, je vais créer le format ePub pour m'en servir.")
    format_src = 'ePub'
    my.exportAs('epub')
  }

  if(fs.existsSync(my.a.kindle_path)){fs.unlinkSync(my.a.kindle_path)}
  var cmd = `kindlegen "${src}"`

  my.log("cmd kindlegen:", cmd)
  exec(cmd, (error, stdout, stderr) => {
    if(error)throw(error)
    my.log(`=== Création du livre Kindle (depuis le format ${format_src}) terminé avec succès.`)
    F.notify(`Création du livre Kindle (depuis le format ${format_src}) terminé avec succès.`)
  });
}
