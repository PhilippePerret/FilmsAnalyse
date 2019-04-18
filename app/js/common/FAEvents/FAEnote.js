'use strict'

class FAEnote extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Propriétés propres aux notes
static get OWN_PROPS(){return ['noteType']}

// Pour dispatcher les données propre au type
// Note : la méthode est appelée en fin de fichier
static dispatchData(){
  for(var prop in this.dataType) this[prop] = this.dataType[prop]
}
static get dataType(){
  return {
      hname: 'Note'
    , short_hname: 'Note'
    , type: 'note'
  }
}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
  this.type     = 'note'
}

get htype(){ return 'Note' }

get isValid(){
  var errors = []

  // Définir ici les validité
  this.content || errors.push({msg: "Le contenu de la note est requis.", prop: 'longtext1'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

}
FAEnote.dispatchData()
