'use strict'

class FAEdyna extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return ['dynaType', 'parent', ['libelle', 'inputtext-1']]}
static get OWN_TEXT_PROPS(){ return ['libelle']}
static get TEXT_PROPERTIES(){return this._tprops||defP(this,'_tprops',FAEvent.tProps(this.OWN_TEXT_PROPS))}
// Les types possibles de parent en fonction du type de l'event
static get TYPESPARENT_PER_TYPE(){
  return {
      'objectif': null
    , 'sous-objectif': ['objectif']
    , 'moyen': ['objectif', 'sous-objectif']
    , 'obstacle': ['objectif', 'sous-objectif', 'moyen']
    , 'conflit':  ['obstacle']
  }
}

// Pour dispatcher les données propre au type
// Note : la méthode est appelée en fin de fichier
static dispatchData(){
  for(var prop in this.dataType) this[prop] = this.dataType[prop]
}
static get dataType(){
  return {
      hname: 'Élément dynamique'
    , short_hname: 'Él.dyna.'
    , type: 'dyna'
  }
}

/**
  Initialise les éléments dynamiques
**/
static init(){
}
static reset(){
  return this // chainage
}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
  this.type         = 'dyna'
  this.libelle      = data.libelle
  this.parent       = data.parent
}

get htype(){ return 'Élément dynamique' }

get isValid(){
  var errors = []

  // Définir ici les validité
  this.dynaType || errors.push({msg: "Le type (objectif, obstacle, etc.) est requis", prop: 'dynaType'})
  this.libelle  || errors.push({msg: "Le libellé est requis", prop: 'inputtext-1'})
  let err_msg = this.parentIsValid()
  !err_msg || errors.push({msg: err_msg, prop: 'parent'})
  this.content  || errors.push({msg: "La description de cet élément dynamique est requis.", prop: 'content'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

parentIsValid(){
  // console.log("-> parentIsValid() / this.parent = ", this.parent)
  if(this.dynaType == 'objectif') return
  if(!this.parent){
    // Pas de parent défini
    // => erreur
    return T('parent-is-required', {ptypes: FAEdyna.TYPESPARENT_PER_TYPE[this.dynaType].join(', ')})
  } else {
      this.parent = parseInt(this.parent,10)
      let pevent = this.a.ids[this.parent]
        , ptype  = pevent.dynaType
      console.log("parent:", pevent)
      if (!ptype) T('good-parent-required', {bad: pevent.type, ptypes: FAEdyna.TYPESPARENT_PER_TYPE[this.dynaType].join(', ')})
      if (FAEdyna.TYPESPARENT_PER_TYPE[this.dynaType].indexOf(ptype) < 0){
      // Parent défini, mais de mauvais type
      return T('good-parent-required', {bad: ptype, ptypes: FAEdyna.TYPESPARENT_PER_TYPE[this.dynaType].join(', ')})
    }
  }
  // Sinon, on ne retourne rien
}

}
FAEdyna.dispatchData()
