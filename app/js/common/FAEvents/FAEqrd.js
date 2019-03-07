'use strict'

class FAEqrd extends FAEvent {
  constructor(data){
    super(data)
    this.type         = 'qrd'
    this.question     = data.question
    this.reponse      = data.reponse
    this.exploitation = data.exploitation
    this.q_scene      = data.q_scene
    this.r_scene      = data.r_scene
  }

  static get OWN_PROPS(){return ['question', 'reponse','q_scene','r_scene','exploitation']}

  /**
   * On dispatch les valeurs depuis le formulaire
   */
  dispatch(d){
    for(var prop of FAEqrd.OWN_PROPS){
      if(undefined === d[prop]) continue
      this[prop] = d[prop]
    }
    // Valeurs particulières
  }

  /**
   * Récupérer les données pour les enregistrer
   */
  get data(){
    var d = super.data
    for(var prop of FAEqrd.OWN_PROPS){
      if(undefined === this[prop]) continue
      d[prop] = this[prop]
    }
    return d
  }

  get div(){
    var n = super.div

    return n
  }
}
