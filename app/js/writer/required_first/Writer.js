'use strict'
/**
 * Ce module du Writer est le module minimum chargé tout le temps, qui
 * contient les données minimum à connaitre.
 */

const Writer = {
    class: 'Writer'

  , ready: false // pour savoir s'il est préparé

  , currentDoc: undefined //l'instance WriterDoc courante (elle doit toujours exister)
    /**
     * Ouverture du document de type +typeDoc+ (p.e. 'introduction')
     */
  , openDoc:function(dtype){
      this.message('Document en préparation…')
      if(undefined === dtype){
        this.menuTypeDoc.value = 'introduction'
        dtype = 'introduction'
      }
      if(this.currentDoc && this.currentDoc.modified){
        F.error("Il faut implémenter la formule de sauvegarde du document courant.")
      }
      this.makeCurrent(dtype)
      this.message('Document prêt à être travaillé.')
    }

    /**
     * Fait du document de type +dtype+ le document courant.
     */
  , makeCurrent:function(dtype){
      this.currentDoc = new WriterDoc(dtype)
      this.currentDoc.display()
      this.open()
    }

    /**
     * Actualise la visualisation du contenu Markdown dans le visualiseur
     */
  , updateVisuDoc:function(){
      this.currentDoc.getContents()
      var cmd = `echo "${this.currentDoc.contents.replace(/\"/g,'\\"')}" | pandoc`
      // console.log("cmd:",cmd)
      exec(cmd, (err, stdout, stderr) => {
        if(err)throw(err)
        $('#writer-doc-visualizor').html(stdout)
      })
    }
  , checkCurrentDocModified:function(){
      if(this.currentDoc.modified){
        if(confirm("Le document courant a été modifié. Voulez-vous enregistrer les changements ?")){
          this.currentDoc.save()
        }
      }
    }
    /**
     * Menu appelé quand on choisit un type de document dans le menu
     */
  , onChooseTypeDoc:function(e){
      this.checkCurrentDocModified()
      this.makeCurrent(this.menuTypeDoc.val())
    }

    /**
     * Méthode appelée quand on choisit un modèle de document
     */
  , onChooseModeleDoc:function(e){
      this.checkCurrentDocModified()
      // On charge le modèle
      var modelPath = $('#section-writer select#modeles-doc').val()
      this.currentDoc.setContents(fs.readFileSync(modelPath, 'utf8'))
      // On remet toujours le menu au début
      $('#section-writer select#modeles-doc').val('')
    }

    /**
     * Méthode appelée lorsque le contenu du document est appelé
     */
  , onContentsChange:function(){
      this.currentDoc.contents = this.docField.val()
      this.currentDoc.modified = true
      this.currentDoc.displaySize()
    }

  , onFocusContents:function(){
      this.message()
    }
  , onBlurContents:function(){

    }
  , reset:function(){
      this.docField.val('')
    }
    /**
     * Ouverture du Writer. Cela correspond à masquer le Reader et autres
     * éléments.
     */
  , OTHER_SECTIONS: ['#section-reader']
  , open:function(){
      if(!this.ready) this.prepare()
      for(var section of this.OTHER_SECTIONS){$(section).hide()}
      this.section.show()
      this.setDimensions()
      // OK
    }
  , close:function(){
      this.section.hide()
      this.unsetDimensions()
    }


  , setDimensions:function(){
      this.sectionVideoOriginalWidth = $('#section-video').width()
      this.rightColumnOriginallWidth = $('#section-reader').width()
      this.rightColumnMarginLeft = $('#right-column').css('margin-left')
      $('#right-column').css({'width': '70%', 'margin-left': '30%'})
      $('#section-video').css('width', '30%')
    }
  , unsetDimensions:function(){
      $('#section-video').css('width', `${this.sectionVideoOriginalWidth}px`)
      $('#right-column').css({'width': `${this.rightColumnOriginallWidth}px`, 'margin-left':this.rightColumnMarginLeft})
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
      $('#section-writer select#modeles-doc').on('change', this.onChooseModeleDoc.bind(this))

      // On observe le champ de texte
      this.docField.on('change', this.onContentsChange.bind(this))
      this.docField.on('focus', this.onFocusContents.bind(this))
      this.docField.on('blur', this.onBlurContents.bind(this))

      // Le bouton pour sauver
      $('button#btn-save-doc').on('click',this.currentDoc.save.bind(this.currentDoc))
      // On observe la case à cocher qui permet de sauvegarder automatiquement
      // le document
      $('input#cb-save-auto-doc').on('click', this.setAutoSave.bind(this))
      // On observe la case à cocher pour visualiser régulièrement le document
      $('input#cb-auto-visualize').on('click', this.setAutoVisualize.bind(this))

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
, docField:{
    get:function(){return $('#section-writer .body textarea#document-contents')}
  }
, visualizor:{
    get:function(){return $('#writer-doc-visualizor')}
  }
})
