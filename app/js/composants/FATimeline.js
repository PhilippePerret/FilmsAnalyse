'use strict'
/**
* Classe FATimeline
* -----------------
* Pour transformer des éléments qui devront pouvoir répondre
* aux fonctionnalités de la Timeline.
**/

class FATimeline {
  /**
  * Instanciation de l'objet Timeline, avec son container,
  * qui sera la bande qui réagira aux souris.
  **/
  constructor(container, analyse){
    this.container    = container
    this.jqContainer  = $(container)
    this.jqContainer.addClass('timeline')
    this.analyse      = analyse || current_analyse
}

  init(){
    // Construire les éléments (p.e. l'horloge)
    this.build()
    // Placer les observers
    this.observe()
    this.inited = true
}
  /**
  * Positionne le cursor principal au temps voulu
  **/
  positionneAt(rtime){
    this.mainCursor.css('left', `${(rtime * this.coefT2P)+4}px`)
}
/**
* Quand on arrive sur le slider
*
* Pour le moment, on ne fait qu'arrêter la vidéo et se mettre en place
**/
  onHoverSlider(e){
    if(this.locator.playing) this.locator.stop()
    this.otime.updateSeconds((e.offsetX - 10) * this.coefP2T)
    stopEvent(e)
}
  onMoveOnSlider(e){
    this.otime.updateSeconds((e.offsetX - 10) * this.coefP2T)
    this.horloge.html(this.otime.horloge)
    stopEvent(e)
}
/**
* Le clic sur le slider doit démarrer la vidéo.
**/
  onClickOnSlider(e){
    this.locator.setRTime(this.otime.seconds)
    this.positionneAt(this.otime.seconds)
    if(this.locator.playing) this.locator.togglePlay()
}
  onDoubleClickOnSlider(e){
    this.locator.togglePlay()
    this.positionneAt(this.otime.seconds)
}

/**
* Construction de la Timeline
**/
  build(){
    var ho = document.createElement('span')
    ho.className = 'timeline-horloge horloge'
    this.container.appendChild(ho)

    // Le div qui va permettre de placer les
    // cursors
    var di = document.createElement('div')
    di.className = 'timeline-cursors'

    // Le div du curseur principal
    var cu = document.createElement('div')
    cu.className = 'cursor timeline-maincursor'
    di.appendChild(cu)

    this.container.appendChild(di)


    this.built = true

    return this // pour le chainage
}
  observe(){
    this.jqContainer.on('click',      this.onClickOnSlider.bind(this))
    this.jqContainer.on('dblclick',   this.onDoubleClickOnSlider.bind(this))
    this.jqContainer.on('mousemove',  this.onMoveOnSlider.bind(this))
}

  get a(){return this.analyse}
  get otime(){return this._otime||defP(this,'_otime', new OTime(0))}

  get mainCursor(){return this._mainCursor || defP(this,'_mainCursor', this.jqContainer.find('.timeline-maincursor'))}
  get locator(){return this._locator || defP(this,'_locator',this.a.locator)}
  get sliderObj(){return this.jqObj.find('#timeline-slider')}
  get horloge(){return this._horloge || defP(this,'_horloge',this.jqContainer.find('.timeline-horloge'))}

  get coefP2T(){
    if( undefined === this._coefP2T){
      this._coefP2T = this.dureeFilm / this.widthContainer
    }
    return this._coefP2T
}

  get coefT2P(){
  if(undefined === this._coefT2P){
    this._coefT2P = this.widthContainer / this.dureeFilm
  }
  return this._coefT2P
}
  get widthContainer(){return this.jqContainer.width()}
  get dureeFilm(){return this._dureeFilm || defP(this, '_dureeFilm', this.a.duration)}

}// /fin de FATimeline
