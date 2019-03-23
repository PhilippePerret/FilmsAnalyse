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
module.exports = function(options, fn_callback){
  var my = this

  // Markdown -> HTML
  var cmd = `cd ${my.a.folder};pandoc -o ./exports/${my.a.html_name} ./exports/${my.a.md_name} --metadata-file=./exports/metadata.yaml --css=/Users/philippeperret/Programmation/Electron/FilmsAnalyse/app/analyse_files/css/publishing.css --toc --toc-depth=2 --epub-cover-image='./exports/img/cover.jpg'`

  // console.log("cmd pandoc:", cmd)
  exec(cmd, (error, stdout, stderr) => {
    if(error)throw(error)
    my.log(`=== Création du format HTML (à partir du format Markdown) terminé avec succès.`)
    F.notify(`Création du format HTML (à partir du format Markdown) terminé avec succès.`)
    fn_callback()
  });

}
