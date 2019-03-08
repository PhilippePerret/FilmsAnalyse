'use strict'

class FAEscene extends FAEvent {
  constructor(data){
    super(data)
    this.type       = 'scene'
    this.numero     = data.numero
    this.decor      = data.decor
    this.sous_decor = data.sous_decor
    this.effet      = data.effet
    this.lieu       = data.lieu
    this.sceneType  = data.sceneType
  }

  // Les propriétés propres aux instances (constante de classe)
  static get OWN_PROPS(){return ['numero', ['decor', 'inputtext-1'], ['sous_decor', 'inputtext-2'],'lieu','effet','sceneType']}

  get pitch(){return this.titre}
  get resume(){return this.content}

  /**
   * Méthode qui retourne true si l'évènement est valide (en fonction de son
   * type) et false dans le cas contraire.
   */
  get isValid(){
    var errors = []

    this.numero  || errors.push({msg:"Le numéro de la scène devrait être défini.", prop: 'numero'})
    this.titre   || errors.push({msg:"Le pitch doit être défini.", prop:'titre'})
    this.content || errors.push({msg:"Le résumé de la scène est indispensable.", prop:'content'})

    if(errors.length){super.onErrors(this, errors)}
    return errors.length == 0
  }

  /**
   * Div construit pour la scène
   */
  get formated(){
    if(undefined === this._formated){
      var h
      if(this.isGenerique){ h = "GÉNÉRIQUE" }
      else {
        var decor  = this.decor ? ` — ${this.analyse.deDim(this.decor)}` : ''
        var sdecor = this.sous_decor ? ` : ${this.analyse.deDim(this.sous_decor)}` : ''
        h = `${this.numero}. ${(this.lieu || 'INT').toUpperCase()}. ${(this.effet || 'jour').toUpperCase()}${decor}${sdecor}`
      }
      this._formated = `<div class="scene-heading">${h}</div><span class="scene-resume">${this.analyse.deDim(this.content)}</span>`
    }
    return this._formated
  }

  get isGenerique(){return this.sceneType === 'generic'}
}
