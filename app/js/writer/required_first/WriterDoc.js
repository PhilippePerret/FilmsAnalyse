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
  set modified(v){
    Writer.header[v?'addClass':'removeClass']('modified')
    Writer.footer[v?'addClass':'removeClass']('modified')
    this._modified = v
  }

  get contents(){return this._contents}
  set contents(v){
    this._contents = v
    this.modified = true
    this.setMenuModeles()
  }

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
    this.iofile.loadIfExists({after: this.endLoading.bind(this)})
  }
  endLoading(code){
    this.setContent(code)
    this.loaded   = true
    this.displaySize()
    this.modified = false
  }

  // Pour sauver le document
  save(){
    if(this.saving) return
    this.saving = true
    Writer.message('Sauvegarde en cours…')
    this.getContents() // actualise le contenu
    this.iofile.save({after: this.endSaving.bind(this)})
    fs.writeFileSync(this.path, this.contents, 'utf8')
    // TODO Utiliser plutôt les méthodes de sauvegarde protégées
    Writer.message()
    this.modified = false
  }
  endSaving(){

    this.saving = false
  }

  /**
   * Pour définir le contenu du document, par exemple au choix d'un modèle
   */
  setContents(code){
    this.contents = code
    this.loaded   = true
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
  // Le menu des modèles ne doit être affiché que si le contenu du document
  // est vide.
  setMenuModeles(){
    var doit = this.contents.trim() == ''
    $('#section-writer .header span.modeles')[doit?'show':'hide']()
  }
  afficheModeles(modeles){
    var mModeles = $('#section-writer select#modeles-doc')
    var opts = []
    opts.push('<option value="">Choisir…</option>')
    for(var p of modeles){
      var n = path.basename(p, path.extname(p))
      opts.push(`<option value="${p}">${n}</option>`)
    }
    mModeles.html(opts)
  }

  /**
   * Retourne TRUE si le document propre à l'analyse, du type, existe.
   *
   * Note : ce document se trouve dans le dossier `analyse_files` de
   * l'analyse.
   */
  exists(){ return fs.existsSync(this.path) }

  get iofile(){return this._iofile||defP(this,'_iofile', new IOFile(this.path))}
  // Le path du document
  get path(){
    return this._path||defP(this,'_path',path.join(this.a.folderFiles,`${this.type}.md`))
  }

}
