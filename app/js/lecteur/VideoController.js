'use strict'

function affiche(msg){
  $('div#message').html(msg)
}

// Pour écouter un objet
// p.e. listen(btnPlay, 'click', Controller, 'start')
function listen(cible, ename, objet, method){
  cible.addEventListener(ename, objet[method].bind(objet))
}


window.current_analyse = null // définie au ready

const VideoController = {
    class: 'VideoController'
  , VIDEO_SIZES: {
      vignette: 450, medium: 650, large: 1000
    }
  , controller: null
  , inited: false
  , playing: false // mis à true quand la vidéo joue

    /**
     * Initialisation du controller
     */
  , init: function(){
      var my = this
      if (this.inited){throw("Le vidéocontroller ne devrait pas être initié deux fois…")}

      // Le contrôleur vidéo
      this.controller = document.getElementById('video')

      this.setReadersDimentions()

      $('#btn-get-time').on('click', my.getAndShowTime.bind(my))
      $('#btn-go-to-time').on('click', my.goToTime.bind(my))
      $('#btn-time-as-film-start').on('click', () => {
        current_analyse.setFilmStartTimeAt.bind(current_analyse)(this.getTime())
      })

      // Bouton pour sauver l'analyse
      var btnSaveAnalyse = document.getElementById('btn-save-analyse')
      listen(btnSaveAnalyse,'click', current_analyse, 'save')
      this.toggleVisible(btnSaveAnalyse,false)

      listen(this.btnPlay, 'click', my, 'onTogglePlay')
      this.btnPlay.innerHTML = this.imgPlay

      listen(this.btnRewindStart,'click',my,'rewindStart')
      this.btnRewindStart.innerHTML = this.imgRewindStart

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

      // Si l'analyse a enregistré une taille de vidéo, on la règle
      this.setSize(current_analyse.videoSize||'medium', false)
      $('#video-size').val(current_analyse.videoSize||'medium')

      // Tous les champs input-text, on selectionne tout quand on focusse
      // dedant
      $('input[type="text"]').on('focus', function(){$(this).select()})

      this.inited = true
    }

    /**
     * À l'initialisation, on définit les dimensions de la partie vidéo
     * (video-reader), de la partie lecteur d'analyse (analyse reader) et
     * le bas de page (TODO)
     */
  , setReadersDimentions:function(){
      // On calcule les dimensions du lecteur vidéo et du reader d'analyse
      // en fonction de la taille de l'écran
      const { width, height } = ipc.sendSync('get-screen-dimensions')

      var videoReaderWidth    = parseInt((width * 60) / 100,10)
      var analyseReaderWidth  = parseInt((width * 39) / 100,10)
      var analyseReaderHeight = parseInt((height * 50)/100,10)

      $('#section-video').css('width',`${videoReaderWidth}px`)
      $('#section-reader').css({
          "width": `${analyseReaderWidth}px`
        , "height":`${analyseReaderHeight}px`
        , "margin-left": `${1 + videoReaderWidth}px`
      })

      // Redéfinition de la taille large de la vidéo en fonction de
      // l'écran.
      this.redefineVideoSizes(videoReaderWidth)

    }

    /**
     * Méthode appelée quand on presse le bouton Play (pas ceuli du contrôleur)
     */
  , onTogglePlay: function(ev){
      // console.log("-> onTogglePlay")
      var pauser = !this.controller.paused
      this.btnPlay.innerHTML = pauser ? this.imgPlay : this.imgPauser
      if(pauser){
        this.controller.pause()
        this.desactivateHorloge()
        this.playing = false
      } else {
        this.controller.play()
        this.activateHorloge()
        this.playing = true
      }
      // console.log("<- onTogglePlay")
    }

    /**
     * Méthode pour rembobiner au début du film (si on est après et qu'il est
     * défini) ou au début de la vidéo
     *
     * Note : le +5 ci-dessous permet de cliquer deux fois sur le bouton pour
     * revenir tout au début (sinon, on revient toujours au début défini du
     * film)
     */
  , rewindStart: function(){
      if(current_analyse.filmStartTime && current_analyse.filmStartTime.seconds < (this.controller.currentTime + 5)){
        this.setTime(current_analyse.filmStartTime.seconds)
      } else {
        this.setTime(0)
      }
    }

    /**
     * Méthode pour rembobiner de +secs+ seconds (on continue de jouer si
     * on jouait, ou alors on remet en route)
     */
  , rewind: function(secs){
      this.setTime(this.controller.currentTime - secs)
    }
  , forward: function(secs){
      this.setTime(this.controller.currentTime + secs)
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
        this._horloge_real = document.getElementById('horloge_real')
        if(current_analyse && current_analyse.filmStartTime){
          this.horloge_rectif = current_analyse.filmStartTime.seconds
        } else {
          this.horloge_rectif = 0
          this._horloge_real.style.visibility = 'hidden'
        }
        this.intervalTimer = setInterval(my.actualizeHorloge.bind(my), 1000/40)
        // Toutes les x secondes, on essaie d'actualiser l'affichage des
        // évènements autour du temps courant
        this.intervalReader = setInterval(my.actualizeReader.bind(my), 3000)
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
      this._horloge_real.innerHTML = this.getRealTime(this.controller.currentTime)
  }

  , actualizeReader: function(){
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
      return `${negative?'-':' '}${this._horloger.horloge}`
  }
    /**
     * Pour définir la taille de la vidéo (trois formats sont disponibles, pour
     * le moment)
     *
     * Si +save+ est true, la taille doit être enregistrée dans les préférences
     * de l'analyse courante.
     */
  , setSize: function(v, save){
      this.controller.width = this.VIDEO_SIZES[v]
      document.getElementById('horloge').className = `horloge ${v}`
      if (save === true) current_analyse.videoSize = v
    }

    /**
     * Pour redéfinir les largeurs de la vidéo en fonction de la largeur
     * de l'écran.
     */
  , redefineVideoSizes:function(w){
      this.VIDEO_SIZES['large']   = w - 10
      if(w < 650){
        this.VIDEO_SIZES['medium']    = parseInt((w / 3) * 2, 10)
        this.VIDEO_SIZES['vignette']  = parseInt(w / 2.2, 10)
      }

    }


    /**
     * Méthode qui récupère le temps courant du film
     *
     */
  , getTime: function(){
      return new OTime(this.controller.currentTime)
    }
    /**
     * (Number) Retourne le temps rectifié. Il peut être négatif.
     */
  , getRTime: function(){
      if(undefined === current_analyse.filmStartTime){
        return this.controller.currentTime
      } else {
        return this.controller.currentTime - current_analyse.filmStartTime.seconds
      }
    }

    /**
     * Méthode appelée par le bouton "Temps courant" pour obtenir le temps
     * courant.
     * Plusieurs données sont données :
     *  - temps courant de la vidéo en horloge
     *  - temps courant de la vidéo en seconde
     *  - temps courant du film en horloge
     *  - temps courant du film en secondes
     */
  , getAndShowTime: function(){
      var videoTC = this.getTime()
      $('#temps-courant-video-horloge').val(videoTC.horloge)
      $('#temps-courant-video-seconds').val(videoTC.secondsInt)
      if(this.hasStartTime){
        var filmTC  = new OTime(this.getRTime())
        $('#temps-courant-film-horloge').val(filmTC.horloge)
        $('#temps-courant-film-seconds').val(filmTC.secondsInt)
      }
      $('#div-temps-courants').show();
      $('#span-temps-courants-film')[this.hasStartTime?'show':'hide']()
    }
    // Méthode qui cache les champs précédents
  , hideCurrentTime: function(){
      $('#div-temps-courants').hide();
    }
    /**
     * Méthode qui définit le temps du film
     *
     * +time+ doit être un nombre de secondes
     */
  , setTime: function(time, dontPlay){
      this.controller.currentTime = time
      if(this.playAfterSettingTime === true && !dontPlay){
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
      this.toggleVisible('#btn-time-as-film-start', !this.hasStartTime)
    }
  , toggleVisible: function(jqId, v){
      $(jqId).css('visibility', v ? 'visible' : 'hidden')
    }
}
Object.defineProperties(VideoController,{

    hasStartTime:{
      get:function(){return undefined!==current_analyse.filmStartTime}
    }
  , playAfterSettingTime: {
        get:function(){return this._play_after_setting_time || true /* pour le moment */}
      , set:function(v){this._play_after_setting_time = v}
    }
  // --- ÉLÉMENTS DOM ---
  , btnPlay: {
      get: function(){
        if(undefined === this._btn_play){
          this._btn_play = document.getElementById('btn-real-play')
        }
        return this._btn_play
      }
    }
  , btnRewindStart: {
      get: function(){
        if(undefined===this._btn_rewind_start){
          this._btn_rewind_start = document.getElementById('btn-rewind-start')
        }
        return this._btn_rewind_start
      }
    }
  , imgPauser:{
      get:function(){return '<img src="./img/btn-pause.jpg" />'}
    }
  , imgPlay:{
      get:function(){return '<img src="./img/btn-play.jpg" />'}
    }
  , imgRewindStart:{
    get:function(){return '<img src="./img/btn-rewind.jpg" />'}
  }
})
// /VideoController
