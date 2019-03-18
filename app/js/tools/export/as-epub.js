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

  var src_name, src_format

  if(fs.existsSync(my.md_path)){
    src_name    = my.md_name
    src_format  = 'Markdown'
  } else if(fs.existsSync(my.html_path)){
    src_name    = my.html_name
    src_format  = 'HTML'
  } else {
    console.log("Pas de fichier source trouvé, il faut que je le crée d'abord (au format markdown)")
    src_name    = my.md_name
    src_format  = 'Markdown'
    my.exportAs('md')
  }

  // HTML -> ePub
  // var cmd = `cd ${my.folder};pandoc -o ./exports/${my.epub_name} ./exports/${my.html_name} --css=/Users/philippeperret/Programmation/Electron/FilmsAnalyse/app/building/css/publishing.css --epub-cover-image='./exports/cover.jpg'`

  // Markdown -> ePub
  var cmd = `cd ${my.folder};pandoc -o ./exports/${my.epub_name} ./exports/${src_name} --metadata-file=./exports/metadata.yaml --css=/Users/philippeperret/Programmation/Electron/FilmsAnalyse/app/building/css/publishing.css --toc --toc-depth=2 --epub-cover-image='./exports/cover.jpg'`

  // console.log("cmd pandoc:", cmd)
  exec(cmd, (error, stdout, stderr) => {
    if(error)throw(error)
    console.log(`Création du livre ePub (à partir du format ${src_format}) terminé avec succès.`)
    F.notify(`Création du livre ePub (à partir du format ${src_format}) terminé avec succès.`)
  });



  // pandoc -o OUTPUTNAME.epub INPUTNAME.md --toc --toc-depth=2 --epub-cover-image=COVERIMAGE.png


}
