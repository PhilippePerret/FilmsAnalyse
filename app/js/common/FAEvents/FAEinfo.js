'use strict'

class FAEinfo extends FAEvent {
  constructor(data){
    super(data)
    this.type     = 'info'
    this.infoType = data.infoType
  }

  // Propriétés propres aux informations
  static get OWN_PROPS(){return ['infoType']}

  get isValid(){
    var errors = []

    // Définir ici les validité
    this.content || errors.push({msg: "Le contenu de l'information est requis.", prop: 'content'})

    if(errors.length){super.onErrors(this, errors)}
    return errors.length == 0
  }

}
