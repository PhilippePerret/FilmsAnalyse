'use strict'
/**
 * Gestion de l'interface
 */
const UI = {
  class: 'UI'

, inited: false
, init(){
    if (this.inited === true) return F.error("On ne doit initier l'interface qu'une seule fois…")
    var my = this

    this.a = this.analyse = current_analyse

    this.setDimensions()
    this.observe_ui()

    this.divWaitingLoop = $('div#waiting-loop')

    $('#requested_time').on('keypress', ev => {
      if(this.a){
        var my = this.a.locator
        if(ev.keyCode == 13){my.goToTime.bind(my)();$(ev).stop()}
      }
    })

    // On construit la boite des boutons de création
    // d'event
    BtnEvent.show()

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
    listenMDown('btn-prev-scene', my,'goToPrevScene')
    listenMUp('btn-prev-scene', my,'stopGoToPrevScene')
    listenMDown('btn-next-scene', my,'goToNextScene')
    listenMUp('btn-next-scene', my,'stopGoToNextScene')

    this.inited = true
  }

, setDimensions(){

    var videoWidth   = parseInt((ScreenWidth * 60) / 100,10)
    var readerWidth  = parseInt((ScreenWidth * 39) / 100,10)
    var readerHeight = parseInt((ScreenHeight * 50)/100,10)
  }

/**
 * Au chargement d'un analyse, ou à la création d'une nouvelle, cette
 * méthode est appelée pour ré-initialiser tout l'interface (en tout cas
 * les parties qui n'ont pas pu encore l'être)
 */
, reset(){
    FAReader.reset()
    EventForm.reset() // notamment destruction des formulaires
  }

// ---------------------------------------------------------------------
//  Pour les boucles d'attente
, startWait(message){
    if(undefined !== message) message += ' Merci de patienter…'
    $('span#waiting-loop-message').html(message || '')
    this.divWaitingLoop.show()
    this.waiting = true
  }

, stopWait(){
    if(!this.waiting) return
    this.divWaitingLoop.hide()
    this.waiting = false
  }

// ---------------------------------------------------------------------
//  Méthode d'affichage
, showVideoController(){
    // console.log("-> UI#showVideoController")
    $('table#video-controller-1').show()
  }

// ---------------------------------------------------------------------
//  Méthodes d'évènement
, observe_ui(){
    var my = this

    $('.current-scene-number, .current-scene-number-only, current-scene-pitch')
      .on('click', ()=>{
        EventForm.editEvent.bind(EventForm)(current_analyse.currentScene)
      })

    // Extras
    // ------
    // Tous les champs input-text, on selectionne tout quand on focusse
    // dedant
    $('input[type="text"]').on('focus', function(){$(this).select()})

    my = null
  }

/**
  Méthode qui règle les inputs champs texte pour définir si les
  textes doivent être édités dans le mini-writer ou dans leur
  champ d'origine.
**/
, miniWriterizeTextFields(container, editInMiniwriter){
    // console.log("-> miniWriterizeTextFields", editInMiniwriter)
    if(!container) container = $(document)

    container.find('textarea')[editInMiniwriter?'on':'off']('focus', function(e){
      MiniWriter.new($(this)[0])
    })
  }
/**
 * Rend tous les champs avec la class "horlogeable" du +container+ comme
 * des input-text dont on peut régler le temps à la souris
 */
, setHorlogeable(container, options){
    var my = this
    if(undefined===options)options={}
    var hrs = container.querySelectorAll('horloge')
    var horloges = {}
    // console.log("horloges trouvées : ", hrs)
    for(var i = 0, len=hrs.length; i<len; ++i){
      var h = new DOMHorloge(hrs[i])
      horloges[h.id] = h
      if(options.synchro_video) h.synchroVideo = true
      h.observe()
    }
    return horloges
  }

, setDurationable(container){
  var my = this
  var hrs = container.querySelectorAll('duree')
  var horloges = {}
  // console.log("horloges trouvées : ", hrs)
  for(var i = 0, len=hrs.length; i<len; ++i){
    var h = new DOMDuration(hrs[i])
    horloges[h.id] = h
    h.observe()
  }
  return horloges
}

, setVideoPath(ev){
    current_analyse.setVideoPath(ev)
  }

// ---------------------------------------------------------------------
//  RACCOURCIS
// ---------------------------------------------------------------------
// Méthode travaillant avec les boutons de l'UI, mais affectant l'analyse
// courante (seulement si elle existe, donc)
// En fait, ce sont des raccourcis (sauf pour togglePlay, par exemple, qui
// initialise des valeurs)
, togglePlay(){
    this.runIfAnalyse('togglePlay')
  }
, runIfAnalyse(method, arg){
    current_analyse && current_analyse.locator[method].bind(current_analyse.locator)(arg)
  }
, hideCurrentTime(){this.runIfAnalyse('hideCurrentTime')}
, goToTime(){this.runIfAnalyse('goToTime')}
, stopAndRewind(){this.runIfAnalyse('stopAndRewind')}
, goToFilmStart(){this.runIfAnalyse('goToFilmStart')}
, goToNextStopPoint(){this.runIfAnalyse('goToNextStopPoint')}

, rewind(pas){this.runIfAnalyse('rewind', pas)}
, forward(pas){this.runIfAnalyse('forward', pas)}
, stopRewind(pas){this.runIfAnalyse('stopRewind', pas)}
, stopForward(pas){this.runIfAnalyse('stopForward', pas)}

, goToPrevScene(){this.runIfAnalyse('goToPrevScene')}
, goToNextScene(){this.runIfAnalyse('goToNextScene')}
, stopGoToPrevScene(){this.runIfAnalyse('stopGoToPrevScene')}
, stopGoToNextScene(){this.runIfAnalyse('stopGoToNextScene')}

}
