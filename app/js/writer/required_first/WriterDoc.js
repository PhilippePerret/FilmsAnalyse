'use strict'
/**
 * Class WriterDoc
 * ---------------
 * Classe pour gérer les documents
 */

class WriterDoc {
  constructor(dtype){
    this.type = dtype
  }

  get a() { return current_analyse }

  get modified(){return this._modified || false}
  set modified(v){this._modified = v}

  // Affiche le document
  display(){
    Writer.reset() // pour vider le champ, notamment
    this.preparePerType() // préparer le writer en fonction du type
    if (!this.exists()) return // rien à charger
    else if (!this.loaded) this.load()
    Writer.docField.val(this.contents)
  }

  // Pour afficher la taille du document dans l'interface (gadget)
  displaySize(){
    $('#section-writer #text-size').html(this.contents.length)
  }

  // Pour charger le texte du document
  load(){
    this.contents = fs.readFileSync(this.path, 'utf8')
    this.loaded   = true
    this.displaySize()
    this.modified = false
  }

  // Pour sauver le document
  save(){
    Writer.message('Sauvegarde en cours…')
    this.getContents()
    fs.writeFileSync(this.path, this.contents, 'utf8')
    // TODO Utiliser plutôt les méthodes de sauvegarde protégées
    Writer.message()
    this.modified = false
  }

  /**
   * Pour définir le contenu du document, par exemple au choix d'un modèle
   */
  setContents(code){
    this.contents = code
    this.loaded   = true
    this.modified = true
    // TODO Faire une méthode unique pour afficher le contenu (et régler
    // la longueur et, plus tard, des raccourcis, etc.)
    Writer.docField.val(this.contents)
    this.displaySize()
  }
  /**
   * Pour récupérer le contenu du textearea
   */
  getContents(){
    this.contents = Writer.docField.val()
  }

  /**
   * Préparation de l'interface en fonction du type
   * Notamment, ça fait la liste des documents modèles qui peuvent être
   * utilisés
   */
  preparePerType(){
    var my = this
    var tempFolderPath = path.join('.','app','building', this.type)
    var tempFilePath = `${tempFolderPath}.md`
    if(fs.existsSync(tempFilePath)){
      // <= Un seul fichier
      // => On ne met dans le menu qu'un seul fichier
      this.afficheModeles([tempFilePath])
      my = null
    } else {
      glob(`${tempFolderPath}/**/*.md`, (err, modeles) => {
        my.afficheModeles(modeles)
        my = null
      })
    }
  }
  afficheModeles(modeles){
    var mModeles = $('#section-writer select#modeles-doc')
    var opts = []
    opts.push('<option value="">Choisir le modèle…</option>')
    for(var p of modeles){
      var n = path.basename(p, path.extname(p))
      opts.push(`<option value="${p}">${n}</option>`)
    }
    mModeles.html(opts)
  }

  exists(){ return fs.existsSync(this.path) }

  // Le path du document
  get path(){
    return this._path||defP(this,'_path',path.join(this.a.folderFiles,`${this.type}.md`))
  }

}
