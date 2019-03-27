'use strict'
/**
 * Ce module du FAWriter est le module minimum chargé tout le temps, qui
 * contient les données minimum à connaitre.
 */

const FAWriter = {
  class: 'FAWriter'

, inited: false     // Pour savoir s'il a été initié
, ready: false      // pour savoir s'il est préparé
, isOpened: false   // Pour savoir si le writer est ouvert ou fermé

, currentDoc: undefined //l'instance FAWriterDoc courante (elle doit toujours exister)

  /**
   * Ouverture du document de type +typeDoc+ (p.e. 'introduction')
   */
, openDoc(dtype){
    this.message(`Document de type "${dtype}" en préparation…`)
    if(undefined === dtype || '' == dtype){
      if (this.isOpened){
        return this.close()
      } else {
        this.menuTypeDoc.value = 'introduction'
        dtype = 'introduction'
      }
    }
    this.makeCurrent(dtype)
    this.message('Document prêt à être travaillé.')
  }

  /**
   * Fait du document de type +dtype+ le document courant.
   *
   * +kdoc+   Pour les types non customisés, ça correspond à 'type'
   *          Pour les autres, de type 'customdoc', c'est l'identifiant
   */
, makeCurrent(kdoc){
    if(false === this.checkCurrentDocModified()) return
    if(undefined === this.writerDocs) this.writerDocs = {}
    if(undefined === this.writerDocs[kdoc]){
      this.writerDocs[kdoc] = new FAWriterDoc(kdoc)
    }
    this.currentDoc = this.writerDocs[kdoc]
    this.currentDoc.display()
    if(!this.isOpened) this.open()
    if(this.visualizeDoc) this.updateVisuDoc()
    // On "referme" toujours le menu des types (après l'ouverture)
    this.menuTypeDoc.val(kdoc)
  }

  /**
   * Actualise la visualisation du contenu Markdown dans le visualiseur
   */
, updateVisuDoc(){
    var contenu
    if (this.currentDoc.dataType.type === 'data'){
      contenu = '<div>Fichier de données. Pas de formatage particulier.</div>'
    } else {
      contenu = new FATexte(this.docField.val()).formated
    }
    var cmd = `echo "${contenu.replace(/\"/g,'\\"')}" | pandoc`
    exec(cmd, (err, stdout, stderr) => {
      if(err)throw(err)
      this.visualizor.html(stdout)
    })
    contenu = null
  }
  /**
  * La méthode vérifie que le document courant, s'il a été modifié, ait bien
  * été enregistré.
  *
  * Dans le cas contraire, il demande à l'utilisateur ce qu'il veut faire :
  *   - enregistrer les changements avant de poursuivre (return true)
  *   - ignore les changements et poursuivre (return true)
  *   - annuler, donc ne pas poursuire (return false)
  **/
, checkCurrentDocModified(){
    if(this.currentDoc && this.currentDoc.isModified()){
      var choix = DIALOG.showMessageBox({
          type:       'warning'
        , buttons:    ["Enregistrer", "Annuler", "Ignorer les changements"]
        , title:      "Document courant non sauvegardé"
        , defaultId:  0
        , cancelId:   1
        , message:    T('ask-for-save-document-modified', {type: this.currentDoc.type})
      })
      switch (choix) {
        case 0:
          this.currentDoc.save()
          return true
        case 1: // annulation
          return false
        case 2: // on ignore les modifications
          this.currentDoc.retreiveLastContents()
          return true
      }
    }
  }

  /**
   * Menu appelé quand on choisit un type de document dans le menu
   */
, onChooseTypeDoc(e){
    this.makeCurrent(this.menuTypeDoc.val())
  }

  /**
   * Méthode appelée quand on choisit un modèle de document
   */
, onChooseModeleDoc(e){
    // On charge le modèle
    var modelPath = $('#section-writer select#modeles-doc').val()
    this.currentDoc.setContents(fs.readFileSync(modelPath, 'utf8'))
    // On remet toujours le menu au début
    $('#section-writer select#modeles-doc').val('')
  }

  /**
   * Quand on change de thème
   */
, onChooseTheme(e,theme){
    if(undefined === theme) theme = $('#section-writer #writer-theme').val()
    this.applyTheme(theme)
    // $('#section-writer #writer-theme').val('')
  }
  /**
   * Méthode qui applique le thème +theme+ à l'interface
   */
, applyTheme(theme){
    this.body.removeClass(this.currentTheme).addClass(theme)
    this.docField.removeClass(this.currentTheme).addClass(theme)
    this.menuThemes.val(theme)
    this.currentTheme = theme
  }

  /**
  * Méthode appelée lorsque le contenu du document est changé
  * C'est la seule procédure qui doit pouvoir changer le `contents` du
  * document courant.
  */
, onContentsChange(){
    this.currentDoc.contents = this.docField.val()
  }

  // Cf. require_then/FAWriter_keyUp_keyDown.js
, onKeyDown(e){}
, onKeyUp(e){}

, onFocusContents(){
    this.message('')
  }
, onBlurContents(){
  }

  /**
   * Méthode invoquée quand on drop un event (.event) ou un document (.doc)
   * sur le champ de texte.
   */
, onDropThing(e, ui){
    var balise = this.a.associateDropped(this.currentDoc, ui.helper)
    if (balise) this.docField.insertAtCaret(balise)
  }

, reset(){
    this.docField.val('')
  }

  /**
   * Ouverture du FAWriter. Cela correspond à masquer le Reader.
   *
   * Noter que ce seront les «FAEventers» qui afficheront les events
   */
, open(){
    if(this.isOpened) return this.fwindow.hide() // appelé par le menu
    this.fwindow.show()
  }
, OTHER_SECTIONS: ['#section-reader']
, onShow(){
    // Les autres sections qu'il faut masquer quand on affiche
    // le writer. Est-ce vraiment nécessaire ?…
    // for(var section of this.OTHER_SECTIONS){$(section).hide()}
    this.setDimensions()
    this.isOpened = true
}
, close(){
    if(false === this.checkCurrentDocModified()) return
    this.fwindow.hide()
  }
, onHide(){
    this.unsetDimensions()
    this.isOpened = false
    delete this.currentDoc
}

, setDimensions(){
    // this.sectionVideoOriginalWidth = $('#section-video').width()
    // this.rightColumnOriginallWidth = $('#section-reader').width()
    // $('#section-video').css('width', '30%')
  }
, unsetDimensions(){
    // $('#section-video').css('width', `${this.sectionVideoOriginalWidth}px`)
  }

  /**
   * Sauvegarde du document courant
   */
, saveCurrentDoc(){
    this.currentDoc.save()
  }
  /**
   * Méthode d'autosauvegarde du document courant
   */
, autoSaveCurrent(){
    this.currentDoc.getContents()
    this.currentDoc.isModified() && this.currentDoc.save()
  }

  /**
   * Pour définir l'autosauvegarde
   */
   // TODO voir pourquoi ça n'est pas simple…
   // Est-ce à cause du draggable ???
, setAutoSave(e){
    this.autoSave = DGet('cb-save-auto-doc').checked
    if(this.autoSave){
      this.autoSaveTimer = setInterval(this.autoSaveCurrent.bind(this), 2000)
    } else {
      if (this.autoSaveTimer){
        clearInterval(this.autoSaveTimer)
        this.autoSaveTimer = null
      }
    }
    $('#btn-save-doc').css('opacity',this.autoSave ? '0.3' : '1')
  }

// TODO voir pourquoi ça n'est pas simple…
// Est-ce à cause du draggable ???
, setAutoVisualize(e){
    this.visualizeDoc = DGet('cb-auto-visualize').checked
    if (this.visualizeDoc){
      this.autoVisuTimer = setInterval(this.updateVisuDoc.bind(this), 5000)
      this.updateVisuDoc() // on commence tout de suite
    } else {
      clearInterval(this.autoVisuTimer)
      this.autoVisuTimer = null
    }
    this.visualizor[this.visualizeDoc?'show':'hide']()
  }

, setModified(mod){
    this.section[mod?'addClass':'removeClass']('modified')
  }

  /**
   * Pour afficher un message propre au writer
   */
, message(msg){
    if(!msg) msg = ''
    this.section.find('#writer-message').html(msg)
  }


// Appelé par la FWindow
, build(){
    var spa, lab, sel

    var btnClose = DCreate('BUTTON', {
      id: 'btn-close-writer'
    , class: 'btn-close'
    , type: 'button'
    })
    spa = DCreate('SPAN', {
      class: 'writer-btn-drop doc'
    , attrs: {'data-type': 'document', 'title': "Pour glisser et déposer le document sur un event ou un texte."}
    , inner: ' ⎆'
    })
    var doctitle = DCreate('DIV',{
      id: 'writer-doc-title'
    , append: [
        DCreate('LABEL', {class: 'small', inner: 'DOCUMENT '})
      , DCreate('SELECT', {id: 'document-type'})
      , spa
    ]
    })

    var divmodeles = DCreate('DIV', {
      class: 'modeles'
    , append: [
        DCreate('LABEL', {class: 'small', inner: 'MODÈLES '})
      , DCreate('SELECT', {id: 'modeles-doc'})]
    })

    var btnNew = DCreate('BUTTON', {
      id: 'writer-btn-new-doc'
    , inner: '+'
    , type: 'button'
    })

    var header = DCreate('DIV',{
      class: 'header'
    , append: [btnClose, doctitle, divmodeles, btnNew]
    })

    var body = DCreate('DIV', {
      class: 'body'
    , append: [DCreate('TEXTAREA', {id: 'document-contents'})]
    })

    var opts = []
    var themes = {'': 'Thème…', 'real-theme': 'Normal', 'data-theme':'Données', 'musical-theme':'Musical'}
    for(var theme in themes){ opts.push(DCreate('OPTION', {value: theme, inner: themes[theme]}))}
    var selThemes = DCreate('SELECT', {
      id: 'writer-theme'
    , class: 'fleft'
    , append: opts
    })

    var footer = DCreate('DIV', {
      class: 'footer',
      append: [
        DCreate('LABEL', {id: 'writer-message', inner: '...'})
      , selThemes
      , DCreate('LABEL', {class:'fleft', inner: 'Taille du texte : '})
      , DCreate('SPAN', {id: 'text-size', class:'fleft', inner: '...'})
      , DCreate('LABEL', {inner: 'Visualiser', attrs:{for: 'cb-auto-visualize'}})
      , DCreate('INPUT', {id: 'cb-auto-visualize', attrs: {type: 'checkbox'}})
      , DCreate('LABEL', {inner: 'Auto-save', attrs:{for: 'cb-save-auto-doc'}})
      , DCreate('INPUT', {id: 'cb-save-auto-doc', attrs: {type: 'checkbox'}})
      , DCreate('BUTTON', {id: 'btn-save-doc', inner: 'Enregistrer', type: 'button'})
      ]
    })

    return [header, body, footer]
}
// Appelé par la FWindow
, afterBuilding(){
  // Peupler la liste des types de document
  var m = this.menuTypeDoc, dOpt
  for(var dType in DATA_DOCUMENTS){
    var ddoc = DATA_DOCUMENTS[dType]
    if(ddoc.menu === false) continue
    if(ddoc === 'separator') dOpt = {class: 'separator', disabled: true}
    else dOpt = {value: dType, inner: ddoc.hname}
    m.append(DCreate('OPTION', dOpt))
  }
  // Pour séparer les documents propres à cette analyse
  m.append(DCreate('OPTION', {class: 'separator', disabled: true}))
  // La liste des documents propres à cette analyse
  this.forEachUserDocument(function(wdoc){
    m.append(DCreate('OPTION', {value: wdoc.id, inner: wdoc.title}))
  })
}
// Appelé par la FWindow
, observe(){
    // On observe le menu de choix d'un document
    this.menuTypeDoc.on('change', this.onChooseTypeDoc.bind(this))
    // On observe le menu de choix d'un modèle de document
    this.menuModeles.on('change', this.onChooseModeleDoc.bind(this))
    // On observe le menu qui choisit le thème
    this.menuThemes.on('change', this.onChooseTheme.bind(this))

    // On observe le champ de texte
    this.docField.on('change',    this.onContentsChange.bind(this))
    this.docField.on('focus',     this.onFocusContents.bind(this))
    this.docField.on('blur',      this.onBlurContents.bind(this))
    this.docField.on('keydown',   this.onKeyDown.bind(this))
    this.docField.on('keyup',     this.onKeyUp.bind(this))

    // On rend le champ de texte droppable pour pouvoir y déposer
    // n'importe quel event ou n'importe quel autre document
    this.docField.droppable({
        accept: '.event, .doc, .dropped-time'
      , tolerance: 'intersect'
      , drop: this.onDropThing.bind(this)
      , classes: {'ui-droppable-hover': 'survoled'}
    })

    // Le bouton pour sauver le document courant
    this.btnSave.on('click',this.saveCurrentDoc.bind(this))
    // On observe la case à cocher qui permet de sauvegarder automatiquement
    // le document
    $('input#cb-save-auto-doc').on('click', this.setAutoSave.bind(this))
    // // On observe la case à cocher pour visualiser régulièrement le document
    $('input#cb-auto-visualize').on('change', this.setAutoVisualize.bind(this))

    // Bouton pour fermer le writer
    $('button#btn-close-writer').on('click', this.close.bind(this))

    // On observe le bouton pour créer un nouveau document
    $('button#writer-btn-new-doc').on('click', FAWriterDoc.new.bind(FAWriterDoc))

    // On rend le petit bouton pour drag-dropper le document courant
    // draggable
    this.section.find('.header .writer-btn-drop').draggable({
      revert: true
    , zIndex: 5000
    })

    // Mettre la taille : non, ça doit se régler à chaque ouverture

    this.ready = true
  }

/**
* Méthode permettant de boucler sur tous les documents User (donc les
* document propres à l'analyse courante)
**/
, forEachUserDocument(method){
    this.customDocuments.forEach(wdoc => method(wdoc))
}

}
Object.defineProperties(FAWriter,{
  a:{
    get(){return current_analyse}
  }
, fwindow:{
    get(){return this._fwindow || defP(this,'_fwindow', new FWindow(this,{id: 'writer', container: this.section, left: (ScreenWidth / 2)}))}
  }
  /**
   * Le selecteur, pour gérer la sélection
   */
, selector:{
   get(){return this._selector || defP(this,'_selector', new Selector(this.docField))}
 }
, customDocuments:{
    get(){
      if(undefined === this._customDocuments){
        this._customDocuments = []
        var last_id = 0
        var files = glob.sync(path.join(this.a.folderFiles, '**', 'doc-*.md'))
        for(var file of files){
          var doc_id = parseInt(path.basename(file,path.extname(file)).split('-')[1],10)
          this._customDocuments.push(new FAWriterDoc(doc_id))
          if(doc_id > last_id) last_id = 0 + doc_id
        }
        // On renseigne le dernier identifiant utilisé
        FAWriterDoc.lastID = last_id
      }
      return this._customDocuments
    }
  }
, section:{
    get(){return $('#section-writer')}
  }
, menuTypeDoc:{
    get(){return $('#section-writer .header select#document-type')}
  }
, body:{
    get(){return $('#section-writer .body')}
  }
, docField:{
    get(){return $('#section-writer .body textarea#document-contents')}
  }
, btnSave:{
    get(){return $('#section-writer button#btn-save-doc')}
  }
, menuThemes:{
    get(){return $('#section-writer #writer-theme')}
  }
, menuModeles:{
    get(){return $('#section-writer select#modeles-doc')}
  }
, visualizor:{
    get(){return $('#writer-doc-visualizor')}
  }
, header:{
    get(){return $('#section-writer .header')}
  }
, footer:{
    get(){return $('#section-writer .footer')}
  }

})
