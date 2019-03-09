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

  /**
   * Initialisation de l'instance AReader
   */
  init(){
    this.setDimensions()
  }

  setDimensions(){

    var videoWidth   = parseInt((ScreenWidth * 60) / 100,10)
    var readerWidth  = parseInt((ScreenWidth * 39) / 100,10)
    var readerHeight = parseInt((ScreenHeight * 50)/100,10)

    $('#section-reader').css({
        "width": `${readerWidth}px`
      , "height":`${readerHeight}px`
      , "margin-left": `${1 + videoWidth}px`
    })

  }

  /**
   * Vide tout le reader
   * Ne pas la confondre avec la méthode `resetBeyond` suivante
   */
  reset(){
    this.container.innerHTML = ""
  }

  /**
   * Vide le reader, mais seulement en supprimant les évènements qui se trouvent
   * avant +from_time+ et après +to_time+
   *
   * Note : les temps sont exprimés en temps par rapport au film, pas par
   * rapport à la vidéo (comme tous les temps normalement)
   */
  resetBeyond(from_time, to_time){
    this.container.querySelectorAll('.event').forEach(function(o){
      console.log("Test de ", o)
      var t = parseInt(o.getAttribute('data-time'),10)
      if ( t < from_time || t > to_time){
        $(o).hide()
      }
    })
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
