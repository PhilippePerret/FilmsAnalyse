'use strict'
/**
 * Gestion de l'interface
 */
const UI = {
    class: 'UI'

  , inited: false
  , init:function(){
      if (this.inited === true) return F.error("On ne doit initier l'interface qu'une seule fois…")
      var my = this
      this.observe_ui()

      this.divWaitingLoop = $('div#waiting-loop')

      $('#requested_time').on('keypress', ev => {
        if(current_analyse){
          var my = current_analyse.locator
          if(ev.keyCode == 13){my.goToTime.bind(my)();$(ev).stop()}
        }
      })

      // TODO Plus tard, faire une instance qui gère les boutons de
      // navigation, en en faisant un par vidéo.
      listenClick('btn-hide-current-time-video-1', this, 'hideCurrentTime')
      listenClick('btn-go-to-time-video-1',this,'goToTime')

      this.btnPlay = DGet('btn-real-play')
      listen(this.btnPlay, 'click', this, 'togglePlay')

      this.btnRewindStart = DGet('btn-stop')
      listen(this.btnRewindStart,'click',my,'stopAndRewind')

      listenClick('btn-go-to-film-start', my, 'goToFilmStart')
      listenClick('btn-stop-points',my,'goToNextStopPoint')

      listenMDown('btn-rewind-1',my,'rewind', 0.04)
      listenMUp('btn-rewind-1',my,'stopRewind')
      listenMDown('btn-rewind-2',my,'rewind', 1)
      listenMUp('btn-rewind-2',my,'stopRewind')
      listenMDown('btn-rewind-3',my,'rewind', 5)
      listenMUp('btn-rewind-3',my,'stopRewind')
      listenMDown('btn-forward-1',my,'forward', 0.04)
      listenMUp('btn-forward-1',my,'stopForward')
      listenMDown('btn-forward-2',my,'forward', 1)
      listenMUp('btn-forward-2',my,'stopForward')
      listenMDown('btn-forward-3',my,'forward', 5)
      listenMUp('btn-forward-3',my,'stopForward')

      this.inited = true
    }

  // ---------------------------------------------------------------------
  // Méthode travaillant avec les boutons de l'UI, mais affectant l'analyse
  // courante (seulement si elle existe, donc)
  , runIfAnalyse:function(method, arg){
      current_analyse && current_analyse.locator[method].bind(current_analyse.locator)(arg)
    }
  , hideCurrentTime:function(){this.runIfAnalyse('hideCurrentTime')}
  , goToTime:function(){this.runIfAnalyse('goToTime')}
  , togglePlay:function(){this.runIfAnalyse('togglePlay')}
  , stopAndRewind:function(){this.runIfAnalyse('stopAndRewind')}
  , goToFilmStart:function(){this.runIfAnalyse('goToFilmStart')}
  , goToNextStopPoint:function(){this.runIfAnalyse('goToNextStopPoint')}

  , rewind:function(pas){this.runIfAnalyse('rewind', pas)}
  , forward:function(pas){this.runIfAnalyse('forward', pas)}
  , stopRewind:function(pas){this.runIfAnalyse('stopRewind', pas)}
  , stopForward:function(pas){this.runIfAnalyse('stopForward', pas)}

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
  //  Méthode d'affichage
  , showVideoController:function(){
      $('table#video-controller-1').show()
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
