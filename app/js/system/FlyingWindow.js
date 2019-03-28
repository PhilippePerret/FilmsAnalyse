'use strict'
/**
* Pour gérer toutes les fenêtres

USAGE
=====

var fwindow = new FWindow(<owner>, <data>)

Avec <data> qui doit contenir au moins :
  container   L'élément DOM/jQuery devant contenir la flying-window
  Valeurs optionnelles
  --------------------
  id          Pour définir un ID précis. Sinon, c'est "fwindow-<X>" qui sera
              utilisé, en incrémentant <X> au nombre de fenêtres à peu près.
  class       La classe CSS à appliquer
  x           Position horizontale (en pixels)
  y           Position verticale (en pixels)

Au minimum, le propriétaire, un objet, doit définir les méthodes :
  - `build`   doit retourner l'élément DOM à insérer dans la f-window


Méthodes particulières
----------------------
`observe`
--------
Méthode plaçant les observateurs d'évènements.

`afterBuilding`
--------------
Si on doit procéder à une opération après la construction, par exemple
le peuplement de menu, on peut utiliser la méthode `afterBuilding` dans
le propriétaire, qui sera appelée avant la méthode `observe`.

`onShow`, `onHide`
-----------------
Ces deux méthodes propriétaires sont appelées à la fin de `show` et
de `hide` si elles existent. Elles permettent de faire un traitement particulier
après la fermeture ou l'ouverture de la flying-window.

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
  // console.log("On met cette fenêtre en fenêtre courante:", wf)
  if(this.current && this.current.id == wf.id) return
  if(this.current) this.current.bringToBack()
  this.current = wf
  this.current.bringToFront()
  /**
    Ne surtout pas :
      this.checkOverlaps(wf)
    Car la méthode est appelée aussi quand on ferme une fenêtre
    => Le check du chevauchement doit être invoqué au show de
    la fenêtre volante.
  **/
  // On vérifie que la fenêtre ne soit pas juste sur une autre
  /**
    Surtout pas :
      e && stopEvent(e)
    car sinon, lorsqu'on clique sur un checkbox
    par exemple, c'est bloqué.
  **/
}
/**
* Méthode qui vérifie que la flying-window +wf+ ne soit pas placée
* sur une autre.
**/
static checkOverlaps(wf){
  console.log("setCurrent : vérification overlap")
  var {top: refTop, left: refLeft} = wf.jqObj.offset()
  refTop  = Math.round(refTop)
  refLeft = Math.round(refLeft)
  // console.log("refTop/refLeft initiaux:", refTop, refLeft)
  var moveIt = false
  $('.fwindow').each(function(i,w){
    if(w.id == wf.domId) return // la fenêtre qu'on checke
    if(moveIt === true) return
    var {top, left} = $(w).offset()
    top   = Math.round(top)
    left  = Math.round(left)
    if(refTop.isCloseTo(top, 8) || refLeft.isCloseTo(left, 8)){
      refTop  += 16
      refLeft += 16
      moveIt  = true
    }
  })
  // TODO Peut-être qu'on l'a déplacée sur une autre
  // => Recommencer jusqu'à ce que ce soit bon
  if(moveIt === true){
    // console.log("refTop/refLeft corrigés:", refTop, refLeft)
    wf.jqObj.css({left:`${refLeft}px`, top:`${refTop}px`})
    return this.checkOverlaps(wf)
  } else {
    return true
  }
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
    if(undefined === data.container) data.container = $('body')
    data.container || raise('fwindow-required-container')
    data.container = $(data.container)
    data.container.length || raise('fwindow-invalid-container')
    // owner.FWcontents || data.contents || raise('fwindow-contents-required')
  } catch (e) { throw(T(e)) }

  this.owner = owner
  for(var k in data){this[`_${k}`] = data[k]}
  this.id    = data.id || this.constructor.newId()
  if(data.id) this._domId = data.id
  this.built = false

}

toggle(){
  this[this.visible?'hide':'show']()
}
show(){
  if(!this.built) this.build().observe()
  this.jqObj.show()
  this.constructor.setCurrent(this)
  FWindow.checkOverlaps(this)
  if ('function' === typeof this.owner.onShow) this.owner.onShow()
  this.visible = true
}
hide(){
  this.constructor.unsetCurrent(this)
  this.jqObj.hide()
  if ('function' === typeof this.owner.onHide) this.owner.onHide()
  this.visible = false
}
update(){
  if(!this.built) return
  this.jqObj.remove()
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
  // console.log("Construction de la FWindow ", this.domId)
  var div = DCreate('DIV', {
    id: this.domId
  , class: `fwindow ${this.class || ''}`.trim()
  , append: this.owner.build()
  , style: `top:${this._y||0}px;left:${this._x||0}px;`
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
  // console.log("this.jqObj:", this.jqObj)
  this.jqObj.draggable({
    containment: 'document'
  })
  // Une flying window est cliquable par essence
  // this.jqObj.find('header, body').on('click', FWindow.setCurrent.bind(FWindow, this))
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
