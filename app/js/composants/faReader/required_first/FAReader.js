'use strict'
/**
 * Object Reader
 * --------------
 * Pour la lecture de l'analyse
 */

class FAReader {

// Constante déterminant le temps qu'il faut laisser avant et après le
// temps courant. Les events avant tempsCourant-TIME_AROUND et les events
// après tempsCourant + TIME_AROUND seront masqués (mais laissés dans le DOM)
// TODO Plus tard, cette constante devra devenir une préférence qu'on peut
// régler.
static get TIME_AROUND(){ return 5*60 }

static reset(){
  new FAReader().container.innerHTML = ''
}

// ---------------------------------------------------------------------
//  INSTANCE

constructor(analyse){
  this.analyse = this.a = analyse
}

/**
 * Initialisation de l'instance FAReader
 */
init(){
  // Rien pour le moment
}
show(){this.fwindow.show()}
hide(){this.fwindow.hide()}
build(){
  return DCreate('DIV', {inner: 'LECTEUR', class: 'fw-title'})
}
afterBuilding(){
  // Peut-être supprimer le div ci-dessus avec READER dedans
}

/**
  Quand on charge une autre analyse, il faut détruire le
  reader de l'analyse courante.
  Ce qui revient à détruire sa flying-window.
**/
remove(){ this.fwindow.remove() }

/**
  Vide tout le reader
  Ne pas la confondre avec la méthode `resetBeyond` suivante
 */
reset(){ this.container.innerHTML = ''}

/**
 * Vide le reader, mais seulement en supprimant les évènements qui se trouvent
 * avant +from_time+ et après +to_time+
 *
 * Note : les temps sont exprimés en temps par rapport au film, pas par
 * rapport à la vidéo (comme tous les temps normalement)
 */
resetBeyond(from_time, to_time){
  var t, id, my = this
  this.container.querySelectorAll('.event').forEach(function(o){
    t = parseInt(o.getAttribute('data-time'),10)
    id = parseInt(o.getAttribute('data-id'),10)
    if ( t < from_time || t > to_time){my.analyse.ids[id].hide()}
  })
}

// Pour ajouter un noeud, la plupart du temps un event
append(node){
  this.container.append(node)
}

/**
 * Méthode qui permet d'afficher tous les events d'un coup
 */
displayAll(){
  this.a.forEachEvent(function(ev){ev.show()})
}

// ---------------------------------------------------------------------
//  DOM ELEMENTS
get fwindow(){
  return this._fwindow || defP(this,'_fwindow', new FWindow(this, {id: 'reader', container: this.section, x: ScreenWidth - 650, y: 4}))
}
get container(){
  return this._container || defP(this,'_container', DGet('reader'))
}
get section(){
  return this._section || defP(this,'_section', DGet('section-reader'))
}
}
