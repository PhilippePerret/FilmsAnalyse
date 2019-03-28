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

  var cmd_metadata = ''
  if(fs.existsSync(path.resolve(my.a.folder,'exports','metadata.yaml'))){
    cmd_metadata = " --metadata-file=./exports/metadata.yaml"
    my.report.add("Méta-données définies dans le fichier './exports/metadata.yaml'.")
  } else {
    my.report.add("Pas de méta-données définies. Vous devriez le faire dans le fichier './exports/metadata.yaml'.", 'warning')
  }

  var cmd_epub_cover = ''
  if(fs.existsSync(path.resolve(my.a.folder,'exports','img','cover.jpg'))){
    cmd_epub_cover = " --epub-cover-image='./exports/img/cover.jpg'"
    my.report.add("Image de couverture ajoutée (./exports/img/cover.jpg)")
  } else {
    my.report.add("Pas d'image de couverture (./exports/img/cover.jpg)", 'warning')
  }


  var cmd = `cd ${my.a.folder};pandoc -o ./exports/${my.a.html_name} -f markdown_mmd ./exports/${my.a.md_name}${cmd_metadata} --css=/Users/philippeperret/Programmation/Electron/FilmsAnalyse/app/analyse_files/css/publishing.css --toc --toc-depth=2${cmd_epub_cover}`

  // console.log("cmd pandoc:", cmd)
  exec(cmd, (error, stdout, stderr) => {
    if(error)throw(error)
    my.log(`=== Création du format HTML (à partir du format Markdown) terminé avec succès.`)
    F.notify(`Création du format HTML (à partir du format Markdown) terminé avec succès.`)
    fn_callback()
  });

}
