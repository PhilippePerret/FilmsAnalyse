'use strict'
/**
* Pour gérer toutes les fenêtres

Si on doit procéder à une opération après la construction, par exemple
le peuplement de menu, on peut utiliser la méthode `afterBuilding` dans
le propriétaire, qui sera appelée avant la méthode `observe`.

**/

class FWindow {

// ---------------------------------------------------------------------
//  CLASSES

/**
* Retourne un ID unique (pour la session)
**/
static newId(){
  if (undefined === this.lastId) this.lastId = 0
  return ++this.lastId
}

/**
* Gestion de la fenêtre courante, c'est-à-dire
* la fenêtre au premier plan
**/
// Méthode mettant la fenêtre +wf+ en fenêtre au premier plan
static setCurrent(wf, e){
  if(this.current && this.current.id == wf.id){
    // La fenêtre est déjà courante
  } else {
    if(this.current) this.current.bringToBack()
    this.current = wf
    this.current.bringToFront()
  }
  e && stopEvent(e)
}
static unsetCurrent(wf){
  if(this.current.id !== wf.id) return
  this.current.bringToBack()
  delete this.current
}
static get current()  {return this._current}
static set current(w) {this._current = w}

// ---------------------------------------------------------------------
//  INSTANCES

/**
* Instanciation d'une nouvelle Flying Window.

  +data+ doit contenir :
    - container     Le container jQuery qui va recevoir la
                    flying window.
    - class         La classe CSS à appliquer à la fwindow
**/
constructor(owner, data){
  try {
    owner || raise('fwindow-required-owner')
    ('function' === typeof owner.build) || raise('fwindow-owner-has-build-function')
    data || raise('fwindow-required-data')
    data.container || raise('fwindow-required-container')
    data.container.length || raise('fwindow-invalid-container')
    // owner.FWcontents || data.contents || raise('fwindow-contents-required')
  } catch (e) { throw(T(e)) }

  this.owner = owner
  this.id    = this.constructor.newId()
  this.built = false

  for(var k in data){this[`_${k}`] = data[k]}
}

toggle(){
  if(this.visible) this.hide()
  else {
    if(!this.built) this.build().observe()
    this.show()
  }
}
show(){
  this.jqObj.show()
  this.constructor.setCurrent(this)
  this.visible = true
}
hide(){
  this.constructor.unsetCurrent(this)
  this.jqObj.hide()
  this.visible = false
}
// Pour mettre la Flying window en premier plan
// Ne pas appeler ces méthodes directement, appeler la méthode
// de classe setCurrent
bringToFront(){
  this.jqObj.css('z-index', 100)
}
// Pour remettre la Flying window en arrière plan
bringToBack(){
  this.jqObj.css('z-index', 50)
}

build(){
  var div = DCreate('DIV', {
    id: this.domId
  , class: `fwindow ${this.class}`.trim()
  , append: this.owner.build()
  })
  $(this.container).append(div)
  // Si le propriétaire possède une méthode d'après construction,
  // on l'appelle.
  if('function' === typeof this.owner.afterBuilding) this.owner.afterBuilding()
  // Si le propriétaire possède une méthode qui place des observers
  // d'évènements, on la place
  if('function' === typeof this.owner.observe) this.owner.observe()

  this.built = true
  return this // chainage
}

observe(){
  // Une flying window est déplaçable par essence
  this.jqObj.draggable({
    containment: 'document'
  })
  // Une flying window est cliquable par essence
  this.jqObj.on('click', FWindow.setCurrent.bind(FWindow, this))
}

// ---------------------------------------------------------------------
//  Propriétés

get jqObj(){ return this._jqObj || defP(this,'_jqObj', $(`#${this.domId}`))}
get domId(){ return this._domId || defP(this,'_domId', `fwindow-${this.id}`)}
get container(){return this._container}
// class CSS fourni éventuellement par le propriétaire
get class(){return this._class}
// Position x/y de la fenêtre
get x(){return this._x || 100}
get y(){return this._y || 100}

}

module.exports = FWindow
