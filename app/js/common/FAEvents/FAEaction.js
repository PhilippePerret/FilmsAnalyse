'use strict'

class FAEaction extends FAEvent {
  // ---------------------------------------------------------------------
  //  CLASSE

  // Pour dispatcher les données propre au type
  // Note : la méthode est appelée en fin de fichier
  static dispatchData(){
    for(var prop in this.dataType) this[prop] = this.dataType[prop]
  }
  static get dataType(){
    return {
        hname: 'Action'
      , short_hname: 'Action'
      , type: 'action'
    }
  }
  // ---------------------------------------------------------------------
  //  INSTANCE
  constructor(analyse, data){
    super(analyse, data)
    this.type         = 'action'
    this.actionType   = data.actionType
  }

get htype(){ return 'Action' }

// Propriétés propres
static get OWN_PROPS(){return ['actionType']}

get isValid(){
  var errors = []

  // Définir ici les validité
  this.content || errors.push({msg: "La description de l'action est indispensable.", prop: 'content'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

get div(){
  var n = super.div
  return n
}

}

FAEaction.dispatchData()
