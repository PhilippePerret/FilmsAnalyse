'use strict'
/**
 * Classe ABuilder  (pour "Analyze Builder")
 * --------------
 * Pour construire l'analyse
 *
 */

class ABuilder {
  // ---------------------------------------------------------------------
  //  CLASSE

  /**
   * Créer une nouvelle instance de builder et la retourne (pour le chainage)
   */
  static createNew(){
    this.currentBuilder = new ABuilder(current_analyse)
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
  show(){
    if(!this.isUpToDate) this.build()
    F.notify("Je vais afficher l'analyse construite.")
    // L'analyse s'affiche dans une nouvelle fenêtre, on demande au main process
    // de l'ouvrir
    // TODO : libérer :
    // ipc.send('display-analyse')
    // ipc.send('load-url-in-pubwindow', {path: my.html_path})
  }
  /**
   * Fonction principale construisant l'analyse
   *
   * "Construire l'analyse", pour le moment consiste à produire le document
   * Markdown rassemblant tous les éléments.
   */
  build(){
    var my = this
    console.log("Je dois actualiser l'analyse")
    if(fs.existsSync(my.md_path)) fs.unlinkSync(my.md_path)
    my = null
  }

  exportAs(format, options){
    var method = require(`./exporters/as-${format}.js`).bind(this)
    method(options)
  }


  /**
   * Retourne true si l'analyse précédemment construite est à jour
   */
  get isUpToDate(){
    var my = this
    if (!fs.existsSync(my.md_path)) return false
    var mdFileDate = fs.statSync(my.md_path).mtime
    var lastChangeDate = 0
    // lastChangeDate = this.getLastChangeDateIn('analyse_files', lastChangeDate)
    // if(lastChangeDate > mdFileDate){
    //   console.log("Des modifications ont été opérées dans 'analyse_files'")
    //   return false
    // }
    lastChangeDate = this.getLastChangeDateIn('exports/img', lastChangeDate)
    if(lastChangeDate > mdFileDate){
      console.log("Des modifications ont été opérées dans 'exports/img'")
      return false
    }
    // Fichiers individuels
    lastChangeDate = this.getLastChangeDateIn(['events.json'], lastChangeDate)
    if(lastChangeDate > mdFileDate){
      console.log("Des modifications ont été opérées dans les fichiers")
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
    console.log("Fichiers checkés : ", files)
    for(file of files){
      var t = fs.statSync(file).mtime
      if(t > lastDate) lastDate = t
    }
    return lastDate
  }

  // ---------------------------------------------------------------------
  //  Raccourcis
  get a(){ return this.analyse }
  get md_path()   { return this.a.md_path }
  get html_path() { return this.a.html_path }

}
