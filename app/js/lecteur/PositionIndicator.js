'use strict'
/**
* Class FAPositionIndicator
* -----------------------
* Pour gérer la position dans le film de l'image courante
**/

class FAPositionIndicator {
  constructor(videoController, id){
    this.id = id || 1
    this.videoController = videoController
  }

  init(){
    // Placer les observers
    this.observe()
  }
  /**
  * Méthode appelée pour positionner le cursor au temps +rtime+
  **/
  positionneAt(rtime){
    this.jqCursor.css('left', `${rtime * this.coefT2P}px`)
  }
  /**
  * Méthode appelée quand on clique sur la bande, pour choisir une autre
  * position.
  **/
  setVideoTime(e){
    // var newPosition = this.coefP2T * e.clientX
    console.log("-> setVideoTime")
    this.a.locator.setRTime((this.coefP2T * (e.clientX - 8)))
    return stopEvent(e)
  }
  onMouseMove(e){
    this.otime.updateSeconds((e.offsetX - 8) * this.coefP2T)
    this.horloge.html(this.otime.horloge)
    stopEvent(e)
  }
  /**
  * On place un observer de clic pour se rendre à l'endroit cliqué
  **/
  observe(){
    this.jqContainer.on('click', this.setVideoTime.bind(this))
    this.jqContainer.on('mousemove', this.onMouseMove.bind(this))
  }

  get otime(){return this._otime||defP(this,'_otime', new OTime(0))}
  /**
  * Coefficiants pour les calculs
  **/
  get coefP2T(){return this._coefP2T||defP(this,'_coefP2T',this.dureeFilm / this.width)}
  get coefT2P(){return this._coefT2P || defP(this,'_coefT2P', this.width / this.dureeFilm)}
  // Durée du film
  get dureeFilm(){return this._duration||defP(this,'_duration',this.a.duration)}
  // Largeur du container
  get width(){return parseInt(this.jqContainer.width(),10)}
  // L'horloge pour indiquer la position du curseur
  get horloge(){return $(`#position-indicator-${this.id}-container span.horloge`)}
  // Le curseur principal
  get jqCursor(){return $(`#position-indicator-${this.id}-cursor-1`)}
  // Le container principal
  get jqContainer(){return $(`#position-indicator-${this.id}-container`)}
  get a(){return this._a || defP(this,'_a', this.videoController.analyse)}
}
