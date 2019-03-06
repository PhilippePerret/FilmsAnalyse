'use strict'


class FAEvent {

  constructor(data){
    this.type     = data.type     // (String)
    this.time     = data.time     // (number => OTime)
    this.content  = data.content  // (String)
  }

  /**
   * Pour afficher l'évènement dans le reader de l'analyse
   */
  show(){
    console.log("Affichage de l'évènement à ", this.time)
  }

}
