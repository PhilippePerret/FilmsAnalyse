'use strict'

class FAEproc extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

static get OWN_PROPS(){return ['procType', ['setup', 'longtext2'], ['exploit','longtext3'], ['payoff','longtext4']]}
static get OWN_TEXT_PROPS(){ return ['setup', 'exploit', 'payoff']}
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
  // Après la création de l'instance, on vérifie toujours pour savoir s'il
  // faut l'inscrire dans la "warning-section" des procédés sans résolution
  this.checkResolution()
}

get htype(){ return 'Procédé' }

get isValid(){
  var errors = []

  // Définir ici les validité
  this.procType || errors.push({msg: T('proc-type-required'), prop: 'procType'})
  this.content  || errors.push({msg: T('proc-description-required'), prop: 'longtext1'})
  this.setup    || errors.push({msg: T('proc-setup-required'), prop: 'longtext2'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}


/**
  Méthode qui vérifie que le procédé possède bien une résolution et,
  le cas échéant, l'inscrit dans la "warning-section"
**/
checkResolution(){
  if(undefined != this.payoff && this.payoff.length) return
  this.warningSection.append(DCreate('DIV', {inner: this.as('short', EDITABLE|LABELLED)}))
}

/**
  La section qui affiche les procédés qui ont besoin de résolution
  lorsqu'elle n'est pas définie.
**/
get warningSection(){return $('#section-qrd-pp')}

}
FAEproc.dispatchData()
