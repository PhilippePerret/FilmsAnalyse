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
      return {small: 450, medium: 650, large: 1000}
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

    this.setDimensions()

    // Si l'analyse a enregistré une taille de vidéo, on la règle. Sinon, on
    // met la taille médium.
    this.setSize(null, this.analyse.options.get('video_size')||'medium')

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
    // console.log("-> VideoController#load")
    $(this.controller)
    .on('error', ()=>{
      console.log("Une erreur s'est produite au chargement de la vidéo.", err)
    })
    .on('loadeddata', () => {
      UI.showVideoController()
      var lastCurTime = this.analyse.lastCurrentTime
      lastCurTime && this.analyse.locator.setRTime(lastCurTime, true)
      this.analyse.setAllIsReady.bind(current_analyse)()
    })
    this.controller.src = path.resolve(vpath)
    this.controller.load()
  }

  /**
   * Préparation de l'interface en fonction de la présence ou non d'une
   * vidéo.
   */
  setVideoUI(visible){
    $('#div-video-top-tools')[visible?'show':'hide']()
    toggleVisible('#video', visible)
    toggleVisible('#div-nav-video-buttons', visible)
    toggleVisible('#fs-get-times', visible)
    toggleVisible('#fs-new-event', visible)
  }

  get markMainPartAbs(){return this._markMainPartAbs || defP(this,'_markMainPartAbs',$('#section-video #mark-main-part-abs'))}
  get markSubPartAbs(){return this._markSubPartAbs || defP(this,'_markSubPartAbs',$('#section-video #mark-sub-part-abs'))}
  get markMainPartRel(){return this._markMainPartRel || defP(this,'_markMainPartRel',$('#section-video #mark-main-part-rel'))}
  get markSubPartRel(){return this._markSubPartRel || defP(this,'_markSubPartRel',$('#section-video #mark-sub-part-rel'))}
}
