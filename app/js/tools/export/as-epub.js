'use strict'


var util = require('util')
var exec = require('child_process').exec

module.exports = options => {
  let my = current_analyse

  // On sauve le code actuel dans un fichier
  // TODO

  // On pandocque ce fichier en epub
  // TODO
  console.log("Création du ePub…")

  if(!fs.existsSync(my.folderExport)) fs.mkdirSync(my.folderExport)

  if(!fs.existsSync(my.html_path)){
    throw("Il faut construire le fichier HTML (en demandant l'affichage de l'analyse complète) pour pouvoir éditer l'ePub, pour le moment.")
  }

  var cmd = `cd ${my.folder};pandoc -o ./exports/${my.epub_name} ./exports/${my.html_name} --css=/Users/philippeperret/Programmation/Electron/FilmsAnalyse/app/building/css/publishing.css --epub-cover-image='./exports/cover.jpg'`
  console.log("cmd pandoc:", cmd)
  exec(cmd, (error, stdout, stderr) => {
    if(error)throw(error)
    console.log("Création du livre ePub terminé avec succès.")
    F.message("Création du livre ePub terminé avec succès.")
  });



  // pandoc -o OUTPUTNAME.epub INPUTNAME.md --toc --toc-depth=2 --epub-cover-image=COVERIMAGE.png


}
