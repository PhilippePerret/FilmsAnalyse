'use strict'
/**
 * Export de l'analyse au format PDF
 *
 */
module.exports = function(options){
  var my = this
    , src_name
    , src_format
    ;
    
  if(undefined === options) options = {}

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
  var cmd = `cd ${my.a.folder};pandoc -o ./exports/${my.a.pdf_name} ./exports/${src_name} --metadata-file=./exports/metadata.yaml --css=/Users/philippeperret/Programmation/Electron/FilmsAnalyse/app/analyse_files/css/publishing.css --toc --toc-depth=2 --epub-cover-image='./exports/img/cover.jpg'`

  // console.log("cmd pandoc:", cmd)
  exec(cmd, (error, stdout, stderr) => {
    if(error)throw(error)
    my.log(`=== Création du livre PDF (à partir du format ${src_format}) terminé avec succès.`)
    F.notify(`Création du livre PDF (à partir du format ${src_format}) terminé avec succès.`)
  });

  // let printOptions = {
  //   marginsType:2,
  //   pageSize:"A4",
  //   landscape:false,
  //   printBackground:true
  // }
  //
  // remote.getCurrentWindow().webContents.printToPDF(printOptions, (err, data) => {
  //   if(err) throw err
  //   fs.writeFile(my.a.pdf_path, data, (err) => {
  //     if(err) throw err
  //     my.log(`=== PDF exporté avec succès sous le nom « ${my.a.pdf_name} »`)
  //     F.notify(`PDF exporté avec succès sous le nom « ${my.a.pdf_name} »`)
  //   })
  // })

}
