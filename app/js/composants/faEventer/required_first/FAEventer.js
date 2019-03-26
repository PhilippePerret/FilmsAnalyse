'use strict'
/**
 *  Classe FAEventer
 *  --------------
 *  Il permet d'afficher les events, filtrés ou non
 */

class FAEventer {
  // ---------------------------------------------------------------------
  //  CLASSE

  static newId(){
    if(undefined === this.last_id) this.last_id = 0
    return ++ this.last_id
  }

  // Méthode principale appelée pour créer un nouvel eventer
  static createNew(){
    var newEventer = new FAEventer(current_analyse)
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
      , o   = my.jqPanEvents
      ;
    o.html('')
    this.analyse.forEachEvent(function(ev){
      if(my.filter){
        if(my.filter.eventTypes.indexOf(ev.type) < 0) return
        if(my.filter.fromTime && ev.time < my.filter.fromTime) return
        if(my.filter.toTime !== null && ev.time > my.filter.toTime) return
      }
      o.append(ev.div)
      ev.show()
      ev.observe(o)
    })
  }

  /**
   * Appelée par le bouton pour appliquer le filtre choisi
   */
  applyFilter(){
    var fromTime = this.horlogeFiltreFromTime.time
    var toTime   = this.horlogeFiltreToTime.time
    if ( toTime <= this.horlogeFiltreFromTime.time ) toTime = null
    this.filter = {
        eventTypes: this.getChosenTypes()
      , fromTime:   fromTime
      , toTime:     toTime
    }
    // console.log("Filtre : ", this.filter)
    this.peuple()
  }

  /**
   * Quand on clique sur le bouton filtre pour le définir
   */
  onToggleFiltre(){
    var showList = !!this.filtreDisplayed
    if(showList) this.applyFilter()
    this.jqObj.find('.pan-events')[showList?'show':'hide']()
    this.jqObj.find('.pan-filter')[showList?'hide':'show']()
    this.btnFiltre.html(showList?'Filtre':'Liste')
    this.filtreDisplayed = !this.filtreDisplayed
  }

  /**
   * Méthode appelée quand on clique sur le bouton 'Tous' dans le filtre des
   * types. Pour tout déselectionner ou non.
   */
  onToggleFiltreAllTypes(e){
    var all = DGet(`${this.domId}-cb-type-ALL`).checked
    var ocontainer = this.jqObj.find('.pan-filter div.type-list')
    ocontainer.find('.cb-type > input').each(function(i, o){
      if(i==0)return
      if (all ) {
        o.disabled  = true
        o.checked   = all
      } else {
        o.disabled  = false
      }
    })
  }
  // Retourne la liste des types valides
  getChosenTypes(){
    var checkedList = []
    var ocontainer = this.jqObj.find('.pan-filter div.type-list')
    ocontainer.find('.cb-type > input').each(function(i, o){
      if(i==0) return // bouton "Tous"
      if (o.checked) checkedList.push(o.getAttribute('data-type'))
    })
    return checkedList
  }

  /**
   * Construction de l'eventeur
   */
  build(){
    var div = document.createElement('DIV')
    this.id = FAEventer.newId()
    div.id = this.domId
    div.className = 'eventer'
    div.innerHTML = `
    <div class="toolbox">
      <button type="button" class="btn-close"></button>
      <button type="button" class="small btn-filtre">Filtre</button>
    </div>
    <div class="pan-events"></div>
    <div class="pan-filter" style="display:none;">
      <h2>Filtre des events</h2>
      <div class="small">Pour obtenir moins d'event affichés, utiliser ce filtre puis cliquer sur le bouton « Liste » ci-dessus.</div>
      <fieldset>
        <legend>Types affichés</legend>
        <div class="type-list"></div>
      </fieldset>
      <fieldset>
        <legend>Temps</legend>
        Events entre <horloge id="${this.domId}-from-time" class="small horloge horlogeable">0:00:00.00</horloge> et
        <horloge id="${this.domId}-to-time" class="small horloge horlogeable">0:00:00.00</horloge>
      </fieldset>

    </div>
    `

    $('#section-eventers').append(div)
    this.peupleTypesInFilter()
    this.built = true
  }
  // Pour mettre les types avec des cases à cocher dans le panneau du filtre
  peupleTypesInFilter(){
    // Note : on récupère tout simplement les types d'event du dossier FAEvents
    var my = this
    var ocontainer = this.jqObj.find('.pan-filter div.type-list')

    // Le choix "tous"
    my.buildCbType(ocontainer, `${this.domId}-cb-type-ALL`, 'Tous')
    $(`#${this.domId}-cb-type-ALL`).on('click', this.onToggleFiltreAllTypes.bind(this))

    glob('./app/js/common/FAEvents/*.js', (err, list) => {
      for(var fpath of list){
        var classe = eval(path.basename(fpath,path.extname(fpath)))
        var domid = `${this.domId}-cb-type-${classe.type}`
        my.buildCbType(ocontainer, domid, classe.short_hname, classe.type)
      }
    })
  }
  buildCbType(ocontainer, domid, libelle, type){
    var span  = document.createElement('SPAN')
    span.className = 'cb-type'
    var label = document.createElement('LABEL')
    label.setAttribute('for', domid)
    label.innerHTML = libelle
    var cb = document.createElement('INPUT')
    cb.type = 'checkbox'
    cb.id   = domid
    cb.checked = true
    cb.setAttribute('data-type', type)
    span.appendChild(cb)
    span.appendChild(label)
    ocontainer.append(span)
  }
  observe(){
    this.jqObj.draggable()
    this.btnFiltre.on('click', this.onToggleFiltre.bind(this))
    this.btnClose.on('click', this.close.bind(this))
    var horloges = UI.setHorlogeable(DGet(this.domId))
    var dataHorloge = {
        // time: 0
        synchroVideo: true
      , parentModifiable: false
      , unmodifiable: true
    }
    this.horlogeFiltreFromTime = horloges[`${this.domId}-from-time`]
    this.horlogeFiltreToTime   = horloges[`${this.domId}-to-time`]
    this.horlogeFiltreFromTime.dispatch(dataHorloge)
    this.horlogeFiltreToTime.dispatch(dataHorloge)
  }

  get jqObj(){return this._jqObj||defP(this,'_jqObj', $(`#${this.domId}`))}
  get jqPanEvents(){return this._jqPanEvents||defP(this,'_jqPanEvents',this.jqObj.find('div.pan-events'))}
  get btnClose(){return this.jqObj.find('.toolbox .btn-close')}
  get btnFiltre(){return this.jqObj.find('.toolbox .btn-filtre')}
  get domId(){return this._domId||defP(this,'_domId', `eventer-${this.id}`)}
}
