'use strict'

class FAEdyna extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return ['dynaType', ['libelle', 'inputtext-1']]}
static get OWN_TEXT_PROPS(){ return ['libelle']}
static get TEXT_PROPERTIES(){return this._tprops||defP(this,'_tprops',FAEvent.tProps(this.OWN_TEXT_PROPS))}

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
  this.forEachQRD(dyna => {
    if(dyna.reponse && dyna.reponse.length) return
    // Sinon, on doit l'écrire dans la section
    this.section.append(dyna.as('short', EDITABLE))
  })
}
static reset(){
  this.section.html('')
  delete this._dynas
  delete this._sorted
  return this // chainage
}

static get section(){return $('section#section-dyna-pp')}

/**
  Répète la méthode +fn+ sur toutes les QRD du film

  @param {Function} fn La méthode à utiliser, qui doit recevoir l'event
                        en premier argument.
**/
static forEachQRD(fn){
  for(var dyna of this.dynas){
    if(false === fn(dyna)) break // pour interrompre
  }
}
static forEachSortedQRD(fn){
  for(var dyna of this.sortedQrds){
    if(false === fn(dyna)) break // pour interrompre
  }
}

static get dynas(){return this._dynas||defP(this,'_dynas',this.defineLists().dynas)}
static get sortedQrds(){return this._sorted||defP(this,'_sorted',this.defineLists().sorted)}

static defineLists(){
  var dynas    = []
    , sorteds = []

  current_analyse.forEachEvent(function(ev){
    if(ev.type === 'dyna') dynas.push(ev)
  })
  sorteds = Object.assign([], dynas)
  sorteds.sort((a, b) => {return a.time - b.time})

  return {dynas: dynas, sorted: sorteds}
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
  this.parent || this.dynaType == 'objectif' || errors.push({msg: "Seul un objectif n'a pas besoin de parent.", prop: 'parent'})
  this.content  || errors.push({msg: "La description de cet élément dynamique est requis.", prop: 'content'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

}
FAEdyna.dispatchData()
