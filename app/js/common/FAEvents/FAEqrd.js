'use strict'

class FAEqrd extends FAEvent {
  constructor(data){
    super(data)
    this.type         = 'qrd'
    this.question     = data.question
    this.reponse      = data.reponse
    this.tps_reponse  = data.tps_reponse
    this.exploitation = data.exploitation
  }

  static get OWN_PROPS(){return ['question', 'reponse', 'tps_reponse','exploitation']}

  get isValid(){
    var errors = []

    // Définir ici les validité
    this.question || errors.push({msg: "La Question Dramatique est requise.", prop: 'inputtext-1'})
    this.content  || errors.push({msg: "La description de cette QRD est requise.", prop: 'content'})
    if(this.reponse){
      this.tps_reponse || errors.push({msg: "Le temps de la réponse est requis.", prop: 'tps_reponse'})
    }

    if(errors.length){super.onErrors(this, errors)}
    return errors.length == 0
  }

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
