'use strict'
/**
 * Objet EventForm
 * ---------------
 * Gère le formulaire d'édition et de création des évènements de tout type
 */
const EventForm = {
    class: 'EventForm'
  , inited: false         // mis à true à l'initialisation
  , formIsVisible: false  // au départ

    /**
     * Initialisation de l'objet, appelée quand l'analyse courante est
     * prête.
     */
  , init: function(){
      if(this.initied){throw("Je ne dois pas pouvoir initié deux fois le formulaire…")}
      this.toggleForm(false)
      this.observeForm()
      this.inited = true
    }
    /**
     * Pour basculer des boutons d'évènements au formulaire
     */
  , toggleForm: function(showForm){
      if(undefined===showForm){showForm = !this.formIsVisible}
      this.jqForm[showForm?'show':'hide']()
      this.jqButtons[showForm?'hide':'show']()
      this.formIsVisible = !!showForm
      // console.log("this.formIsVisible:",this.formIsVisible)
    }

  , observeForm(){
      var my = this
      // Tous les boutons pour créer un nouvel élément doivent réagir
      // au click.
      $('#buttons-new-event button').on('click', function(ev){ my.onClickNewEvent.bind(my)(ev, $(this)) })
      // Les deux boutons pour enregistrer et abandonner
      document.getElementById('btn-form-cancel').addEventListener('click', my.cancel.bind(my))
      document.getElementById('btn-form-submit').addEventListener('click', my.submit.bind(my))
    }

  , onClickNewEvent(ev, o){
      VideoController.onTogglePlay()
      ev.stopPropagation()
      var cible = o
      var eType = o.attr('data-type')
      this.toggleForm()

      this.jqForm.find('.ff').hide()
      this.jqForm.find(`.f${eType}`).show()
      $('#event-id').val('')
      $('#event-type').val(eType)
      $('#event-time').val(parseInt(VideoController.getRTime(),10))
    }

  , submit: function(){


      // TODO On doit récupérer toutes les données
      var data_min = {}
      data_min.id       = getValOrNull('event-id')
      data_min.type     = getValOrNull('event-type')  // p.e. 'scene'

      // Création d'objet particulier, qui ne sont pas des sous-classes
      // de FAEvent
      switch (data_min.type) {
        case 'dim':
          // TODO Création d'un diminutif
          return
        case 'brin':
          // TODO Création d'un brin
          return
      }

      data_min.time     = parseInt(getValOrNull('event-time'),10)
      data_min.note     = getValOrNull('event-note')
      data_min.duration = getValOrNull('event-duration')
      data_min.content  = getValOrNull('event-content')

      // On récupère toutes les données (ça consiste à passer en revue tous
      // les éléments de formulaire qui ont la classe "f<type>")
      var ftype = `f${data_min.type}`
      var fields = []
      var other_data = {}
      $('select,input[type="text"],textarea,input[type="checkbox"]')
        .filter(function(){
          return $(this).hasClass(ftype)
        })
        .each(function(){
          other_data[this.id] = getValOrNull(this.id)
          // Pour vérification
          fields.push(this.id)
        })

      console.log("Champs trouvés:", fields)
      console.log("Data finale:", data_min)
      console.log("Data finale:", other_data)

      // On crée ou on update l'évènement
      if(data_min.id){
        // ÉDITION
      } else {
        // CRÉATION
        // On crée l'évènement du type voulu
        var eClass = eval(`FAE${data_min.type}`)
        var e = new eClass(data_min)
        // Et on lui dispatch les autres données
        e.dispatch(other_data)
        // On ajoute l'évènement à l'analyse
        current_analyse.newEvent(e)
      }
      this.endEdition()
    }
  , cancel: function(){
      console.log("Je renonce à l'édition de l'event")
      this.endEdition()
    }
  , endEdition: function(){
      this.toggleForm()
      VideoController.onTogglePlay()
    }
}
Object.defineProperties(EventForm,{
    form:{
      get:function(){
        if(undefined===this._form){this._form = document.getElementById('form-edit-event')}
        return this._form
      }
    }
  , jqForm:{
      get:function(){
        if(undefined===this._jqForm){this._jqForm = $(this.form)}
        return this._jqForm
      }
    }
  , buttons:{
      get:function(){
        if(undefined===this._buttons){this._buttons = document.getElementById('buttons-new-event')}
        return this._buttons
      }
    }
  , jqButtons:{
      get:function(){
        if(undefined===this._jqButtons){this._jqButtons = $(this.buttons)}
        return this._jqButtons
      }
    }
})
