'use strict'

const exec = require('child_process').exec

module.exports = function(options){
  let my = this

  my.log("*** Création du ePub…")

  if(!fs.existsSync(my.a.folderExport)) fs.mkdirSync(my.a.folderExport)

  var src_name, src_format

  if(fs.existsSync(my.md_path)){
    src_name    = my.a.md_name
    src_format  = 'Markdown'
  } else if(fs.existsSync(my.a.html_path)){
    src_name    = my.a.html_name
    src_format  = 'HTML'
  }

  // HTML -> ePub
  // var cmd = `cd ${my.folder};pandoc -o ./exports/${my.epub_name} ./exports/${my.html_name} --css=/Users/philippeperret/Programmation/Electron/FilmsAnalyse/app/analyse_files/css/publishing.css --epub-cover-image='./exports/cover.jpg'`

  // Markdown -> ePub
  var cmd = `cd ${my.a.folder};pandoc -o ./exports/${my.a.epub_name} ./exports/${src_name} --metadata-file=./exports/metadata.yaml --css=/Users/philippeperret/Programmation/Electron/FilmsAnalyse/app/analyse_files/css/publishing.css --toc --toc-depth=2 --epub-cover-image='./exports/img/cover.jpg'`

  // console.log("cmd pandoc:", cmd)
  exec(cmd, (error, stdout, stderr) => {
    if(error)throw(error)
    my.log(`=== Création du livre ePub (à partir du format ${src_format}) terminé avec succès.`)
    F.notify(`Création du livre ePub (à partir du format ${src_format}) terminé avec succès.`)
  });



  // pandoc -o OUTPUTNAME.epub INPUTNAME.md --toc --toc-depth=2 --epub-cover-image=COVERIMAGE.png


}
