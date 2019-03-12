'use strict'
/**
 * Gestion de l'interface
 */
const UI = {
    class: 'UI'

  , inited: false
  , init:function(){
      if (this.inited === true) return F.error("On ne doit initier l'interface qu'une seule fois…")
      this.observe_ui()

      this.divWaitingLoop = $('div#waiting-loop')

      this.inited = true
    }

  // ---------------------------------------------------------------------
  //  Pour les boucles d'attente
  , startWait:function(message){
      if(undefined !== message) message += ' Merci de patienter…'
      $('span#waiting-loop-message').html(message || '')
      this.divWaitingLoop.show()
      this.waiting = true
    }
  , stopWait:function(){
      if(!this.waiting) return
      this.divWaitingLoop.hide()
      this.waiting = false
    }

  // ---------------------------------------------------------------------
  //  Méthodes d'évènement
  , observe_ui:function(){
      var my = this
      // On place les observers sur les boutons pour créer les nouveaux
      // évènement. Noter qu'il s'appliqueront toujours à l'analyse courante,
      // current_analyse.

      // Tous les boutons pour créer un nouvel élément doivent réagir
      // au click.
      $('#buttons-new-event button').on('click', function(ev){ EventForm.onClickNewEvent.bind(EventForm)(ev, $(this)) })

      // Extras
      // ------
      // Tous les champs input-text, on selectionne tout quand on focusse
      // dedant
      $('input[type="text"]').on('focus', function(){$(this).select()})

      my = null
    }
  , setVideoPath:function(ev){
      current_analyse.setVideoPath(ev)
    }
}
