'use strict'

class FAEpp extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return [['setup', 'inputtext-1'], ['payoff', 'inputtext-2'], ['tps_payoff', 'tps_reponse'], 'exploitation']}

// Pour dispatcher les données propre au type
// Note : la méthode est appelée en fin de fichier
static dispatchData(){
  for(var prop in this.dataType) this[prop] = this.dataType[prop]
}
static get dataType(){
  return {
      hname: 'Préparation/paiement'
    , short_hname: 'Prép/Pai.'
    , type: 'pp'
  }
}

/**
  Initialise les PPs, notamment en affichant celles qui n'ont pas
  de réponse dans le bloc (section) prévu pour
**/
static init(){
  this.forEachPP(pp => {
    if(pp.payoff && pp.payoff.length) return
    // Sinon, on doit l'écrire dans la section
    this.section.append(pp.as('short', LINKED))
  })
}
static reset(){
  delete this._pps
  delete this._sorted
  return this // chainage
}

static get section(){return $('section#section-qrd-pp')}

/**
  Répète la méthode +fn+ sur toutes les PP du film

  @param {Function} fn La méthode à utiliser, qui doit recevoir l'event
                        en premier argument.
**/
static forEachPP(fn){
  for(var pp of this.pps){
    if(false === fn(pp)) break // pour interrompre
  }
}
static forEachSortedPP(fn){
  for(var pp of this.sortedQrds){
    if(false === fn(pp)) break // pour interrompre
  }
}

static get pps(){return this._pps||defP(this,'_pps',this.defineLists().pps)}
static get sortedQrds(){return this._sorted||defP(this,'_sorted',this.defineLists().sorted)}

static defineLists(){
  var pps     = []
    , sorteds = []

  current_analyse.forEachEvent(function(ev){
    if(ev.type === 'pp') pps.push(ev)
  })
  sorteds = Object.assign([], pps)
  sorteds.sort((a, b) => {return a.time - b.time})

  return {pps: pps, sorted: sorteds}
}


// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
  this.type         = 'pp'
  this.setup        = data.setup
  this.payoff       = data.payoff
  this.tps_payoff   = data.tps_payoff
  this.exploitation = data.exploitation
}

get htype(){ return 'Préparation/paiement' }

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
FAEpp.dispatchData()
