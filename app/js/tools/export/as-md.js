'use strict'
/**
 * Export de l'analyse au format Markdown
 *
 * Contrairement aux autres formats d'export (exception fait de HTML), cet
 * export doit construire l'analyse courante, à partir de tous ses éléments.
 * Le format Markdown permettra de générer les autres format
 */

// Double retour chariot
const DRC = `

`

const BUILDING_FOLDER = path.resolve(path.join('./app/building'))
console.log("BUILDING_FOLDER:", BUILDING_FOLDER)

function tempPathOf(affixe){
  if(!affixe.match(/\./)) affixe += '.md'
  return path.join(BUILDING_FOLDER,affixe)
}

FAnalyse.prototype.filePathOf = function(affixe){
  if(!affixe.match(/\./)) affixe += '.md'
  return path.join(this.folderFiles,affixe)
}

/**
 * Fonction qui ajoute le contenu du fichier de clé +key_doc+ ou prend le
 * fichier template dans le cas de non existence.
 *
 * +key_doc+ La clé, qui correspond à l'affixe du document. P.e. 'introduction'
 */
function appendContenuOf(key_doc) {
  var my = current_analyse

  var tempPath  = tempPathOf(key_doc)
  var anaPath   = my.filePathOf(key_doc)
  var contenu = null
  if(fs.existsSync(anaPath)) {
    fs.appendFileSync(my.md_path, fs.readFileSync(anaPath) + DRC, 'utf8')
  } else if (fs.existsSync(tempPath)) {
    fs.appendFileSync(my.md_path, fs.readFileSync(tempPath) + DRC, 'utf8')
  } else {
    // Aucun des deux fichiers n'a été trouvé, on ne fait rien
  }
}

module.exports = options => {
  var my = current_analyse

  appendContenuOf('introduction')
  appendContenuOf('synopsis')
  appendContenuOf('fondamentales')
  appendContenuOf('pfa')
  appendContenuOf('au_fil_du_film')
  appendContenuOf('personnages')
  appendContenuOf('themes')
  appendContenuOf('lecon_tiree')
  appendContenuOf('conclusion')
  appendContenuOf('annexes')
  appendContenuOf('common_links')

}
