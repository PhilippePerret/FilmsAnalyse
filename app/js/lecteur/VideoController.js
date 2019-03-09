'use strict'

function affiche(msg){
  $('div#message').html(msg)
}



window.current_analyse = null // définie au ready

class VideoController {
  constructor(analyse){
    this._analyse = analyse
  }

  get analyse(){return this._analyse}

  static get VIDEO_SIZES(){
      return {vignette: 450, medium: 650, large: 1000}
  }

  // Le contrôleur vidéo lui-même (la balise vidéo)
  get controller(){ return this._controller }
  set controller(v){ this._controller = v }
  get inited(){return this._inited || false }
  set inited(v){this._inited = v}
  get playing(){return this._playing || false}
  set playing(v){this._playing = v}

  /**
   * Initialisation du controller
   *
   * TODO : quand on utilisera plusieurs VideoController, il faudra que les
   * identifiant soient uniques
   */
  init(){
    var my = this
    if (this.inited){throw("Le vidéocontroller ne devrait pas être initié deux fois…")}

    // --- Éléments DOM ---
    // TODO Tous ceux définis en get pourrait être mis ici, plutôt
    this.controller = DGet('video')

    this.setReadersDimensions()

    // Menu pour changer la taille de la vidéo
    this.menuVideoSize = DGet('video-size')
    listen(this.menuVideoSize,'change',my,'setSize')

    listenClick(DGet('btn-hide-current-time'), my, 'hideCurrentTime')
    listenClick($('#btn-get-time')[0],my,'getAndShowTime')
    listenClick($('#btn-go-to-time')[0],my,'goToTime')
    $('#requested_time').on('blur', my.goToTime.bind(my))
    $('#requested_time').on('keypress', (ev)=>{
      if(ev.keyCode == 13){my.goToTime.bind(my)();$(ev).stop()}
    })

    $('#btn-time-as-film-start').on('click', () => {
      this.analyse.setFilmStartTimeAt.bind(this.analyse)(this.getTime())
    })

    // Bouton pour sauver l'analyse
    var btnSaveAnalyse = document.getElementById('btn-save-analyse')
    listen(btnSaveAnalyse,'click', this.analyse, 'save')
    toggleVisible(btnSaveAnalyse,false)

    listen(this.btnPlay, 'click', my, 'onTogglePlay')
    this.btnPlay.innerHTML = this.imgPlay

    listen(this.btnRewindStart,'click',my,'rewindStart')
    this.btnRewindStart.innerHTML = this.imgRewindStart

    // Le bouton pour rejoindre le début du film. Il n'est défini que si
    // ce temps est défini pour l'analyse courante
    this.analyse.setButtonGoToStart()
    $('#btn-go-to-film-start').on('click', this.analyse.goToFilmStart.bind(this.analyse))

    $('#btn-rewind-1-sec').on('click', my.rewind.bind(my, 1))
    $('#btn-rewind-5-sec').on('click', my.rewind.bind(my, 5))
    $('#btn-forward-1-sec').on('click', my.forward.bind(my, 1))
    $('#btn-forward-5-sec').on('click', my.forward.bind(my, 5))
    $('#btn-set-video-path').on('click', this.analyse.setVideoPath.bind(this.analyse))

    // Si l'analyse courante définit une vidéo, on la charge et on prépare
    // l'interface. Sinon, on masque la plupart des éléments
    if(this.analyse.videoPath){
      this.load(this.analyse.videoPath)
    }else{
      this.setVideoUI(false)
    }

    // Si l'analyse a enregistré une taille de vidéo, on la règle
    this.setSize(null, this.analyse.videoSize||'medium', false)
    this.menuVideoSize.value = this.analyse.videoSize||'medium'

    // Tous les champs input-text, on selectionne tout quand on focusse
    // dedant
    $('input[type="text"]').on('focus', function(){$(this).select()})

    this.inited = true
  }
  // /fin init

  /**
   * À l'initialisation, on définit les dimensions de la partie vidéo
   * (video-reader), de la partie lecteur d'analyse (analyse reader) et
   * le bas de page (TODO)
   */
  setReadersDimensions(){
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

    this._horloge = document.getElementById('horloge')
    this._horloge_real = document.getElementById('horloge_real')

  }

    /**
     * Méthode appelée quand on presse le bouton Play (pas ceuli du contrôleur)
     */
  onTogglePlay(ev){
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
  rewindStart(){
    this.setTime(this.getRTime(0))
  }

  /**
   * Méthode pour rembobiner de +secs+ seconds (on continue de jouer si
   * on jouait, ou alors on remet en route)
   */
  rewind(secs){
    this.setTime(this.controller.currentTime - secs)
  }
  forward(secs){
    this.setTime(this.controller.currentTime + secs)
  }

  /**
   * Méthode pour activer l'horloge qui dépend du début défini pour le
   * film (ou le début en cas d'erreur). Elle marche au frame près
   */
  activateHorloge(){
    var my = this
    if (this.intervalTimer){
      this.desactivateHorloge()
    } else {
      if (!this.hasStartTime){
        this._horloge_real.style.visibility = 'hidden'
      }
      this.intervalTimer = setInterval(my.actualizeHorloge.bind(my), 1000/40)
      // Toutes les x secondes, on essaie d'actualiser l'affichage des
      // évènements autour du temps courant
      this.intervalReader = setInterval(my.actualizeReader.bind(my), 3000)
    }
  }
  desactivateHorloge(){
    if(this.intervalTimer){
      clearInterval(this.intervalTimer)
      this.intervalTimer = null
    }
    if(this.intervalReader){
      clearInterval(this.intervalReader)
      this.intervalReader = null
    }
  }
  actualizeHorloge(){
    this._horloge.innerHTML = this.getRealTime(this.controller.currentTime - this.horloge_rectif)
    this._horloge_real.innerHTML = this.getRealTime(this.controller.currentTime)
  }

  actualizeReader(){
    this.analyse.showEventsAt(this.controller.currentTime - this.horloge_rectif)
  }

  getRealTime(s){
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
  setSize(e, v, save){
    if(undefined===v) v = this.menuVideoSize.value
    this.controller.width = VideoController.VIDEO_SIZES[v]
    this.horloge.className = `horloge ${v}`
    if (save === true) this.analyse.videoSize = v
  }

  /**
   * Pour redéfinir les largeurs de la vidéo en fonction de la largeur
   * de l'écran.
   */
  redefineVideoSizes(w){
    VideoController.VIDEO_SIZES['large']   = w - 10
    if(w < 650){
      VideoController.VIDEO_SIZES['medium']    = parseInt((w / 3) * 2, 10)
      VideoController.VIDEO_SIZES['vignette']  = parseInt(w / 2.2, 10)
    }
  }


  /**
   * Méthode qui récupère le temps courant du film
   *
   */
  getTime(){
    return new OTime(this.controller.currentTime)
  }
  /**
   * (Number) Retourne le temps rectifié. Il peut être négatif.
   *
   * Si +t+ est fourni, on renvoie le temps réel de ce temps, sinon on
   * prend le temps courant
   */
  getRTime(t){
    if(undefined === t){t = this.controller.currentTime }
    if(this.hasStartTime){
      return t - this.analyse.filmStartTime.seconds
    } else {
      return t
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
   *
   * Note : le temps est également mis dans le clipboard
   */
  getAndShowTime(){
    var videoTC = this.getTime()
    $('#temps-courant-video-horloge').val(videoTC.horloge)
    $('#temps-courant-video-seconds').val(videoTC.secondsInt)
    if(this.hasStartTime){
      var filmTC  = new OTime(this.getRTime())
      $('#temps-courant-film-horloge').val(filmTC.horloge)
      $('#temps-courant-film-seconds').val(filmTC.secondsInt)
      clip(filmTC.horloge)
    } else {
      clip(videoTC.horloge)
    }
    $('#div-temps-courants').show();
    $('#span-temps-courants-film')[this.hasStartTime?'show':'hide']()
  }

  // Méthode qui cache les champs précédents
  hideCurrentTime(){
    $('#div-temps-courants').hide();
  }

  /**
   * Méthode qui définit le temps du film
   *
   * +time+ doit être un nombre de secondes
   */
  setTime(time, dontPlay){
    this.controller.currentTime = time
    if(this.playAfterSettingTime === true && !dontPlay){
      if(this.controller.paused) this.onTogglePlay()
    }
  }

  /**
   * Rejoint le temps "réel" +time+, c'est-à-dire en tenant compte du début
   * défini pour le film
   */
  setRTime(time, dontPlay){
    if(this.hasStartTime) time += this.analyse.filmStartTime.seconds
    this.setTime(time, dontPlay)
  }

  /**
   * Méthode appelée pour se rendre au temps voulu.
   * Le temps peut être défini comme on veut, en seconds, en horloge, etc.,
   * et il tient compte d'un début défini (puisqu'il utilise la méthode
   * `getRTime`).
   */
  goToTime(ev){
    var t = new OTime($('#requested_time').val()).seconds
    if(this.hasStartTime){ t += this.analyse.filmStartTime.seconds }
    var en_pause = this.controller.paused
    this.setTime(t, en_pause)
    if(en_pause) this.actualizeHorloge()
  }

  /**
   * Pour charger la vidéo de path +vpath+
   */
  load(vpath){
    this.controller.src = path.resolve(vpath)
    this.controller.load()
    this.setVideoUI(true)
  }

  /**
   * Préparation de l'interface en fonction de la présence ou non d'une
   * vidéo.
   */
  setVideoUI(visible){
    $('#div-video-path')[visible?'hide':'show']()
    $('#div-video-top-tools')[visible?'show':'hide']()
    toggleVisible('#video', visible)
    toggleVisible('#div-nav-video-buttons', visible)
    toggleVisible('#fs-get-times', visible)
    toggleVisible('#fs-new-event', visible)
    toggleVisible('#btn-time-as-film-start', !this.hasStartTime)
  }

  get hasStartTime(){
    return undefined!==this.analyse.filmStartTime
  }
  get horloge_rectif(){
    if(undefined===this._horloge_rectif){
      this._horloge_rectif = this.hasStartTime ? this.analyse.filmStartTime.seconds : 0
    }
    return this._horloge_rectif
  }
  get playAfterSettingTime(){
    return this._play_after_setting_time || true /* pour le moment */
  }
  set playAfterSettingTime(v){ this._play_after_setting_time = v }

  // --- DOM ÉLÉMENTS ---
  get horloge(){
    if(undefined===this._horloge){this._horloge = DGet('horloge')}
    return this._horloge
  }
  get btnPlay(){
    if(undefined === this._btnPl){this._btnPl = DGet('btn-real-play')}
    return this._btnPl
  }
  get btnRewindStart(){
    if(undefined===this._btnRwdSt){this._btnRwdSt = DGet('btn-rewind-start')}
    return this._btnRwdSt
  }
  get imgPauser(){
    return '<img src="./img/btn-pause.jpg" />'
  }
  get imgPlay(){
    return '<img src="./img/btn-play.jpg" />'
  }
  get imgRewindStart(){
    return '<img src="./img/btn-rewind.jpg" />'
  }
}
