'use strict'

class FAEnote extends FAEvent {
  constructor(analyse, data){
    super(analyse, data)
    this.type     = 'note'
    this.noteType = data.noteType
  }

  // Propriétés propres aux notes
  static get OWN_PROPS(){return ['noteType']}

  get isValid(){
    var errors = []

    // Définir ici les validité
    this.content || errors.push({msg: "Le contenu de la note est requis.", prop: 'content'})

    if(errors.length){super.onErrors(this, errors)}
    return errors.length == 0
  }

}
