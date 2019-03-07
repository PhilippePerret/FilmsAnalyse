'use strict'

class FAEaction extends FAEvent {
  constructor(data){
    super(data)
    this.type         = 'action'
    this.actionType   = data.actionType
  }

  // Propriétés propres
  static get OWN_PROPS(){return ['actionType']}

  /**
   * On dispatch les valeurs depuis le formulaire
   */
  dispatch(d){
    for(var prop of FAEaction.OWN_PROPS){
      if(undefined === d[prop]) continue
      this[prop] = d[prop]
    }
    // Valeurs particulières
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
