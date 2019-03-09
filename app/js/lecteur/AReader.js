'use strict'
/**
 * Object Reader
 * --------------
 * Pour la lecture de l'analyse
 */

class AReader {
  constructor(analyse){
    this.analyse = analyse
  }
  // Pour ajouter
  append(node){
    this.container.append(node)
  }

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
