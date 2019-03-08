'use strict'

class FAEaction extends FAEvent {
  constructor(data){
    super(data)
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

  /**
   * Récupérer les données pour les enregistrer
   */
  get data(){
    var d = super.data
    for(var prop of FAEaction.OWN_PROPS){
      if(undefined === this[prop]) continue
      d[prop] = this[prop]
    }
    return d
  }

  get div(){
    var n = super.div

    return n
  }
}
