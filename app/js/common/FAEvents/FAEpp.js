'use strict'

class FAEpp extends FAEvent {
  constructor(data){
    super(data)
    this.type         = 'pp'
    this.setup        = data.setup
    this.payoff       = data.payoff
    this.tps_payoff   = data.tps_payoff
    this.exploitation = data.exploitation
  }

  static get OWN_PROPS(){return [['setup', 'inputtext-1'], ['payoff', 'inputtext-2'], ['tps_payoff', 'tps_reponse'], 'exploitation']}

  get isValid(){
    var errors = []

    // Définir ici les validité
    this.setup   || errors.push({msg: "La préparation est requise.", prop: 'inputtext-1'})
    this.content || errors.push({msg: "La description de la préparation/paiement est requise.", prop: 'content'})
    if (this.payoff){
      this.tps_payoff || errors.push({msg: "Le temps du paiement est requis.", prop: 'tps_reponse'})
    }

    if(errors.length){super.onErrors(this, errors)}
    return errors.length == 0
  }

  get div(){
    var n = super.div

    return n
  }
}
