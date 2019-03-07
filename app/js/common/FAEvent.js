'use strict'


class FAEvent {

  constructor(data){
    // this.type     = data.type     // (String)
    this.time     = data.time     // (number)
    this.duration = data.duration // (number seconds)
    this.content  = data.content  // (String)
    this.note     = data.note     // (String)

    this.events   = data.events
  }

  get otime(){
    if(undefined === this._otime) this._otime = new OTime(this.time)
    return this._otime
  }

  /**
   * Définition de la durée
   */
  set duration(v){
    if('string' === typeof(v)){
      // <= la valeur est un string
      // => on vient du formulaire, il faut traiter
      v = v.trim();
      v = new OTime(v)
      v = v.seconds
    }
    this._duration = v
  }
  get duration(){return this._duration}

  /**
   * Méthode qui affiche l'évènement de manière différée, en tenant compte du
   * temps courant
   */
  showDiffere(){
    var my = this
    this.div //pour le construire
    var diff = ((my.time - VideoController.getRTime()) * 1000) - 300
    if (diff < 0){ // ne devrait jamais arriver
      this.show()
    } else {
      this.timerShow = setTimeout(my.show.bind(my), diff)
    }
  }
  /**
   * Pour afficher l'évènement dans le reader de l'analyse
   */
  show(){
    Reader.append(this.div)
  }

  get div(){
    if (undefined === this._div){
      var n = document.createElement('DIV')
      n.className = `event ${this.type}`
      var h = document.createElement('SPAN')
      h.className = 'horloge mini'
      h.innerHTML = this.otime.horloge
      var c = document.createElement('SPAN')
      c.className = 'content'
      c.innerHTML = current_analyse.formateTexte(this)
      n.append(h)
      n.append(c)
      this._div = n
    }
    return this._div
  }

  static get OWN_PROPS(){return ['id', 'type', 'time', 'duration', 'content', 'note', 'events']}
  /**
   * Les données qui seront enregistrées
   *
   * Pour les sous-classes, on utilise `var d = super()`
   */
  get data(){
    var d = {}
    for(var prop of FAEvent.OWN_PROPS){
      if(null === this[prop] || undefined === this[prop]) continue
      d[prop] = this[prop]
    }
    return d
  }
}

// Pour la compatibilité avec les autres types
class FAEevent extends FAEvent {
  constructor(data){
    super(data)
    this.type = 'event'
  }
  get div(){
    return super.div
  }
}
