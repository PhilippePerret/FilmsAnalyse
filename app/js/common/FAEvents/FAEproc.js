'use strict'

class FAEproc extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return ['procType', ['setup', 'inputtext-1'], ['payoff','inputtext-2'], ['tps_payoff', 'tps_reponse'], ['exploitation', 'content2']]}

// Pour dispatcher les données propre au type
// Note : la méthode est appelée en fin de fichier
static dispatchData(){
  for(var prop in this.dataType) this[prop] = this.dataType[prop]
}
static get dataType(){
  return {
      hname:        'Procédé'
    , short_hname:  'Procédé'
    , type:         'proc'
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

get htype(){ return 'Procédé' }

get isValid(){
  var errors = []

  // Définir ici les validité
  this.procType || errors.push({msg: T('proc-type-required'), prop: 'procType'})
  this.setup    || errors.push({msg: T('proc-install-required'), prop: 'inputtext-1'})
  this.content  || errors.push({msg: T('proc-description-required'), prop: 'content'})
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
