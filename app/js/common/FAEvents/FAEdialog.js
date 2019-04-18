'use strict'

class FAEdialog extends FAEvent {
  // ---------------------------------------------------------------------
  //  CLASSE

  // Propriétés propres au dialogue
  static get OWN_PROPS(){return ['dialType', ['quote', 'longtext2']]}

  // Pour dispatcher les données propre au type
  // Note : la méthode est appelée en fin de fichier
  static dispatchData(){
    for(var prop in this.dataType) this[prop] = this.dataType[prop]
  }
  static get dataType(){
    return {
        hname: 'Dialogue'
      , short_hname: 'Dialog'
      , type: 'dialog'
    }
  }
// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
  this.type       = 'dialog'
}

get htype(){ return 'Dialogue' }


get isValid(){
  var errors = []

  // Définir ici les validité
  this.content || errors.push({msg: "La description du dialogue est indispensable.", prop: 'content'})
  this.dialType || errors.push({msg: "Le type de dialogue est à définir.", prop: 'dialType'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}


  get div(){
    var n = super.div

    return n
  }

}
FAEdialog.dispatchData()
