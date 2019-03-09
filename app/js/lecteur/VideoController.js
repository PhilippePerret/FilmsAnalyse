'use strict'

function affiche(msg){
  $('div#message').html(msg)
}


window.current_analyse = null // définie au ready

class VideoController {
  constructor(analyse){
    this.analyse = analyse
  }

  static get VIDEO_SIZES(){
      return {vignette: 450, medium: 650, large: 1000}
  }

  // Le contrôleur vidéo lui-même (la balise vidéo)
  get controller(){
    if(undefined === this._controller){this._controller = DGet('video')}
    return this._controller
  }
  get inited(){return this._inited || false }
  set inited(v){this._inited = v}

  /**
   * Initialisation du controller
   *
   * TODO : quand on utilisera plusieurs VideoController, il faudra que les
   * identifiant soient uniques
   */
  init(){
    var my = this
    if (this.inited){throw("Le vidéocontroller ne devrait pas être initié deux fois…")}

    this.locator = this.analyse.locator

    // --- Éléments DOM ---
    // TODO Tous ceux définis en get pourrait être mis ici, plutôt
    // Attention tout de même à bien mesure l'ordre d'initialisation des éléments
    // il faut qu'ils soient initialisés ou accessible.

    this.setDimensions()

    // Menu pour changer la taille de la vidéo
    this.menuVideoSize = DGet('video-size')
    listen(this.menuVideoSize,'change',my,'setSize')

    // Pour définir le path de la vidéo
    listenClick('btn-set-video-path',this.analyse, 'setVideoPath')

    // Si l'analyse a enregistré une taille de vidéo, on la règle. Sinon, on
    // met la taille médium.
    this.setSize(null, this.analyse.videoSize||'medium', false)
    this.menuVideoSize.value = this.analyse.videoSize||'medium'

    this.inited = true
  }
  // /fin init

  // Tailles pour le lecteur video
  setDimensions(){
    var videoReaderWidth = parseInt((ScreenWidth * 60) / 100,10)
    $('#section-video').css('width',`${videoReaderWidth}px`)
    // Redéfinition de la taille large de la vidéo en fonction de
    // l'écran.
    this.redefineVideoSizes(videoReaderWidth)
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
    this.locator.horloge.className = `horloge ${v}`
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

}
