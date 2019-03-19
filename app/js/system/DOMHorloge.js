'use strict'
/**
  * Class DOMHorloge et DOMDuration
  * -------------------
  * Pour la gestion des horloges
  *
  * @usage
  *   - On place un élément <horloge id="..."></horloge> dans la page
  *   - On l'instancie avec var horloge = new DOMHorloge(<dom element>[, <options>])
  *   Et ensuite on peut utiliser tout un tas de fonction pratiques à commencer
  *   par horloge.showTime([<time>]) pour définir le temps à afficher.
  *
  * Si l'horloge appartient à un parent modifiable, par exemple un formulaire,
  * on peut définir ce parent qui sera lui aussi marqué modified si l'horloge
  * l'est.
  *   var ih = new DOMHorloge(el)
  *   ih.parentModifiable = theInstanceParent
  *
  * Si l'horloge doit suivre la vidéo courante (propre à l'application
  * Film-Analyzer), on l'indique par :
  *   ih.synchroVideo = true
  *
  * Les styles de l'horloge sont définis dans DOMHorloge.css
  */

class DOMHorloge {
  constructor(domElement){
    this.domObj = domElement

    // Valeurs par défaut
    this.synchroVideo     = false
    this.parentModifiable = undefined
  }

  // ID de l'horloge = ID du DomElement
  get id(){return this._id || defP(this,'_id', this.domObj.id)}
  get time(){return this._time}
  set time(v){
    this._time = v
    this.domObj.setAttribute('value', v)
    this._otime = undefined
    if(undefined === this._initTime) this.initTime = this.otime.seconds
  }
  get modified(){return this._modified || false}
  set modified(v){
    this._modified = v
    if(v && this.parentModifiable) this.parentModifiable.modified = true
    if(!this.unmodifiable) this.jqObj[v?'addClass':'removeClass']('modified')
  }

  get unmodifiable(){return this._unmodifiable || false}
  set unmodifiable(v){this._unmodifiable = v}
  get jqObj(){return this._jqObj || defP(this,'_jqObj', $(this.domObj))}
  get otime(){return this._otime || defP(this,'_otime', new OTime(this.time))}

  get initTime(){return this._initTime}
  set initTime(v){this._initTime = v}

  // L'horloge à afficher
  // Sera surclassé pour la durée
  get horloge(){return this.otime.horloge}

  // ---------------------------------------------------------------------
  //  Méthodes d'action

  showTime(){ this.domObj.innerHTML = this.horloge }

  reset(){
    this.time = this.initTime
    this.showTime()
    if(this.synchroVideo) current_analyse.locator.setRTime(this.time)
    this.modified = false
    return this // chainage
  }

  /**
   * Dispatcher les données +data+ dans l'instance
   */
  dispatch(data){
    for(var p in data){this[p] = data[p]}
    return this // chainage
  }

  // ---------------------------------------------------------------------
  //  Méthodes d'évènements

  observe(){
    this.domObj.addEventListener('mousedown', this.onActivateEdition.bind(this))
  }

  onActivateEdition(ev){
    $('body').unbind('mouseup') // au cas om
    $('body').bind('mouseup', this.onEndMoving.bind(this))
    $('body').bind('mousemove', this.onMoving.bind(this))
    // console.log(ev)
    this.startMoveX = ev.clientX
    this.startMoveY = ev.clientY
    this.movingStartTime  = parseFloat(this.time)
    // console.log("this.movingStartTime=",this.movingStartTime)
    ev.stopPropagation() // pour empêcher de draguer la fenêtre
  }
  /**
   * Méthode appelée au déplacement de souris (sur le body)
   */
  onMoving(ev){
    this.moveX = ev.clientX
    var divisor = function(e){
      if (e.shiftKey) return 10
      else if(e.ctrlKey) return 1000
      else return 50
    }(ev)
    this.time = this.movingStartTime + ((this.moveX - this.startMoveX) / divisor)
    this.showTime()
    if(this.synchroVideo) this.synchronizeVideo()
  }
  // Surclassé pour la class DOMDuration
  synchronizeVideo(){
    current_analyse.locator.setRTime(this.time)
  }
  onEndMoving(ev){
    // console.log(ev)
    this.endMoveX = ev.clientX
    this.endMoveY = ev.clientY
    if (this.startMoveX == this.endMoveX){
      this.reset()
    } else {
      this.modified = true
    }
    $('body').unbind('mouseup') // au cas om
    $('body').unbind('mousemove') // au cas om
    ev.stopPropagation() // pour être cohérent ?
  }

}

/**
 * Presque identique à DOMHorloge, mais pour la gestion de la durée
 *
 * this.time, ici, correspond au temps de fin (endTime), c'est le temps
 * qu'on fait varier
 */
class DOMDuration extends DOMHorloge {
  constructor(domEl){
    super(domEl)
  }

  get startTime(){ return this._startTime }
  set startTime(v){ this._startTime = v }

  // Le temps de fin est toujours calculé en direct
  // C'est lui qui est affiché lorsqu'on change la durée à l'aide de la souris
  get endTime(){ return this.startTime + this.time }

  get duration(){return this._duration}
  set duration(v){
    // console.log("-> duration", v)
    this._endTime = this.startTime + v
    this.domObj.setAttribute('value', v)
    this._duration = v
  }

  // Surclasse la méthode principale
  set time(v){
    if(v <= 0) return
    this.duration = v
  }
  get time(){return this.duration}

  get otime(){return new OTime(this.duration)}

  get horloge(){return this.otime.horloge_as_duree}

  // Surclassé pour la class DOMDuration
  synchronizeVideo(){
    current_analyse.locator.setRTime(this.endTime)
  }

}
