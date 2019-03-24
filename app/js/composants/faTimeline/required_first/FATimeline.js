'use strict'
/**
* Object FATimeline
* -----------------
* Pour gérer la ligne de temps
**/

const FATimeline = {
  class: 'FATimeline'
, isVisible: false // au début
, built: false
/**
* Affichage la timeline
**/
, toggle(){
    this[this.isVisible?'hide':'show']()
}
, show(){
    if(!this.built) this.build().observe().setup()
    this.jqObj.show()
    this.isVisible = true
}
, hide(){
    this.jqObj.hide()
    this.isVisible = false
}

/**
* Quand on arrive sur le slider
*
* Pour le moment, on ne fait qu'arrêter la vidéo et se mettre en place
**/
, onHoverSlider(e){
    if(this.locator.playing) this.locator.stop()
    this.otime.updateSeconds((e.offsetX - 10) * this.coefP2T)
    this.locator.setRTime(this.otime.seconds)
    stopEvent(e)
}
, onMoveOnSlider(e){
    this.otime.updateSeconds((e.offsetX - 10) * this.coefP2T)
    if(this.otime.seconds < 0 || this.otime.seconds > this.dureeFilm) return false
    this.locator.setRTime(this.otime.seconds)
    // console.log("Souris glissée sur le slider à", e.offsetX, this.otime.horloge)
    stopEvent(e)
}
/**
* Le clic sur le slider doit démarrer la vidéo.
**/
, onClickOnSlider(e){
    this.locator.togglePlay()
}

/**
* Construction de la Timeline
**/
, build(){
    var div = document.createElement('DIV')
    div.id = 'timeline'
    div.style.width = this.largeurTotale + 'px'
    var header = document.createElement('DIV')
    header.id = 'timeline-header'
    var slider = document.createElement('DIV')
    slider.id = 'timeline-slider'

    div.appendChild(header)
    div.appendChild(slider)

    document.body.appendChild(div)

    this.built = true

    return this // pour le chainage
}
, observe(){
    // La timeline doit pouvoir se déplacer
    this.jqObj.draggable()
    // la partie "slider" doit être réactive à la souris
    this.sliderObj.on('mousemove', this.onMoveOnSlider.bind(this))
    this.sliderObj.on('mouseover', this.onHoverSlider.bind(this))
    this.sliderObj.on('click', this.onClickOnSlider.bind(this))
    return this // pour le chainage
}
/**
* Pour les calculs de base qui vont permettre de se situer dans le film
* par rapport à la position de la souris sur le slidder
**/
, setup(){
    // console.log("Largeur film de la bande :", this.largeurFilm)
    // console.log("Durée du film : ", current_analyse.duration)
    // console.log("coefP2T:", this.coefP2T)
    // console.log("coefT2P:", this.coefT2P)
}

}// /fin de FATimeline

Object.defineProperties(FATimeline,{
  a:{
    get(){return this._a || defP(this,'_a', current_analyse)}
}
, locator:{
    get(){return this._locator || defP(this,'_locator',this.a.locator)}
}
, jqObj:{
    get(){return $('#timeline')}
}
, sliderObj:{
    get(){return this.jqObj.find('#timeline-slider')}
}
, otime:{
    get(){return this._otime||defP(this,'_otime', new OTime(0))}
}
/**
* Rapport entre la largeur et la position temporelle
* En multipliant une position en pixels sur la bande avec ce coefficiant,
* on obtient la position temporelle dans le film.
**/
, coefP2T:{
    get(){
      if(undefined === this._coefP2T){
        this._coefP2T = this.dureeFilm / this.largeurFilm
      }
      return this._coefP2T
    }
}
, coefT2P:{
    get(){
      if(undefined === this._coefT2P){
        this._coefT2P = this.largeurFilm / this.dureeFilm
      }
      return this._coefT2P
    }
}
, dureeFilm:{
    get(){return this._dureeFilm || defP(this, '_dureeFilm', this.a.duration)}
}
/**
* Largeur totale de la Timeline
**/
, largeurTotale:{
    get(){return this._largTot || defP(this,'_largTot', ScreenWidth - 100) }
}
/**
* On retire une marque de 10 pixels à droite et à gauche pour ne pas commencer
* tout au raz du bord.
**/
, largeurFilm:{
    get(){return this._largFilm || defP(this,'_largFilm', this.largeurTotale - 20)}
}
})
