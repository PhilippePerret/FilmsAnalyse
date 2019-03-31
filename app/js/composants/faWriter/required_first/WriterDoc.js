'use strict'
/**
 * Class FAWriterDoc
 * ---------------
 * Classe pour gérer les documents
 *
 *
 */

class FAWriterDoc {
// ---------------------------------------------------------------------
//  CLASSE

/**
* Cette méthode est appelée lorsque l'on clique sur le bouton "+" pour
* créer un nouveau document.
**/
static new(){
  var newDoc = new FAWriterDoc(this.newId())
  FAWriter.makeCurrent(newDoc.id)
  newDoc.setContents('# Titre du nouveau document'+RC+RC)
  FAWriter.message(T('new-custom-document-created'))
}

static newId(){
  if(undefined === this.lastID) this.lastID = 0
  return ++ this.lastID
}

/**
 Méthode retournant l'instance WriterDoc du document d'identifiant
 +doc_id+ qui peut-être soit l'identifiant (string) d'un document
 normalisé (introduction, annexe, etc.) soit l'identifiant (number)
 d'un document personnalisé.
**/
static get(doc_id){
  if(undefined === this.documents) this.documents = {}
  if(undefined === this.documents[doc_id]){
    this.documents[doc_id] = new FAWriterDoc(doc_id)
  }
  return this.documents[doc_id]
}

// ---------------------------------------------------------------------
//  INSTANCE

/**
  Instanciation du document.
  +dtype+ peut être soit le type, par exemple 'introduction', 'personnages',
          soit un nombre pour un document propre à l'analyse courante.
  +id+    Id du document propre à l'analyse, si +dtype+ vaut 'customdoc'.
**/
constructor(dtype, id){
  if(undefined === dtype) throw("Impossible d'instancier un document sans type ou ID.")
  if ('number' === typeof dtype || dtype.match(/^([0-9]+)$/)){
    [dtype, id] = ['customdoc', parseInt(dtype,10)]
  }
  this.type = dtype
  this.id   = id // pour les customdoc
}

// ---------------------------------------------------------------------
//  Méthodes publiques

// Affiche le document
display(){
  FAWriter.reset() // pour vider le champ, notamment
  this.preparePerType() // préparer le writer en fonction du type
  if (this.exists()){
    if (!this.loaded) this.load()
    this.displayContents()
  }
  this.toggleMenuModeles()
}

displayContents(){
  FAWriter.docField.val(this.contents)
}

// Pour afficher la taille du document dans l'interface (gadget)
displaySize(){
  $('#section-writer #text-size').html(this.contents.length)
}

// ---------------------------------------------------------------------
// Méthodes d'helpers

as_link(options){
  if(undefined === options) options = {}
  return `« <a onclick="showDocument('${this.id}')" class="doclink">${options.title || this.title}</a> »`
}

// ---------------------------------------------------------------------
//  Méthodes de données

get a() { return current_analyse }

// Méthode pratique pour reconnaitre rapidement l'element
get isAEvent(){return false}
get isADocument(){return true}

get modified(){return this._modified || false}
set modified(v){
  FAWriter.setModified(v)
  this._modified = v
}
isModified(){return this._modified === true}

get contents(){return this._contents}
set contents(v){
  if (v === this._contents) return
  this._lastContents = `${this._contents}`
  this._contents = v
  this.displaySize()
  this.modified = true
  this.toggleMenuModeles()
}

retreiveLastContents(){
  this._contents  = this._lastContents
  this.modified   = false
}

// Pour charger le texte du document
load(){
  this.iofile.loadIfExists({after: this.endLoading.bind(this), format: 'raw'})
}
endLoading(code){
  this.setContents(code)
  this.loaded   = true
  this.displaySize()
  this.modified = false
}

// Pour sauver le document
save(){
  if(this.saving) return
  this.saving = true
  UI.startWait('Sauvegarde en cours…')
  this.isNewCustom = this.type === 'customdoc' && !this.exists()
  this.iofile.save({after: this.endSaving.bind(this)})
}
endSaving(){
  UI.stopWait()
  this.afterSavingPerType()
  FAStater.update.bind(FAStater)()
  this.modified = false
  this.saving   = false
}

/**
* En fonction des types, des opérations peuvent être nécessaire.
* Par exemple, quand on change les snippets, on doit prendre en compte
* la nouvelle valeur.
**/
afterSavingPerType(){
  switch (this.type) {
    case 'snippets':
      return Snippets.updateData(YAML.safeLoad(this.contents))
    case 'customdoc':
      // Si c'est un nouveau document customisé, il faut l'ajouter
      // au menu des documents
      if (this.isNewCustom){
        delete this.title // Pour forcer sa relecture
        FAWriter.menuTypeDoc.append(DCreate('OPTION', {value: this.id, inner: this.title}))
        FAWriter.menuTypeDoc.val(this.id)
      }
      break
  }
}

/**
 * Pour définir le contenu du document, par exemple au choix d'un modèle
 */
setContents(code){
  this.contents = code
  this.loaded   = true
  this.displayContents()
  this.displaySize()
}

/**
 * Pour récupérer le contenu du textearea
 *
 * TODO Réfléchir à ça :
 * Normalement, si un observeur onchange est placé sur le textarea, il
 * est inutile d'actualiser le contenu quand on change de document (voir où
* on le fait ici).
*
* @return true si le contenu a changé, false otherwise.
 */
getContents(){
  if(this.contents != FAWriter.docField.val()){
    this.contents = FAWriter.docField.val()
    return true
  } else {
    return false
  }
}

/**
 * Préparation de l'interface en fonction du type
 * Notamment, ça fait la liste des documents modèles qui peuvent être
 * utilisés
 */
preparePerType(){
  var my = this
  // Thème par défaut
  FAWriter.applyTheme(this.themePerType)
  // Templates à proposer
  var tempFolderPath = path.join('.','app','analyse_files', this.type)
  var tempFilePath = `${tempFolderPath}.${this.extension}`
  if(fs.existsSync(tempFilePath)){
    // <= Un seul fichier
    // => On ne met dans le menu qu'un seul fichier
    my.afficheModeles([tempFilePath])
    my = null
  } else if (fs.existsSync(tempFolderPath)){
    glob(`${tempFolderPath}/**/*.${this.extension}`, (err, modeles) => {
      my.afficheModeles(modeles)
      my = null
    })
  } else {
    this.maskSpanModeles()
  }
}

// Le menu des modèles ne doit être affiché que si le contenu du document
// est vide.
toggleMenuModeles(){
  var maskIt = this.contents && this.contents.length > 0
  $('#section-writer .header .modeles')[maskIt?'hide':'show']()
}
maskSpanModeles(){
  $('#section-writer .header .modeles').hide()
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

// ---------------------------------------------------------------------
//  Méthodes d'association

addDocument(id_or_type){
  var meme_id = this.id && this.id == id_or_type
  var meme_ty = this.type && this.type == id_or_type
  if( meme_id || meme_ty ){
    return F.error(T('same-document-no-association'))
  } else {
    // Pour le moment, on ne peut pas marquer l'association entre deux
    // document. Le seul moyen de le faire est de l'associer dans le texte.
    F.notify(T('no-association-between-docs'), {error: true})
    this.modified = true
  }
  return true
}
/**
* On passe ici quand on glisse un event dans le texte du document (dans le
* writer)
**/
addEvent(event_id){
  // TODO Comment marquer l'association à un event ? (ligne de commentaire de fin ?)
  this.modified = true
  return true
}

// ---------------------------------------------------------------------
//  Propriétés

get themePerType(){
  if(undefined === this.dataType) throw(`Impossible de trouver les données du type "${this.type}"`)
  if (this.dataType.type == 'data'){
    if (FAWriter.currentTheme != 'data-theme') return 'data-theme'
  } else {
    if ( ! FAWriter.currentTheme ) return 'real-theme'
    else if (FAWriter.currentTheme == 'data-theme') return 'real-theme'
    else return FAWriter.currentTheme
  }
}

/**
* Retourne le titre du document.
*
* Pour un document type (non customdoc), il peut être défini soit par la
* première ligne du fichier (si elle commence par un '# '), soit par le hname
* par défaut.
* Pour un customdoc, c'est la première ligne qui doit commencer par un #, soit
* par le début du texte (les 30 premiers caractères)
*
**/
get title(){
  if(undefined === this._title){
    console.log("Path du document :", this.path, this.type)
    if(this.exists()){
      console.log("Le document existe : ", this.type)
      var buf = Buffer.alloc(100)
      var fd  = fs.openSync(this.path, 'r');
      fs.readSync(fd, buf, 0, 100, 0)
      buf = buf.toString().split(RC)[0]
      if (buf.substring(0,2) == '# '){
        this._title = buf.substring(2, buf.length).trim()
      }
    }
  }
  return this._title || (this.type === 'customdoc' ? `Doc #${this.id}` : this.dataType.hname)
}

/**
* L'instance IOFile du fichier, pour un enregistrement sécure.
**/
get iofile(){return this._iofile||defP(this,'_iofile', new IOFile(this))}

// Les données absolues, en fonction du type
get dataType(){return this._data||defP(this,'_data', DATA_DOCUMENTS[this.type])}

// L'extension (par défaut, 'md', sinon, définie dans DATA_DOCUMENTS)
get extension(){
  return this._extension || defP(this,'_extension', this.dataType.format || 'md')
}

// Le path du document
get path(){ return this._path||defP(this,'_path',this.definePathPerType())}

definePathPerType(){
  if(this.type === 'customdoc'){
    return path.join(this.a.folderFiles,`doc-${this.id}.${this.extension}`)
  } else {
    return path.join(this.a.folderFiles,`${this.type}.${this.extension}`)
  }
}
}
