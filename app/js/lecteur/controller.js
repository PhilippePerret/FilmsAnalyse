'use strict'

function affiche(msg){
  $('div#message').html(msg)
}

window.current_analyse = null // définie au ready

const VideoController = {
    class: 'VideoController'
  , controller: null

    /**
     * Initialisation du controller
     */
  , init: function(){
      var my = this
      this.controller = document.getElementById('video')
      $('#btn-get-time').on('click', my.getTime.bind(my))
      $('#btn-go-to-time').on('click', my.goToTime.bind(my))
      $('#btn-new-event').on('click', current_analyse.newThing.bind(current_analyse, 'event'))
      $('#btn-new-scene').on('click', current_analyse.newThing.bind(current_analyse, 'scene'))
      $('#btn-save-analyse').on('click', current_analyse.save.bind(current_analyse))
      $('#btn-time-as-film-start').on('click', () => {
        current_analyse.setFilmStartTimeAt.bind(current_analyse)(this.getTime())
      })
      $('#btn-real-play').on('click', my.onTogglePlay.bind(my))
      // Le bouton pour rejoindre le début du film. Il n'est défini que si
      // ce temps est défini pour l'analyse courante
      current_analyse.setButtonGoToStart()
      $('#btn-go-to-film-start').on('click', current_analyse.goToFilmStart.bind(current_analyse))

      $('#btn-rewind-1-sec').on('click', my.rewind.bind(my, 1))
      $('#btn-rewind-5-sec').on('click', my.rewind.bind(my, 5))
      $('#btn-forward-1-sec').on('click', my.forward.bind(my, 1))
      $('#btn-forward-5-sec').on('click', my.forward.bind(my, 5))
      $('#btn-set-video-path').on('click', current_analyse.setVideoPath.bind(current_analyse))

      // Si l'analyse courante définit une vidéo, on la charge et on prépare
      // l'interface. Sinon, on masque la plupart des éléments
      if(current_analyse.videoPath){
        this.load(current_analyse.videoPath)
      }else{
        this.setVideoUI(false)
      }
    }
    /**
     * Méthode appelée quand on presse le bouton Play (pas ceuli du contrôleur)
     */
  , onTogglePlay: function(){
      var btn = $('#btn-real-play')
      btn.html(this.controller.paused?'Pauser':'Reprendre')
      if(this.controller.paused){
        this.controller.play()
        this.activateHorloge()
      }else{
        this.controller.pause()
        this.desactivateHorloge()
      }
    }

    /**
     * Méthode pour rembobiner de +secs+ seconds (on continue de jouer si
     * on jouait, ou alors on remet en route)
     */
  , rewind: function(secs){
      this.setTime(this.controller.currentTime - secs, true)
    }
  , forward: function(secs){
      this.setTime(this.controller.currentTime + secs, true)
    }

    /**
     * Méthode pour activer l'horloge qui dépend du début défini pour le
     * film (ou le début en cas d'erreur). Elle marche au frame près
     */
  , activateHorloge:function(){
      var my = this
      if (this.intervalTimer){
        this.desactivateHorloge()
      } else {
        this._horloge = document.getElementById('horloge')
        if(current_analyse && current_analyse.filmStartTime){
          this.horloge_rectif = current_analyse.filmStartTime.seconds
        } else {
          this.horloge_rectif = 0
        }
        this.intervalTimer = setInterval(my.actualizeHorloge.bind(my), 1000/40)
        // Toutes les secondes, on essaie d'actualiser l'affichage des
        // évènements
        // this.intervalReader = setInterval(my.actualizeReader.bind(my), 1000)
      }
    }
  , desactivateHorloge: function(){
      if(this.intervalTimer){
        clearInterval(this.intervalTimer)
        this.intervalTimer = null
      }
      if(this.intervalReader){
        clearInterval(this.intervalReader)
        this.intervalReader = null
      }
    }
  , actualizeHorloge: function(){
      this._horloge.innerHTML = this.getRealTime(this.controller.currentTime - this.horloge_rectif)
  }

  , actualizeReader: function(){
      console.log('-> actualizeReader')
      current_analyse.showEventsAt(this.controller.currentTime - this.horloge_rectif)
  }

  , getRealTime: function(s){
      var negative = s < 0
      if(negative){s = -s}
      // console.log("s = ",s)
      if(undefined === this._horloger){
        this._horloger = new OTime(s)
      } else {
        this._horloger.updateSeconds(s)
      }
      return `${negative?'-':''}${this._horloger.horloge}`
  }
    /**
     * Pour définir la taille de la vidéo (trois formats sont disponibles, pour
     * le moment)
     */
  , VIDEO_SIZES: {
      vignette: 450, medium: 650, large: 1000
    }
  , setSize: function(v){
      this.controller.width = this.VIDEO_SIZES[v]
      document.getElementById('horloge').className = v
    }
    /**
     * Méthode qui récupère le temps courant du film
     *
     * Note : cette méthode est appelée intensément quand on joue le film,
     * puisque c'est elle qui permet d'afficher l'horloge.
     */
  , getTime: function(){
      return new OTime(this.controller.currentTime)
    }
    /**
     * (Number) Retourne le temps rectifié. Il peut être négatif.
     */
  , getRTime: function(){
      return this.controller.currentTime - current_analyse.filmStartTime.seconds
    }

    /**
     * Méthode qui définit le temps du film
     *
     * +time+ doit être un nombre de secondes
     */
  , setTime: function(time, andPlay){
      this.controller.currentTime = time
      if(andPlay === true){
        if(this.controller.paused) this.onTogglePlay()
      }
    }
    /**
     * Méthode appelée pour se rendre au temps voulu.
     * Le temps est défini comme une horloge avec des virgules
     */
  , goToTime: function(ev){
      var otime = new OTime($('#time').val())
      this.setTime(otime.seconds)
      // TODO Vérifier que ce temps soit possible
      // console.log("Time en seconds:", otime.seconds)
      // console.log("Horloge recalculée:", otime.s2h())
    }

    /**
     * Pour charger la vidéo de path +vpath+
     */
  , load: function(vpath){
      this.controller.src = path.resolve(vpath)
      this.controller.load()
      this.setVideoUI(true)
    }

    /**
     * Préparation de l'interface en fonction de la présence ou non d'une
     * vidéo.
     */
  , setVideoUI: function(visible){
      $('#div-video-path')[visible?'hide':'show']()
      $('#div-video-top-tools')[visible?'show':'hide']()
      this.toggleVisible('#video', visible)
      this.toggleVisible('#div-nav-video-buttons', visible)
      this.toggleVisible('#fs-get-times', visible)
      this.toggleVisible('#fs-new-event', visible)
      this.toggleVisible('#btn-time-as-film-start', !current_analyse.filmStartTime)
    }
  , toggleVisible: function(jqId, v){
      $(jqId).css('visibility', v ? 'visible' : 'hidden')
    }
}
// /VideoController


$(document).ready(()=>{
  // On met l'analyse de HER en analyse courante
  window.current_analyse = new FAnalyse('./analyses/her')
  // Et on la charge
  current_analyse.load()
  // Note : si le chargement est réussi, l'analyse appelle
  // l'initialisation de l'interface, ce qui charge par exemple
  // la vidéo.

})
