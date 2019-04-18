'use strict'

class FAEinfo extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Propriétés propres aux informations
static get OWN_PROPS(){return ['infoType']}

// Pour dispatcher les données propre au type
// Note : la méthode est appelée en fin de fichier
static dispatchData(){
  for(var prop in this.dataType) this[prop] = this.dataType[prop]
}
static get dataType(){
  return {
      hname: 'Info'
    , short_hname: 'Info'
    , type: 'info'
  }
}
// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
  this.type     = 'info'
}

get htype(){ return 'Information' }


  get isValid(){
    var errors = []

    // Définir ici les validité
    this.content || errors.push({msg: "Le contenu de l'information est requis.", prop: 'longtext1'})

    if(errors.length){super.onErrors(this, errors)}
    return errors.length == 0
  }

}
FAEinfo.dispatchData()
