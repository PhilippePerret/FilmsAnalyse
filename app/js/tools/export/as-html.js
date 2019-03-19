'use strict'
/**
 * Module de construction de l'analyse complète en HTML
 */
const exec = require('child_process').exec

/**
 * +options+
 *
 *
 */
module.exports = options => {
  var my = current_analyse

  // Markdown -> HTML
  var cmd = `cd ${my.folder};pandoc -o ./exports/${my.html_name} ./exports/${my.md_name} --metadata-file=./exports/metadata.yaml --css=/Users/philippeperret/Programmation/Electron/FilmsAnalyse/app/building/css/publishing.css --toc --toc-depth=2 --epub-cover-image='./exports/cover.jpg'`

  // console.log("cmd pandoc:", cmd)
  exec(cmd, (error, stdout, stderr) => {
    if(error)throw(error)
    console.log(`Création du format HTML (à partir du format Markdown) terminé avec succès.`)
    F.notify(`Création du format HTML (à partir du format Markdown) terminé avec succès.`)
  });

}
