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
   * Créer une nouvelle instance de builder et la retourne (pour le chainage)
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
    if(false == this.isUpToDate || options.force_update) this.build(options)
    ipc.send('display-analyse')
    ipc.send('load-url-in-pubwindow', {path: this.html_path})
  }
  /**
   * Fonction principale construisant l'analyse
   *
   * "Construire l'analyse", pour le moment consiste à produire le document
   * Markdown rassemblant tous les éléments.
   */
  build(options){
    this.building = true
    this.log('*** Construction de l’analyse…')
    var my = this
    if(fs.existsSync(my.md_path)) fs.unlinkSync(my.md_path)
    if(fs.existsSync(my.a.html_path)) fs.unlinkSync(my.a.html_path)
    this.exportAs('md', options)
    this.exportAs('html', options)
    this.log('=== Fin de la construction de l’analyse')
    this.building = false
    my = null
  }

  exportAs(format, options){
    var my = this
    my.log(`* exportAs "${format}". Options:`, options)
    if(!this.building && !this.isUpToDate) this.build()
    var method = require(`./js/composants/faBuilder/exporters/as-${format}.js`).bind(this)
    method(options)
  }


  /**
   * Retourne true si l'analyse précédemment construite est à jour
   */
  get isUpToDate(){
    var my = this
    if (!fs.existsSync(my.md_path)){
      my.log("  = Fichier MD inexistant => CREATE")
      return false
    }
    var mdFileDate = fs.statSync(my.md_path).mtime
    var lastChangeDate = 0
    lastChangeDate = this.getLastChangeDateIn('analyse_files', lastChangeDate)
    if(lastChangeDate > mdFileDate){
      my.log("  = Modifications récentes opérées dans 'analyse_files' => UPDATE")
      return false
    }
    lastChangeDate = this.getLastChangeDateIn('exports/img', lastChangeDate)
    if(lastChangeDate > mdFileDate){
      my.log("  = Modifications récentes opérées dans 'exports/img' => UPDATE")
      return false
    }
    // Fichiers individuels
    lastChangeDate = this.getLastChangeDateIn(['events.json'], lastChangeDate)
    if(lastChangeDate > mdFileDate){
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
  log(msg, args){
    if(undefined === this.logs) this.logs = []
    this.logs.push({msg: msg, args: args})
    if (args) console.log(msg, args)
    else console.log('%c'+msg,'color:blue;margin-left:4em;font-family:Arial;')
  }

  // ---------------------------------------------------------------------
  //  Raccourcis

  get a(){ return this.analyse }
  get md_path()   { return this.a.md_path }
  get html_path() { return this.a.html_path }

}
