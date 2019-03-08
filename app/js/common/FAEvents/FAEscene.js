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
  static get OWN_PROPS(){return ['decor', 'sous_decor','lieu','effet','sceneType']}

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
   * On dispatch les valeurs depuis le formulaire
   */
  dispatch(d){
    for(var prop of FAEscene.OWN_PROPS){
      if(undefined === d[prop]) continue
      this[prop] = d[prop]
    }
    // Valeurs particulières
    this.decor      = d['inputtext-1'] && d['inputtext-1'].trim()
    this.sous_decor = d['inputtext-2'] && d['inputtext-2'].trim()
  }

  get div(){
    var n = super.div
    return n
  }

  /**
   * Récupérer les données pour les enregistrer
   */
  get data(){
    var d = super.data
    for(var prop of FAEscene.OWN_PROPS){
      if(undefined === this[prop]) continue
      d[prop] = this[prop]
    }
    return d
  }
}
