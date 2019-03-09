'use strict'

class FAEdialog extends FAEvent {
  constructor(analyse, data){
    super(analyse, data)
    this.type       = 'dialog'
    this.dialType   = data.dialType
}

// Propriétés propres au dialogue
static get OWN_PROPS(){return ['dialType']}

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
