'use strict'
/**
 * Ce module du Writer est le module minimum chargé tout le temps, qui
 * contient les données minimum à connaitre.
 */

const Writer = {
    class: 'Writer'

  , ready: false      // pour savoir s'il est préparé
  , isOpened: false  // Pour savoir si le writer est ouvert ou fermé

  , currentDoc: undefined //l'instance WriterDoc courante (elle doit toujours exister)

    /**
     * Ouverture du document de type +typeDoc+ (p.e. 'introduction')
     */
  , openDoc:function(dtype){
      this.message(`Document de type "${dtype}" en préparation…`)
      if('' == dtype){
        if (this.isOpened){
          return this.close()
        }
        else {
          this.menuTypeDoc.value = 'introduction'
          dtype = 'introduction'
        }
      }
      this.makeCurrent(dtype)
      this.message('Document prêt à être travaillé.')
    }

    /**
     * Fait du document de type +dtype+ le document courant.
     */
  , makeCurrent:function(dtype){
      this.checkCurrentDocModified()
      if(undefined === this.writerDocs) this.writerDocs = {}
      if(undefined === this.writerDocs[dtype]){
        this.writerDocs[dtype] = new WriterDoc(dtype)
      }
      this.currentDoc = this.writerDocs[dtype]
      this.currentDoc.display()
      if(!this.isOpened) this.open()
      // On "referme" toujours le menu des types (après l'ouverture)
      this.menuTypeDoc.val(dtype)
    }

    /**
     * Actualise la visualisation du contenu Markdown dans le visualiseur
     */
  , updateVisuDoc:function(){
      this.currentDoc.getContents()
      var cmd = `echo "${this.currentDoc.contents.replace(/\"/g,'\\"')}" | pandoc`
      exec(cmd, (err, stdout, stderr) => {
        if(err)throw(err)
        $('#writer-doc-visualizor').html(stdout)
      })
    }
  , checkCurrentDocModified:function(){
      if(this.currentDoc && this.currentDoc.modified){
        if(confirm(T('ask-for-save-document-modified', {type: this.currentDoc.type}))){
          this.currentDoc.save()
        }
      }
    }
    /**
     * Menu appelé quand on choisit un type de document dans le menu
     */
  , onChooseTypeDoc:function(e){
      this.makeCurrent(this.menuTypeDoc.val())
    }

    /**
     * Méthode appelée quand on choisit un modèle de document
     */
  , onChooseModeleDoc:function(e){
      // On charge le modèle
      var modelPath = $('#section-writer select#modeles-doc').val()
      this.currentDoc.setContents(fs.readFileSync(modelPath, 'utf8'))
      // On remet toujours le menu au début
      $('#section-writer select#modeles-doc').val('')
    }

    /**
     * Quand on change de thème
     */
  , onChooseTheme:function(e,theme){
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
     */
  , onContentsChange:function(){
      this.currentDoc.contents = this.docField.val()
    }

  , onKeyDown:function(e){
      console.log("-> onKeyDown dans textarea du writer")
      if(e.keyCode === KTAB){
        return stopEvent(e)
      }
      return true
    }
  , onKeyUp:function(e){
      console.log("-> onKeyUp dans textarea du writer")
      if(e.keyCode === KTAB){
        console.log('TABULATION!')
        return stopEvent(e)
      }
    }

  , onFocusContents:function(){
      this.message('')
      // TODO Activer les raccourcis 'keyup/keydown' propre au textarea du writer
      // this.docField.on('keydown', this.onKeyDown.bind(this))
      // this.docField.on('keyup', this.onKeyUp.bind(this))
    }
  , onBlurContents:function(){
      // TODO Remettre les anciens raccourcis 'keyup/keydown'
      // this.docField.off('keydown', this.onKeyDown.bind(this))
      // this.docField.off('keyup', this.onKeyUp.bind(this))
    }
    /**
     * Méthode invoquée quand on drop un event (.event) ou un document (.doc)
     * sur le champ de texte.
     */
  , onDropThing:function(e, ui){
      var event_id = parseInt(ui.helper.attr('data-id'),10)
      var isScene = current_analyse.ids[event_id].type == 'scene'
      var balise = `{{${isScene?'scene':'event'}: ${event_id}}}`
      this.docField.insertAtCaret(balise)
    }

  , reset:function(){
      this.docField.val('')
    }
    /**
     * Ouverture du Writer. Cela correspond à masquer le Reader.
     *
     * Noter que ce seront les « Eventers » qui afficheront les events
     */
  , OTHER_SECTIONS: ['#section-reader']
  , open:function(){
      if(this.isOpened) return this.close() // appelé par le menu
      if(!this.ready) this.prepare()
      for(var section of this.OTHER_SECTIONS){$(section).hide()}
      this.section.show()
      this.setDimensions()
      this.isOpened = true
      // OK
    }
  , close:function(){
      this.checkCurrentDocModified()
      this.section.hide()
      this.unsetDimensions()
      this.isOpened = false
      delete this.currentDoc
    }


  , setDimensions:function(){
      this.sectionVideoOriginalWidth = $('#section-video').width()
      this.rightColumnOriginallWidth = $('#section-reader').width()
      this.rightColumnMarginLeft = $('#right-column').css('margin-left')
      $('#right-column').css({'width': '70%', 'margin-left': '10%'})
      $('#section-video').css('width', '30%')
    }
  , unsetDimensions:function(){
      $('#section-video').css('width', `${this.sectionVideoOriginalWidth}px`)
      $('#right-column').css({'width': `${this.rightColumnOriginallWidth}px`, 'margin-left':this.rightColumnMarginLeft})
    }

    /**
     * Sauvegarde du document courant
     */
  , saveCurrentDoc:function(){
      this.currentDoc.save()
    }
    /**
     * Méthode d'autosauvegarde du document courant
     */
  , autoSaveCurrent:function(){
      if(this.currentDoc.modified){
        console.log("Document modifié, sauvegarde en cours")
        this.currentDoc.save()
      }else{
        console.log("Document non modifié, pas de sauvegarde")
      }
    }
    /**
     * Pour définir l'autosauvegarde
     */
  , setAutoSave:function(){
      this.autosave = DGet('cb-save-auto-doc').checked
      $('#btn-save-doc').css('opacity',this.autosave ? '0.3' : '1')
      if(this.autosave){
        this.autoSaveTimer = setInterval(this.autoSaveCurrent.bind(this), 2000)
      } else {
        if (this.autoSaveTimer){
          clearInterval(this.autoSaveTimer)
          this.autoSaveTimer = null
        }
      }
    }

  , setAutoVisualize:function(){
      let autoVisu = DGet('cb-auto-visualize').checked
      if (autoVisu){
        this.autoVisuTimer = setInterval(this.updateVisuDoc.bind(this), 5000)
        this.updateVisuDoc() // on commence tout de suite
      } else {
        clearInterval(this.autoVisuTimer)
        this.autoVisuTimer = null
      }
      this.visualizor[autoVisu?'show':'hide']()
    }


    /**
     * Pour afficher un message propre au writer
     */
  , message:function(msg){
      if(!msg) msg = ''
      this.section.find('#writer-message').html(msg)
    }
    /**
     * Pour préparer le writer
     */
  , prepare:function(){
      // Peupler la liste des types de document
      var m = this.menuTypeDoc
      for(var dType in DATA_DOCUMENTS){
        var ddoc = DATA_DOCUMENTS[dType]
        var opt = document.createElement('OPTION')
        opt.value = dType
        opt.innerHTML = ddoc.hname
        m.append(opt)
      }

      // On observe le menu de choix d'un document
      m.on('change', this.onChooseTypeDoc.bind(this))
      // On observe le menu de choix d'un modèle de document
      this.menuModules.on('change', this.onChooseModeleDoc.bind(this))
      // On observe le menu qui choisit le thème
      this.menuThemes.on('change', this.onChooseTheme.bind(this))

      // On observe le champ de texte
      this.docField.on('change',  this.onContentsChange.bind(this))
      this.docField.on('focus',   this.onFocusContents.bind(this))
      this.docField.on('blur',    this.onBlurContents.bind(this))
      this.docField.on('keydown', this.onKeyDown.bind(this))
      this.docField.on('keyup',   this.onKeyUp.bind(this))

      // On rend le champ de texte droppable pour pouvoir y déposer
      // n'importe quel event
      this.docField.droppable({
          accept: '.event, .doc'
        , tolerance: 'fit'
        , drop: this.onDropThing.bind(this)
      })

      // Le bouton pour sauver le document courant
      $('button#btn-save-doc').on('click',this.saveCurrentDoc.bind(this))
      // On observe la case à cocher qui permet de sauvegarder automatiquement
      // le document
      $('input#cb-save-auto-doc').on('click', this.setAutoSave.bind(this))
      // On observe la case à cocher pour visualiser régulièrement le document
      $('input#cb-auto-visualize').on('click', this.setAutoVisualize.bind(this))
      // Bouton pour fermer le writer
      $('button#btn-close-writer').on('click', this.close.bind(this))

      // On rend le writer draggable
      this.section.draggable();
      // On rend le visualiseur draggable
      $('div#writer-doc-visualizor').draggable();

      // Mettre la taille : non, ça doit se régler à chaque ouverture

      this.ready = true
    }
}
Object.defineProperties(Writer,{
  section:{
    get:function(){return $('#section-writer')}
  }
, menuTypeDoc:{
    get:function(){return $('#section-writer .header select#document-type')}
  }
, body:{
    get:function(){return $('#section-writer .body')}
  }
, docField:{
    get:function(){return $('#section-writer .body textarea#document-contents')}
  }
, menuThemes:{
    get:function(){return $('#section-writer #writer-theme')}
  }
, menuModules:{
    get:function(){return $('#section-writer select#modeles-doc')}
  }
, visualizor:{
    get:function(){return $('#writer-doc-visualizor')}
  }
, header:{
    get:function(){return $('#section-writer .header')}
  }
, footer:{
    get:function(){return $('#section-writer .footer')}
  }

})
