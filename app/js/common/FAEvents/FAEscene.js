'use strict'

class FAEscene extends FAEvent {
  constructor(data){
    super(data)
    this.type       = 'scene'
    this.decor      = data.decor
    this.sous_decor = data.sous_decor
    this.effet      = data.effet
    this.lieu       = data.lieu
    this.sceneType  = data.sceneType
  }

  // Les propriétés propres aux instances (constante de classe)
  static get OWN_PROPS(){return [['decor', 'inputtext-1'], ['sous_decor', 'inputtext-2'],'lieu','effet','sceneType']}

  get pitch(){return this.titre}
  get resume(){return this.content}

  /**
   * Méthode qui retourne true si l'évènement est valide (en fonction de son
   * type) et false dans le cas contraire.
   */
  get isValid(){
    var errors = []

    this.titre   || errors.push({msg:"Le pitch doit être défini.", prop:'titre'})
    this.content || errors.push({msg:"Le résumé de la scène est indispensable.", prop:'content'})

    if(errors.length){super.onErrors(this, errors)}
    return errors.length == 0
  }

  /**
   * Div construit pour la scène
   */
  get div(){
    var n = super.div
    return n
  }

}
