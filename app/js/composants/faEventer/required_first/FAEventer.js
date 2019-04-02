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
  newEventer.show()
}


// ---------------------------------------------------------------------
//  INSTANCE

constructor(analyse){
  this.analyse = this.a = analyse
  this.id = FAEventer.newId()

  this.built    = false
}

show(){this.fwindow.show()}
close(){this.fwindow.hide()}

/**
 * On peuple l'eventer en respectant le filtre choisi
 * TODO : à l'ouverture, il faudrait mettre le filtre de l'affichage
 * des scènes seulement.
 */
peuple(){
  var my  = this
    , o   = my.jqPanEvents
    , fe  = new EventsFilter(this, {filter: my.filter})
    ;
  o.html('')
  fe.forEachFilteredEvent(function(ev){
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
  Quand on clique sur le bouton « filtre » pour le définir
  (on bascule alors à l'arrière de la fenêtre)
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
  var div = DCreate('DIV', {id: this.domId})
  // var div = DCreate('DIV', {id: this.domId, class: 'eventer'})
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

  this.built = true

  return div // pour la FWindow
}
afterBuilding(){
  // Au tout début, on affiche seulement les scènes
  this.filter = {eventTypes: ['scene']}
  this.peuple()
  this.peupleTypesInFilter()
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
  var label = DCreate('LABEL', {attrs: {'for': domid}, inner: libelle})
  var cb = DCreate('INPUT', {id: domid, attrs:{type: 'checkbox', 'data-type': type}})
  cb.checked = true
  var span  = DCreate('SPAN', {class: 'cb-type', append: [cb, label]})
  ocontainer.append(span)
}

observe(){
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

get fwindow(){return this._fwindow || defP(this,'_fwindow', new FWindow(this, {class: 'eventer', container: $('#section-eventers')}))}
get jqObj(){return this._jqObj||defP(this,'_jqObj', $(`#${this.domId}`))}
get jqPanEvents(){return this._jqPanEvents||defP(this,'_jqPanEvents',this.jqObj.find('div.pan-events'))}
get btnClose(){return this.jqObj.find('.toolbox .btn-close')}
get btnFiltre(){return this.jqObj.find('.toolbox .btn-filtre')}
get domId(){return this._domId||defP(this,'_domId', `eventer-${this.id}`)}

}
