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

  remote.getCurrentWindow().webContents.printToPDF(printOptions, (err, data) => {
    if(err) throw err
    fs.writeFile(my.pdf_path, data, (err) => {
      if(err) throw err
      F.notify(`PDF exporté avec succès sous le nom « ${pdf_name} »`)
    })
  })

}
