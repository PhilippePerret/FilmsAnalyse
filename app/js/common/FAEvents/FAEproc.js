'use strict'

class FAEproc extends FAEvent {
  constructor(data){
    super(data)
    this.type         = 'proc'
    this.setup        = data.setup
    this.payoff       = data.payoff
    this.exploitation = data.exploitation
  }

  static get OWN_PROPS(){return ['setup', 'payoff','exploitation']}

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
