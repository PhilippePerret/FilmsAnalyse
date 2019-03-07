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

  get resume(){return this.content}


  /**
   * On dispatch les valeurs depuis le formulaire
   */
  dispatch(d){
    for(var prop of FAEscene.OWN_PROPS){
      if(undefined === d[prop]) continue
      this[prop] = d[prop]
    }
    // Valeurs particulières
    this.decor      = d['input-text-1'].trim()
    this.sous_decor = d['input-text-2'].trim()
  }

  get div(){
    var n = super.div
    // var div = super.mainDiv()
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
