'use strict'

class FAEproc extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return ['procType']}
static get OWN_TEXT_PROPS(){ return []}
static get TEXT_PROPERTIES(){return this._tprops||defP(this,'_tprops',FAEvent.tProps(this.OWN_TEXT_PROPS))}

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
}

get htype(){ return 'Procédé' }

get isValid(){
  var errors = []

  // Définir ici les validité
  this.procType || errors.push({msg: T('proc-type-required'), prop: 'procType'})
  this.content  || errors.push({msg: T('proc-description-required'), prop: 'content'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

get div(){
  var n = super.div
  return n
}
}
FAEproc.dispatchData()
