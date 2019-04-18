'use strict'

class FAEqrd extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return [['question', 'shorttext1'], ['reponse', 'shorttext2'], 'tps_reponse',['exploit', 'longtext3']]}
static get OWN_TEXT_PROPS(){ return ['question', 'reponse', 'exploitation']}
static get TEXT_PROPERTIES(){return this._tprops||defP(this,'_tprops',FAEvent.tProps(this.OWN_TEXT_PROPS))}

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

/**
  Initialise les QRDs, notamment en affichant celles qui n'ont pas
  de réponse dans le bloc (section) prévu pour
**/
static init(){
  this.forEachQRD(qrd => {
    if(qrd.reponse && qrd.reponse.length) return
    // Sinon, on doit l'écrire dans la section
    this.section.append(qrd.as('short', EDITABLE))
  })
}
static reset(){
  this.section.html('')
  delete this._qrds
  delete this._sorted
  return this // chainage
}

static get section(){return $('section#section-qrd-pp')}

/**
  Répète la méthode +fn+ sur toutes les QRD du film

  @param {Function} fn La méthode à utiliser, qui doit recevoir l'event
                        en premier argument.
**/
static forEachQRD(fn){
  for(var qrd of this.qrds){
    if(false === fn(qrd)) break // pour interrompre
  }
}
static forEachSortedQRD(fn){
  for(var qrd of this.sortedQrds){
    if(false === fn(qrd)) break // pour interrompre
  }
}

static get qrds(){return this._qrds||defP(this,'_qrds',this.defineLists().qrds)}
static get sortedQrds(){return this._sorted||defP(this,'_sorted',this.defineLists().sorted)}

static defineLists(){
  var qrds    = []
    , sorteds = []

  current_analyse.forEachEvent(function(ev){
    if(ev.type === 'qrd') qrds.push(ev)
  })
  sorteds = Object.assign([], qrds)
  sorteds.sort((a, b) => {return a.time - b.time})

  return {qrds: qrds, sorted: sorteds}
}

// ---------------------------------------------------------------------
//  INSTANCE
constructor(analyse, data){
  super(analyse, data)
  this.type         = 'qrd'
}

get htype(){ return 'Question/réponse dramatique' }

get isValid(){
  var errors = []

  // Définir ici les validité
  this.question || errors.push({msg: "La Question Dramatique est requise.", prop: 'inputtext1'})
  this.content  || errors.push({msg: "La description de cette QRD est requise.", prop: 'longtext1'})
  if(this.reponse){
    this.tps_reponse || errors.push({msg: "Le temps de la réponse est requis.", prop: 'tps_reponse'})
  }

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

/**
  @return {Boolean} true si les informations minimales sont fournies pour
  construire la QRD, à savoir :
    - la question
    - la réponse
    - le temps de la réponse
**/
isComplete(){
  return !!(this.question && this.question.length > 0
      && this.reponse  && this.reponse.length > 0
      && this.tps_reponse)
}

/**
  @return {Number} Le numéro de la scène à laquelle appartient
                   la QUESTION dramatique
**/
get sceneQ(){
  if(undefined === this._sceneQ) this._sceneQ = FAEscene.at(this.time)
  return this._sceneQ
}
get sceneR(){
  if(!this.tps_reponse) return
  if(undefined === this._sceneR) this._sceneR = FAEscene.at(new OTime(this.tps_reponse).seconds)
  return this._sceneR
}

get div(){
  var n = super.div

  return n
}
}
FAEqrd.dispatchData()
