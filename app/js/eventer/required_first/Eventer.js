'use strict'
/**
 *  Classe Eventer
 *  --------------
 *  Il permet d'afficher les events, filtrés ou non
 */

class Eventer {
  // ---------------------------------------------------------------------
  //  CLASSE

  static newId(){
    if(undefined === this.last_id) this.last_id = 0
    return ++ this.last_id
  }

  // Méthode principale appelée pour créer un nouvel eventer
  static createNew(){
    var newEventer = new Eventer(current_analyse)
    newEventer.open()
  }


  // ---------------------------------------------------------------------
  //  INSTANCE

  constructor(analyse){
    this.analyse  = analyse

    this.built    = false
  }

  open(){
    if(false == this.built){
      this.build()
      this.observe()
      this.peuple() // TODO Plus tard, on peuplera après avoir choisi le filtre
    } else {
      this.jqObj.show()
    }
  }
  close(){
    this.jqObj.hide()
  }

  /**
   * On peuple l'eventer. Pour le moment, on met tous les events.
   */
  peuple(){
    var my  = this
      , o   = my.jqEventList
      ;
    this.analyse.forEachEvent(function(ev){
      o.append(ev.div)
      ev.show()
      ev.observe()
    })
  }

  /**
   * Construction de l'eventeur
   */
  build(){
    var div = document.createElement('DIV')
    this.id = Eventer.newId()
    div.id = this.domId
    div.className = 'eventer'
    div.innerHTML = `
    <div class="toolbox">
      <button type="button" class="small btn-filtre">Filtre</button>
    </div>
    <div class="events"></div>
    `

    $('#section-eventers').append(div)
    console.log("jqObj:", this.jqObj)
    this.built = true
  }
  observe(){
    this.jqObj.draggable()
  }

  get jqObj(){return this._jqObj||defP(this,'_jqObj', $(`#${this.domId}`))}
  get jqEventList(){return this._jqEventList||defP(this,'_jqEventList',this.jqObj.find('div.events'))}
  get domId(){return this._domId||defP(this,'_domId', `eventer-${this.id}`)}
}
