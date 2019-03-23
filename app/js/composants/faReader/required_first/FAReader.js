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
    document.getElementById('reader').innerHTML = ""
  }

  // ---------------------------------------------------------------------
  //  INSTANCE

  constructor(analyse){
    this.analyse = analyse
  }

  /**
   * Initialisation de l'instance FAReader
   */
  init(){

  }

  /**
   * Vide tout le reader
   * Ne pas la confondre avec la méthode `resetBeyond` suivante
   */
  reset(){
    FAReader.reset()
  }

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

  // Pour ajouter
  append(node){
    this.container.append(node)
  }

  /**
   * Méthode qui permet d'afficher tous les events d'un coup
   */
  displayAll(){
    this.analyse.forEachEvent(function(ev){ev.show()})
  }

  // ---------------------------------------------------------------------
  //  DOM ELEMENTS
  get container(){
    if(undefined === this._container){
      // TODO Il faudra lui donner un identifiant unique lorsqu'il y aura
      // plusieurs readers
      this._container = document.getElementById('reader')
    }
    return this._container
  }
  get section(){
    return document.getElementById('section-reader')
  }
}
