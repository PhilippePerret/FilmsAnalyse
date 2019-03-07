'use strict'

class FAEdialog extends FAEvent {
  constructor(data){
    super(data)
    this.type       = 'dialog'
    this.dialType   = data.dialType
}

  get resume(){return this.content}

  /**
   * On dispatch les valeurs depuis le formulaire
   */
  dispatch(d){
    this.dialType  = d.dialType
  }

  /**
   * Récupérer les données pour les enregistrer
   */
  static get OWN_PROPS(){return ['dialType']}
  get data(){
    var d = super.data
    for(var prop of FAEdialog.OWN_PROPS){
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
