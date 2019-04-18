'use strict'

class FAEidee extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return ['ideeType', ['setup', 'longtext2'], ['exploit','longtext3'], ['payoff','longtext4']]}
static get OWN_TEXT_PROPS(){ return ['setup', 'exploit', 'payoff']}
static get TEXT_PROPERTIES(){return this._tprops||defP(this,'_tprops',FAEvent.tProps(this.OWN_TEXT_PROPS))}

// Pour dispatcher les données propre au type
// Note : la méthode est appelée en fin de fichier
static dispatchData(){
  for(var prop in this.dataType) this[prop] = this.dataType[prop]
}
static get dataType(){
  return {
      hname:        'Idée'
    , short_hname:  'Idée'
    , type:         'idee'
  }
}
// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
  this.type         = 'idee'
}

get htype(){ return 'Idée' }

get isValid(){
  var errors = []

  // Définir ici les validité
  this.ideeType || errors.push({msg: T('idee-type-required'), prop: 'ideeType'})
  this.content  || errors.push({msg: T('idee-description-required'), prop: 'longtext1'})
  this.setup    || errors.push({msg: T('idee-setup-required'), prop: 'longtext2'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

get div(){
  var n = super.div
  return n
}
}
FAEidee.dispatchData()
