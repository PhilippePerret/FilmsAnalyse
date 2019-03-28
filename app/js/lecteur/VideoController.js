'use strict'

function affiche(msg){
  $('div#message').html(msg)
}


window.current_analyse = null // définie au ready

class VideoController {

// ---------------------------------------------------------------------
//  CLASSE

static get VIDEO_SIZES(){
    return {small: 450, medium: 650, large: 1000}
}



// ---------------------------------------------------------------------
//  INSTANCE

constructor(analyse){
  this.analyse = this.a = analyse
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
  this.ksize = this.a.options.get('video_size')||'medium'
  this.setSize(null, this.ksize)

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
  if (save === true) this.a.videoSize = v
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
  Quand on clique sur les marker de structure à côté de l'horloge principale,
  on peut se rendre aux parties choisies. Chaque clic passe à la partie
  suivante. CMD click permet de revenir en arrière.

  +mainSub+   Soit 'Main' soit 'Sub', pour indiquer qu'il s'agit d'une
              partie (expo, dév, dénouement) ou d'une zone
  +absRel+    Soit 'Abs', soit 'Rel', pour indiquer qu'on a cliqué sur
              la section qui s'occupe des valeurs absolues ou la section
              qui s'occupe des valeurs relatives.

**/
onClickMarkStt(mainSub, absRel, e){
  var pfa = this.a.PFA
  // L'objet jQuery du marker
  var mk = this[`mark${mainSub}Part${absRel}`]
  // l'identifiant structure de la partie courant (peut-être indéfini)
  var kstt = mk.attr('data-stt-id')
  if(!kstt){
    // <= L'identifiant structurel n'est pas défini
    // => Il n'existe pas de noeud courant ou on est au tout début
    // ==> Prendre l'exposition
    kstt = mainSub == 'Main' ? 'DNOU' : 'desine'
  }
  var node = pfa.node(kstt)
  // console.log("Noeud courant : ", node.hname)
  var other_node
  if (e.metaKey){
    other_node = pfa.node(node.previous || node.last)
    // Sinon le temps ne serait pas contrôlé, car il est avant le
    // temps suivant attendu :
    delete this.a.locator.nextTimes
  } else {
    other_node = pfa.node(node.next || node.first)
  }
  // console.log("Nœud suivant/précédent, son temps:", other_node, other_node[`startAt${absRel}`])
  this.a.locator.setRTime(other_node[`startAt${absRel}`])

  pfa = null
}

/**
* Met le nom de la partie courant dans le champ à côté de l'horloge
* principale, en réglant son attribut data-stt-id conservant son id
* structurel
**/
setMarkStt(mainSub, absRel, node, name){
  var mk = this[`mark${mainSub}Part${absRel}`]
  mk.html(name || '---')
  node && mk.attr('data-stt-id', node.id)
}

/**
* On place les observeurs sur le video-controleur
**/
observe(){
  // Sur la vidéo elle-même, pour récupérer un temps
  var vid = $('#video')
  vid.draggable({
    revert: true
  , cursorAt: {left: 40, top: 10}
  , helper: (e) => {
      return DCreate('DIV', {
        inner:this.locator.getROTime().horloge
      , class: 'dropped-time'
      , attrs:{'data-type': 'time'}
      })
    }
  })

  // Sur les parties à droite de l'horloge principale
  this.markMainPartAbs.on('click', this.onClickMarkStt.bind(this, 'Main', 'Abs'))
  this.markSubPartAbs.on('click', this.onClickMarkStt.bind(this, 'Sub', 'Abs'))
  this.markMainPartRel.on('click', this.onClickMarkStt.bind(this, 'Main', 'Rel'))
  this.markSubPartRel.on('click', this.onClickMarkStt.bind(this, 'Sub', 'Rel'))
}

get markMainPartAbs(){return this._markMainPartAbs || defP(this,'_markMainPartAbs',$('#section-video #mark-main-part-abs'))}
get markSubPartAbs(){return this._markSubPartAbs || defP(this,'_markSubPartAbs',$('#section-video #mark-sub-part-abs'))}
get markMainPartRel(){return this._markMainPartRel || defP(this,'_markMainPartRel',$('#section-video #mark-main-part-rel'))}
get markSubPartRel(){return this._markSubPartRel || defP(this,'_markSubPartRel',$('#section-video #mark-sub-part-rel'))}


// Pour l'indicateur de position, une timeline sous
// la vidéo.
get positionIndicator(){
  if(undefined === this._positionIndicator){
    this._positionIndicator = new FATimeline(DGet('position-indicator-1-container'))
  }
  return this._positionIndicator
}

}
