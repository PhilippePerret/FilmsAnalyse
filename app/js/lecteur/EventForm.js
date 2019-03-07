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
      ev.stopPropagation()
      var cible = o
      var eType = o.attr('data-type')
      // var eClass = eval(`FAE${eType}`)
      // var e = new eClass({})
      // console.log(e)
      this.toggleForm()

      this.jqForm.find('.ff').hide()
      this.jqForm.find(`.f${eType}`).show()
    }

  , submit: function(){
      console.log("Soumission du formulaire")
      // TODO On doit récupérer toutes les données
      var data = {}
      data.id   = $('event-id').val()
      data.note = $('event-note').val()
      // On crée ou on update l'évènement
      if(data.id){
        // ÉDITION
      } else {
        // CRÉATION
      }
      this.toggleForm()
    }
  , cancel: function(){
      console.log("Je renonce à l'édition de l'event")
      this.toggleForm()
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
