'use strict'


class FAEstt extends FAEvent {
  constructor(analyse, data){
    super(analyse, data)
    this.type   = 'stt'
    // Mettre ici les données propres
    this.sttID  = data.sttID // p.e. 'incDec' ou 'DEV1', une clé dans PFA.DATA_STT_NODES
  }

  // Propriétés propres
  static get OWN_PROPS(){return ['sttID']}

  get isValid(){
    var errors = []
    // console.log("-> isValid")
    // On ne peut pas créer une propriété qui existe déjà
    var nstt = this.analyse.PFA.node(this.sttID)
    if (nstt.event_id && nstt.event_id != this.id){
      errors.push({msg: `Il existe déjà un nœud structurel « ${nstt.hname} » défini à ${nstt.event.horloge} (${nstt.event.link})`})
    } else {
      // Définir ici les validité
      this.sttID   || errors.push({msg: "L'ID structurel est indispensable et doit être choisi avec soin.", prop: 'sttID'})
      this.content || errors.push({msg: "La description du nœud structurel est indispensable.", prop: 'content'})
    }

    // console.log("<- isValid")
    if(errors.length){super.onErrors(this, errors)}
    return errors.length == 0
  }

  get sttNode(){return this._sttNode || defineP(this,'_sttNode',this.analyse.PFA.node(this.sttID))}

  // Pour mettre en forme le contenu
  get formated(){
    if(undefined === this._formated){
      var str
      str = `<div>===== ${this.sttNode.hname} =====</div>`
      str += `<div class="small">${this.content}</div>`
      if(this.note) str += `<div class="small">${this.note}</div>`
      // TODO Mettre des liens pour voir dans la structure ? (ou ça doit être fait
      // de façon générale pour tout event)
      str = this.analyse.deDim(str)
      this._formated = str
    }
    return this._formated
  }

  /**
   * Méthode appelée à la création de l'event
   * Il faut le lier à son nœud structurel
   */
  onCreate(){
    // On associe l'evenement à son noeud structurel
    this.sttNode.event = this
  }
}
