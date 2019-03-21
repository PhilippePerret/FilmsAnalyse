'use strict'
/**
 * Export de l'analyse au format Markdown
 *
 * Contrairement aux autres formats d'export (exception fait de HTML), cet
 * export construit en fait l'analyse courante, à partir de tous ses éléments.
 * Le format Markdown permettra de générer les autres format
 */

// Double retour chariot
const DRC = `

`
/**
 * Fonction qui ajoute le contenu du fichier de clé +key_doc+ ou prend le
 * fichier template dans le cas de non existence.
 *
 * +key_doc+ La clé, qui correspond à l'affixe du document. P.e. 'introduction'
 */
ABuilder.prototype.appendContenuOf = function(key_doc) {
  var my = this
  var ca = my.analyse

  // Le document template, dans le cas où le document original n'existerait pas
  // On l'utilise s'il est demandé par le script de construction.
  var tempPath  = ca.tempFilePathOf(key_doc)
  var anaPath   = ca.filePathOf(key_doc)
  if(fs.existsSync(anaPath)) {
    var itexte = new FATexte(fs.readFileSync(anaPath, 'utf8'))
    fs.appendFileSync(ca.md_path, itexte.formate() + DRC, 'utf8')
    itexte = null
  } else if (fs.existsSync(tempPath)) {
    fs.appendFileSync(ca.md_path, fs.readFileSync(tempPath, 'utf8') + DRC, 'utf8')
  } else {
    // Aucun des deux fichiers n'a été trouvé, on ne fait rien
    console.log("Fichier non trouvé : ", key_doc)
  }
}

/**
 * Pour la construction d'éléments à construire comme les fondamentales ou
 * le paradigme de Field augmenté
 */
ABuilder.prototype.appendBuildingOf = function(what){
  var my = this
  var ca = my.analyse
  var finalCode = ""
  finalCode += `<!-- BUILD ${what} -->${RC}`
  switch (what.toUpperCase()) {
    case 'INFOS FILM':
      finalCode += my.loadAndRunBuilder('infos_film')
      break
    case 'FONDAMENTALES':
      finalCode += my.loadAndRunBuilder('fondamentales')
      break
    case 'PFA':
      finalCode +=  my.loadAndRunBuilder('pfa')
      break;
    case 'DIAGRAMME DRAMATIQUE':
      finalCode +=  my.loadAndRunBuilder('diagramme_dramatique')
      break
    case 'DIAGRAMME QRD':
      finalCode +=  my.loadAndRunBuilder('diagramme_qrd')
      break
    case 'STATISTIQUES':
      finalCode +=  my.loadAndRunBuilder('statistiques')
      break
    default:

  }
  fs.appendFileSync(ca.md_path, finalCode + DRC, 'utf8')
}

/**
* Méthode qui charge le builder du +composant+ et lance
* sa construction.
* Retourne le code construit.
**/
ABuilder.prototype.loadAndRunBuilder = function(composant){
  return '' // pour le moment
}

module.exports = function(options){
  var my = this // instance ABuilder

  // Existe-t-il un scénario de construction ?
  var bScriptPath = my.a.filePathOf('building_script.md')
  if(!fs.existsSync(bScriptPath)){
    // <= Le script de construction n'existe pas
    // => On prend le script standard
    var bScriptPath = my.a.tempFilePathOf('building_script.md')
  }

  var bScript = fs.readFileSync(bScriptPath, 'utf8')

  bScript.split(RC).forEach(function(line){
    if(line.trim() == '' || line.substring(0,1) == '#') return
    var dline   = line.trim().split(' ')
    if (dline.length < 2) return
    var command = dline.shift()
    var args    = dline.join(' ')
    switch (command.toUpperCase()) {
      case 'FILE':
        return my.appendContenuOf(args.toLowerCase())
      case 'BUILD':
        return my.appendBuildingOf(args.toLowerCase())
      default:
        console.error("Je ne connais pas la commande building script:", command.toUpperCase())
    }
  })

}
