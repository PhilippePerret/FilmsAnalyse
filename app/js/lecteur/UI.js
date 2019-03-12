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

      this.inited = true
    }

  , observe_ui:function(){
      var my = this
      // On place les observers sur les boutons pour créer les nouveaux
      // évènement. Noter qu'il s'appliqueront toujours à l'analyse courante,
      // current_analyse.

      // Tous les boutons pour créer un nouvel élément doivent réagir
      // au click.
      $('#buttons-new-event button').on('click', function(ev){ EventForm.onClickNewEvent.bind(EventForm)(ev, $(this)) })

      // Pour définir le path de la vidéo
      listenClick('btn-set-video-path', my, 'setVideoPath')

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
