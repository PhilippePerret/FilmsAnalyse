'use strict'

class FAEinfo extends FAEvent {
  constructor(data){
    super(data)
  }

  get isValid(){
    var errors = []

    // Définir ici les validité
    this.content || errors.push({msg: "Le contenu de l'information est requis.", prop: 'content'})

    if(errors.length){super.onErrors(this, errors)}
    return errors.length == 0
  }

}
