'use strict'

class FAEproc extends FAEvent {
  // ---------------------------------------------------------------------
  //  CLASSE

  // Pour dispatcher les données propre au type
  // Note : la méthode est appelée en fin de fichier
  static dispatchData(){
    for(var prop in this.dataType) this[prop] = this.dataType[prop]
  }
  static get dataType(){
    return {
        hname: 'Procédé'
      , short_hname: 'Procédé'
      , type: 'proc'
    }
  }
  // ---------------------------------------------------------------------
  //  INSTANCE
  constructor(analyse, data){
    super(analyse, data)
    this.type         = 'proc'
    this.procType     = data.procType
    this.setup        = data.setup
    this.payoff       = data.payoff
    this.exploitation = data.exploitation
  }

  static get OWN_PROPS(){return [['setup', 'inputtext-1'], ['payoff','inputtext-2'], ['tps_payoff', 'tps_reponse'], 'exploitation']}

  get isValid(){
    var errors = []

    // Définir ici les validité
    this.procType || errors.push({msg: "Le type du procédé est requis.", prop: 'procType'})
    this.setup    || errors.push({msg: "L'installation du procédé est requis.", prop: 'inputtext-1'})
    this.content  || errors.push({msg: "La description du procédé est requis.", prop: 'content'})
    if(this.payoff){
      this.tps_payoff || errors.push({msg: "Le temps de la résolution/paiement est requis.", prop: 'tps_reponse'})
    }

    if(errors.length){super.onErrors(this, errors)}
    return errors.length == 0
  }

  get div(){
    var n = super.div

    return n
  }
}
FAEproc.dispatchData()
