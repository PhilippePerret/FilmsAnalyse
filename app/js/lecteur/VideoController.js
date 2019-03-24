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

    this.observe()

    // On appelle juste l'indicateur de position pour l'initialiser
    this.positionIndicator.init()


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
  * Pour définir la vitesse de la vidéo
  **/
  setSpeed(speed){
    this.controller.defaultPlaybackRate = speed
    this.controller.playbackRate = speed
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

  /**
  * Quand on clique sur les marques de partie à côté de l'horloge principale,
  * on peut se rendre aux parties choisies. Chaque clic passe à la partie
  * suivante.
  **/
  onClickMarkPart(mainSub, absRel, e){
    // L'objet jQuery de la marque
    var mk = this[`mark${mainSub}Part${absRel}`]
    // l'identifiant structure de la partie courant (peut-être indéfini)
    var stt_id = mk.attr('data-stt-id')
    var node = this.a.PFA.node(stt_id)
    var other_node
    if (e.metaKey){
      other_node = this.a.PFA.node(node.previous || node.last)
    } else {
      other_node = this.a.PFA.node(node.next || node.first)
    }
    console.log("Nœud suivant/précédent:", other_node)
    console.log("temps suivant dans VideController#onClickMarkPart:", other_node[`startAt${absRel}`])
    this.a.locator.setRTime(other_node[`startAt${absRel}`])
    // this.a.locator.defineNextZonesStt sera automatiquement appelé par
    // setTime < setRTime
  }

  /**
  * Met le nom de la partie courant dans le champ à côté de l'horloge
  * principale, en réglant son attribut data-stt-id conservant son id
  * structurel
  **/
  setMarkPart(mainSub, absRel, zone){
    var mk = this[`mark${mainSub}Part${absRel}`]
    mk.html(zone.hname.toUpperCase())
    mk.attr('data-stt-id', zone.id)
  }

  /**
  * On place les observeurs sur le video-controleur
  **/
  observe(){
    this.markMainPartAbs.on('click', this.onClickMarkPart.bind(this, 'Main', 'Abs'))
    this.markSubPartAbs.on('click', this.onClickMarkPart.bind(this, 'Sub', 'Abs'))
    this.markMainPartRel.on('click', this.onClickMarkPart.bind(this, 'Main', 'Rel'))
    this.markSubPartRel.on('click', this.onClickMarkPart.bind(this, 'Sub', 'Rel'))
  }

  // Pour l'indicateur de position
  get positionIndicator(){
    if(undefined === this._positionIndicator){
      this._positionIndicator = new FAPositionIndicator(this, 1)
    }
    return this._positionIndicator
  }
  get a(){return this.analyse}//raccourci
  get markMainPartAbs(){return this._markMainPartAbs || defP(this,'_markMainPartAbs',$('#section-video #mark-main-part-abs'))}
  get markSubPartAbs(){return this._markSubPartAbs || defP(this,'_markSubPartAbs',$('#section-video #mark-sub-part-abs'))}
  get markMainPartRel(){return this._markMainPartRel || defP(this,'_markMainPartRel',$('#section-video #mark-main-part-rel'))}
  get markSubPartRel(){return this._markSubPartRel || defP(this,'_markSubPartRel',$('#section-video #mark-sub-part-rel'))}
}
