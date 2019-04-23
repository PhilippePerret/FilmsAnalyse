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

/**
  Méthode principale appelée pour créer un nouvel eventer

  @return {FAEventer} L'instance créée
**/
static createNew(){
  log.info("-> FAEventers::createNew")
  var newEventer = new FAEventer(current_analyse)
  newEventer.show()
  log.info(`<- FAEventers::createNew() (ID #${newEventer.id})`)
  return newEventer
}


// ---------------------------------------------------------------------
//  INSTANCE

constructor(analyse){
  this.analyse = this.a = analyse
  this.id = FAEventer.newId()

  this.built    = false
}

show(){
  log.info(`-> <<FAEventer #${this.id}>>#show()`)
  this.fwindow.show()
  log.info(`<- <<FAEventer #${this.id}>>#show()`)
}
close(){this.fwindow.hide()}

/**
 * On peuple l'eventer en respectant le filtre choisi
 * TODO : à l'ouverture, il faudrait mettre le filtre de l'affichage
 * des scènes seulement.
 */
peuple(){
  log.info(`-> <<FAEventer #${this.id}>>#peuple()`)
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
  log.info(`<- <<FAEventer #${this.id}>>#peuple()`)
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
  let all = DGet(`${this.domId}-cb-type-ALL`).checked
    , invert = e.metaKey === true

  var ocontainer = this.jqObj.find('.pan-filter div.type-list')
  ocontainer.find('.cb-type > input').each(function(i, o){
    if(i == 0){
      if(invert){
        o.checked   = false
      }
      return // le bouton "tous"/"aucun"
    }
    if (all) {
      if(invert){
        // Le sens inversé, pour tout décocher
        o.disabled  = false
        o.checked   = false
      } else {
        // Le sens normal, pour tout cocher
        o.disabled  = true
        o.checked   = true
      }
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
  log.info(`-> <<FAEventer #${this.id}>>#build()`)
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
      Events entre <horloge id="${this.domId}-from-time" class="small horloge horlogeable" value="0">0:00:00.00</horloge> et
      <horloge id="${this.domId}-to-time" class="small horloge horlogeable" value="">...</horloge>
    </fieldset>
    <fieldset>
      <legend>Texte à rechercher :</legend>
      <input type="text" id="${this.domId}-search" style="width:98%;" />
    </fieldset>

  </div>
  `

  this.built = true

  log.info(`<- <<FAEventer #${this.id}>>#build()`)
  return div // pour la FWindow
}
afterBuilding(){
  // Au tout début, on affiche seulement les scènes
  log.info(`-> <<FAEventer #${this.id}>>#afterBuilding()`)
  this.filter = {eventTypes: ['scene']}
  this.peuple()
  this.peupleTypesInFilter()
  // On doit régler la fin du film
  let o = $(`#${this.domId}-to-time`)
  o.attr('value', this.a.duration)
  o.html(new OTime(this.a.duration).horloge)

  // On doit peupler avec les personnages du film (CB non cochées)
  // TODO
  //
  log.info(`<- <<FAEventer #${this.id}>>#afterBuilding()`)
}


// Pour mettre les types avec des cases à cocher dans le panneau du filtre
peupleTypesInFilter(){
  // Note : on récupère tout simplement les types d'event du dossier FAEvents
  log.info(`-> <<FAEventer #${this.id}>>#peupleTypesInFilter()`)
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
  log.info(`<- <<FAEventer #${this.id}>>#peupleTypesInFilter()`)
}

buildCbType(ocontainer, domid, libelle, type){
  var label = DCreate('LABEL', {attrs: {'for': domid}, inner: libelle})
  var cb = DCreate('INPUT', {id: domid, attrs:{type: 'checkbox', 'data-type': type}})
  cb.checked = true
  var span  = DCreate('SPAN', {class: 'cb-type', append: [cb, label]})
  ocontainer.append(span)
}

observe(){
  log.info(`-> <<FAEventer #${this.id}>>#observe()`)
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
  this.horlogeFiltreToTime.time = this.a.videoController.video.duration
  this.horlogeFiltreFromTime.dispatch(dataHorloge)
  this.horlogeFiltreToTime.dispatch(dataHorloge)

  // Juste pour changer le libellé de "Tous", dans le filtre, et mettre "Aucun"
  this.fwindow.jqObj.on('keydown', this.onKeyDown.bind(this))
  this.fwindow.jqObj.on('keyup', this.onKeyUp.bind(this))
  log.info(`<- <<FAEventer #${this.id}>>#observe()`)
}

onKeyDown(e){
  if(e.metaKey !== true) return true
  $(`label[for="${this.domId}-cb-type-ALL"]`).html('Aucun')
}
onKeyUp(e){
  if(e.metaKey !== true){
    $(`label[for="${this.domId}-cb-type-ALL"]`).html('Tous')
  }
}

get fwindow(){return this._fwindow || defP(this,'_fwindow', new FWindow(this, {class: 'eventer', container: $('#section-eventers')}))}
get jqObj(){return this._jqObj||defP(this,'_jqObj', $(`#${this.domId}`))}
get jqPanEvents(){return this._jqPanEvents||defP(this,'_jqPanEvents',this.jqObj.find('div.pan-events'))}
get jqPanFilter(){return this._jqPanFilter||defP(this,'_jqPanFilter',this.jqObj.find('div.pan-filter'))}
get btnClose(){return this.jqObj.find('.toolbox .btn-close')}
get btnFiltre(){return this.jqObj.find('.toolbox .btn-filtre')}
get domId(){return this._domId||defP(this,'_domId', `eventer-${this.id}`)}

}
