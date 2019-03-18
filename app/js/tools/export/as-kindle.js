'use strict'


var util = require('util')
var exec = require('child_process').exec

module.exports = options => {
  let my = current_analyse

  if(!fs.existsSync(my.folderExport)) fs.mkdirSync(my.folderExport)

  // Il faut trouver un format de fichier

  var src, format_src

  if (fs.existsSync(my.html_path)){
    format_src = 'HTML'
    src = my.html_path
  } else if (fs.existsSync(my.md_path)) {
    format_src = 'Markdown'
    src = my.md_path
  } else if (fs.existsSync(my.epub_path)) {
    format_src = 'ePub'
    src = my.epub_path
  } else {
    console.log("Aucun fichier original trouvé, je vais créer le format ePub pour m'en servir.")
    format_src = 'ePub'
    my.exportAs('epub')
  }

  if(fs.existsSync(my.kindle_path)){fs.unlinkSync(my.kindle_path)}
  var cmd = `kindlegen "${src}"`

  console.log("cmd kindlegen:", cmd)
  exec(cmd, (error, stdout, stderr) => {
    if(error)throw(error)
    console.log(`Création du livre Kindle (depuis le format ${format_src}) terminé avec succès.`)
    F.notify(`Création du livre Kindle (depuis le format ${format_src}) terminé avec succès.`)
  });



  // pandoc -o OUTPUTNAME.epub INPUTNAME.md --toc --toc-depth=2 --epub-cover-image=COVERIMAGE.png


}
