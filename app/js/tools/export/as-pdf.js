'use strict'
/**
 * Export de l'analyse au format PDF
 *
 */
module.exports = options => {
  var my = current_analyse

  if(undefined === options) options = {}

  let printOptions = {
    marginsType:2,
    pageSize:"A4",
    landscape:false,
    printBackground:true
  }

  let pdf_name = `${my.filmId}-v${my.hversion||'0.0.1'}.pdf`
  if(!fs.existsSync(my.folderExport)) fs.mkdirSync(my.folderExport)
  let pdf_path = path.join(my.folderExport, pdf_name)

  remote.getCurrentWindow().webContents.printToPDF(printOptions, (err, data) => {
    if(err) throw err
    fs.writeFile(pdf_path, data, (err) => {
      if(err) throw err
      F.notify(`PDF exporté avec succès sous le nom « ${pdf_name} »`)
    })
  })

}
