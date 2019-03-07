'use strict'


class FAEvent {

  constructor(data){
    this.type     = data.type     // (String)
    this.time     = data.time     // (number => OTime)
    this.content  = data.content  // (String)
    this.note     = data.note     // (String)

    this.scenes     = []
    this.characters = []
    this.notes      = []
  }

  get otime(){
    if(undefined === this._otime) this._otime = new OTime(this.time)
    return this._otime
  }

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
}
