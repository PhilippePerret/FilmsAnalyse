'use strict'

class FAEproc extends FAEvent {
  constructor(data){
    super(data)
    this.type         = 'proc'
    this.procType     = data.procType
    this.setup        = data.setup
    this.payoff       = data.payoff
    this.exploitation = data.exploitation
  }

  static get OWN_PROPS(){return ['setup', 'payoff','exploitation']}

  get isValid(){
    var errors = []

    // Définir ici les validité
    this.procType || errors.push({msg: "Le type du procédé est requis.", prop: 'procType'})
    this.content  || errors.push({msg: "La description du procédé est requis.", prop: 'content'})

    if(errors.length){super.onErrors(this, errors)}
    return errors.length == 0
  }

  /**
   * On dispatch les valeurs depuis le formulaire
   */
  dispatch(d){
    for(var prop of FAEproc.OWN_PROPS){
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
    for(var prop of FAEproc.OWN_PROPS){
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
