'use strict'
/**
 * Classe FABuilder  (pour "Analyze Builder")
 * --------------
 * Pour construire l'analyse
 *
 */

class FABuilder {
// ---------------------------------------------------------------------
//  CLASSE

/**
 * Créer une nouvelle instance de builder et la retourner (pour le chainage)
 */
static createNew(){
  this.currentBuilder = new FABuilder(current_analyse)
  return this.currentBuilder
}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse){
  this.analyse = analyse
}

/**
 * Pour afficher l'analyse construite
 */
show(options){
  if(undefined === options) options = {}
  if(false == this.isUpToDate || options.force_update) this.build(options, this.showReally.bind(this))
}
showReally(){
  ipc.send('display-analyse')
  ipc.send('load-url-in-pubwindow', {path: this.html_path})
}
/**
* Fonction principale construisant l'analyse
*
* "Construire l'analyse", pour le moment consiste à produire le document
* Markdown rassemblant tous les éléments.
*/
build(options, fn_callback){
  this.building = true
  this.log('*** Construction de l’analyse…')
  this.report.add('Début de la construction de l’analyse', 'title')
  var my = this
  my.options = options
  my.rebuildBaseFiles(fn_callback)
  this.log('=== Fin de la construction de l’analyse')
  this.report.add('Fin de la construction de l’analyse', 'title')
  this.building = false
  this.report.show()
  this.report.saveInFile()
  my = null
}

rebuildBaseFiles(fn_callback){
  this.destroyBaseFiles()
  this.buildChunks()
  this.exportAs('html', this.options, fn_callback)
}
destroyBaseFiles(){
  if(fs.existsSync(this.a.html_path)) fs.unlinkSync(this.a.html_path)
}

/**
  Construit tous les bouts de codes HTML qui vont servir plus tard à
  assembler le fichier HTML final.
**/
buildChunks(){
  var method = require(`./js/composants/faBuilder/builders/build-chunks.js`).bind(this)
  method(this.options)
}

// ---------------------------------------------------------------------
buildAs(format, options){
  var my = this
  my.log(`* buildAs "${format}". Options:`, options)
  if(!this.building && !this.isUpToDate) this.build()
  var method = require(`./js/composants/faBuilder/builders/as-${format}.js`).bind(this)
  method(options)
}

exportAs(format, options, fn_callback){
  var my = this
  my.log(`* exportAs "${format}". Options:`, options)
  if(!this.building && !this.isUpToDate) this.build()
  var method = require(`./js/composants/faBuilder/exporters/as-${format}.js`).bind(this)
  method(options, fn_callback)
}


/**
* Retourne true si l'analyse précédemment construite est à jour
*/
get isUpToDate(){
  var my = this
  if (!fs.existsSync(my.html_path)){
    my.log("  = Fichier MD inexistant => CREATE")
    return false
  }
  var htmlFileDate = fs.statSync(my.html_path).mtime
  var lastChangeDate = 0
  lastChangeDate = this.getLastChangeDateIn('analyse_files', lastChangeDate)
  if(lastChangeDate > htmlFileDate){
    my.log("  = Modifications récentes opérées dans 'analyse_files' => UPDATE")
    return false
  }
  lastChangeDate = this.getLastChangeDateIn('exports/img', lastChangeDate)
  if(lastChangeDate > htmlFileDate){
    my.log("  = Modifications récentes opérées dans 'exports/img' => UPDATE")
    return false
  }
  // Fichiers individuels
  lastChangeDate = this.getLastChangeDateIn(['events.json'], lastChangeDate)
  if(lastChangeDate > htmlFileDate){
    my.log("  = Modifications récentes opérées dans les fichiers => UPDATE")
    return false
  }
  // Finalement, c'est donc up-to-date
  return true
}

// ---------------------------------------------------------------------
//  Méthodes de fichier

/**
* Méthode qui retourne la date la plus récente dans le dossier +folder+
* de l'analyse du builder courant
*/
getLastChangeDateIn(folder, lastDate){
  var my = this
  my.log('* Recherche de l’antériorité des fichiers…')
  var files, fpath, file
  if(Array.isArray(folder)){
    // <= folder est un Array
    // => Donc c'est une liste de fichiers (chemins relatifs)
    files = folder.map(fpath => path.join(this.a.folder, fpath))
  } else {
    // <= folder n'est pas un Array
    // => C'est le path d'un dossier à fouiller
    fpath = path.join(this.a.folder,folder)
    files = glob.sync(`${fpath}/**/*.*`)
  }
  for(file of files){
    var t = fs.statSync(file).mtime
    my.log(`  - Check de : ${file} (${t})`)
    if(t > lastDate) lastDate = t
  }
  return lastDate
}

// ---------------------------------------------------------------------
//  Méthodes utilitaires

/**
 * Pour le log de la procédure
 */
log(msg, args){ this.constructor.log(msg, args) }
  static log(msg, args){
    if(undefined === this.logs) this.logs = []
    this.logs.push({msg: msg, args: args})
    if (args) console.log(msg, args)
    else console.log('%c'+msg,'color:blue;margin-left:4em;font-family:Arial;')
}

// ---------------------------------------------------------------------
//  Raccourcis

get a(){ return this.analyse }
get wholeHtmlPath(){return this._wholeHtmlPath||defP(this,'_wholeHtmlPath', path.join(this.folderChunks,'wholeHTML.html'))}
get folderChunks(){
  if(undefined === this._folderChunks){
    this._folderChunks = path.join(this.a.folderExport, '.chunks')
    if(!fs.existsSync(this._folderChunks)){
      fs.mkdirSync(this._folderChunks)
    }
  }
  return this._folderChunks
}
get md_path()   { return this.a.md_path }
get html_path() { return this.a.html_path }
get report(){return this._report||defP(this,'_report', new FAReport('analyse-building'))}

}
