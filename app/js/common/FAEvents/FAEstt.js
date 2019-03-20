'use strict'


class FAEstt extends FAEvent {
  // ---------------------------------------------------------------------
  //  CLASSE

  // Pour dispatcher les données propre au type
  // Note : la méthode est appelée en fin de fichier
  static dispatchData(){
    for(var prop in this.dataType) this[prop] = this.dataType[prop]
  }
  static get dataType(){
    return {
        hname: 'Nœud structurel'
      , short_hname: 'Nœud Stt'
      , type: 'stt'
    }
  }
  // ---------------------------------------------------------------------
  //  INSTANCE
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

  get sttNode(){return this._sttNode || defP(this,'_sttNode',this.analyse.PFA.node(this.sttID))}

  // Mise en forme du contenu propre à ce type d'event
  formateContenu(){
    var str
    str = `<div>===== ${this.sttNode.hname} =====</div>`
    str += `<div class="small">${this.content}</div>`
    if(this.note) str += `<div class="small">${this.note}</div>`
    // TODO Mettre des liens pour voir dans la structure ? (ou ça doit être fait
    // de façon générale pour tout event)
    return this.fatexte.formate(str)
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
FAEstt.dispatchData()
