'use strict'

class FAEqrd extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return [['question', 'inputtext-1'], ['reponse', 'inputtext-2'], 'tps_reponse','exploitation']}

// Pour dispatcher les données propre au type
// Note : la méthode est appelée en fin de fichier
static dispatchData(){
  for(var prop in this.dataType) this[prop] = this.dataType[prop]
}
static get dataType(){
  return {
      hname: 'Question/rép. dramatique'
    , short_hname: 'Q/R Drama'
    , type: 'qrd'
  }
}
// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
  this.type         = 'qrd'
  this.question     = data.question
  this.reponse      = data.reponse
  this.tps_reponse  = data.tps_reponse
  this.exploitation = data.exploitation
}

get htype(){ return 'Question/réponse dramatique' }

get isValid(){
  var errors = []

  // Définir ici les validité
  this.question || errors.push({msg: "La Question Dramatique est requise.", prop: 'inputtext-1'})
  this.content  || errors.push({msg: "La description de cette QRD est requise.", prop: 'content'})
  if(this.reponse){
    this.tps_reponse || errors.push({msg: "Le temps de la réponse est requis.", prop: 'tps_reponse'})
  }

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

get div(){
  var n = super.div

  return n
}
}
FAEqrd.dispatchData()
