'use strict'

class FAEaction extends FAEvent {
  constructor(analyse, data){
    super(analyse, data)
    this.type         = 'action'
    this.actionType   = data.actionType
  }

  // Propriétés propres
  static get OWN_PROPS(){return ['actionType']}

  get isValid(){
    var errors = []

    // Définir ici les validité
    this.content || errors.push({msg: "La description de l'action est indispensable.", prop: 'content'})

    if(errors.length){super.onErrors(this, errors)}
    return errors.length == 0
  }

  /**
   * On dispatch les valeurs depuis le formulaire
   */
  dispatch(d){
    super.dispatch(this, d)
  }

  get div(){
    var n = super.div

    return n
  }
}
