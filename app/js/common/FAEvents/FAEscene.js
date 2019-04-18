'use strict'

class FAEscene extends FAEvent {
// ---------------------------------------------------------------------
//  CLASSE

// Les propriétés propres aux instances (constante de classe)
static get OWN_PROPS(){return ['numero', ['decor', 'inputtext1'], ['sous_decor', 'inputtext2'],'lieu','effet','sceneType']}
static get OWN_TEXT_PROPS(){ return ['decor', 'sous_decor']}
static get TEXT_PROPERTIES(){return this._tprops||defP(this,'_tprops',FAEvent.tProps(this.OWN_TEXT_PROPS))}

/**
 * Initialisation de la classe. Par exemple lorsque l'on change
 * d'analyse sans recharger l'application
 */
static init(analyse){
  if(undefined === analyse) analyse = current_analyse
  this.analyse = this._a = analyse
  this.reset()
}

/**
  Méthode appelée systématiquement après la création ou la modification
  d'une scène, pour actualiser les numéros et les durées de toutes les
  scènes.
**/
static updateAll(){
  // console.log("-> FAEscene::updateAll")
  var my = this
  my.reset()
  my.updateNumerosScenes()
  my.updateDureeScenes()
  this.a.modified = true
}

/**
  Actualisation du numéro de scène de toutes les scènes
**/
static updateNumerosScenes(){
  var num = 0, oldNum
  this.forEachSortedScene(function(scene){
    oldNum = parseInt(scene.numero,10)
    scene.numero = ++ num
    scene.updateNumero()
    if (oldNum != num) scene.modified = true
  })
}

/**
  Actualisation de la durée des scènes (si l'option
  le demande)
**/
static updateDureeScenes(){
  if(!this.a.options.get('option_duree_scene_auto')) return
  let my = this
  var prev_scene
  my.forEachSortedScene(function(scene){
    if(scene.numero > 1){
      prev_scene = my.getByNumero(scene.numero - 1)
      prev_scene.duration = scene.time - prev_scene.time // arrondi plus tard
    }
  })
}

static reset(){
  this._by_time       = undefined
  this._by_id         = undefined
  this._by_numero     = undefined
  this._sortedByTime  = undefined
  this._sortedByDuree = undefined
  this._count         = undefined
  this._current       = undefined
  this._scenes        = undefined
}

/**
  Conserve la scène courante, c'est-à-dire la scène
  affichée à l'écran si elle existe.
  @returns {FAEscene} La scène courante dans le film visionné
**/
static get current(){return this._current||defP(this,'_current',this.getCurrent())}
static set current(s){
  // console.log("Scène courante mise à ", s)
  // try {
  //   pourvoirdou
  // } catch (e) {
  //   console.error('Pour voir qui appelle')
  //   console.error(e)
  // }
  this._current = s
  this.a._currentScene = s
  this.a.videoController.markCurrentScene.html(s ? s.asPitch() : '...')
}
static getCurrent(){
  if(this.count === 0) return
  return this.at(this.a.locator.getRTime())
}

/**
  @returns {Number} Le nombre de scènes du film
**/
static get count(){return this._count||defP(this,'_count', Object.keys(this.scenes).length)}

// ---------------------------------------------------------------------
//  Les méthodes de récupération d'une scène

/**
  Retourne l'instance de scène de numéro +numero+ (l'instancie if needed)
  @param    {Number}  numero Le numéro de la scène à retourner
  @returns  {FAEscene} La scène de numéro +numero+
 */
static get(numero)      {return this.scenes[numero]}

/**
  Retoune la scène ayant l'ID +event_id+ (en ne perdant pas de vue que
  la scène est un event elle-même, à partir de la version 0.5 de l'application)

  @param    {Number}  event_id    ID de l'event de la scène
            Rappel : une scène, c'est aussi un event de class {FAEscene}
  @returns  {FAEscene} La scène d'event_id +event_id+
**/
static getById(event_id){return this.byId[event_id]}

/**
  Retourne la scène se trouvant exactement au temps +time+

  @param    {Float}   time    Le temps donné
  @returns  {FAEscene} La scène au temps +time+
**/
static getByTime(time)  {return this.byTime[time]}

static getByNumero(num){
  return this.byNumero[num]
}

// ---------------------------------------------------------------------
//  Les listes de scènes

/**
  Retourne la table des scènes
  C'est un Hash avec en clé le numéro de la scène et en
  valeur l'instance FAEscene.
**/
static get scenes(){return this.byNumero}
// La méme, mais avec en clé l'ID de l'event de scène
static get byNumero(){return this._by_numero||defP(this,'_by_numero',this.doLists().numero)}
static get byId(){return this._by_id||defP(this,'_by_id',this.doLists().id)}
static get byTime(){return this._by_time||defP(this,'_by_time',this.doLists().time)}
static get sortedByTime(){return this._sortedByTime||defP(this,'_sortedByTime',this.doLists().sorted)}
static get sortedByDuree(){return this._sortedByDuree||defP(this,'_sortedByDuree', this.doLists().sorted_duree)}

static get dataDecors(){return FADecor.data}
static get decorsCount(){return FADecor.count}
/**
  Private méthode qui établit toutes les listes à savoir :
    FAEscene.byId      Hash avec en clé l'id de l'event
    FAEscene.byNumero  Hash avec en clé le numéro de la scène
    FAEscene.byTime    Hash avec en clé le temps de la scène
**/
static doLists(){
  let fe = new EventsFilter(this, {filter: {eventTypes:['scene']}})
    , _by_id          = {}
    , _by_numero      = {}
    , _by_time        = {}
    , _sortedByTime   = []
    , _sortedByDuree  = []

  fe.forEachFiltered(function(ev){
    if(ev.isGenerique) return
    _by_id[ev.id] = ev
    _by_numero[ev.numero] = ev
    _by_time[ev.time] = ev
  })

  _sortedByTime = Object.assign([], Object.values(_by_id))
  _sortedByTime.sort(function(a, b){return a.time - b.time})
  // console.log("_sortedByTime", _sortedByTime)

  _sortedByDuree = Object.assign([], Object.values(_by_id))
  _sortedByDuree.sort(function(a, b){return b.duree - a.duree})

  this._by_id         = _by_id
  this._by_numero     = _by_numero
  this._by_time       = _by_time
  this._sortedByTime  = _sortedByTime
  this._sortedByDuree = _sortedByDuree

  _by_id = _by_numero = _by_time = _sortedByTime = null
  return {id: this._by_id, numero: this._by_numero, time: this._by_time, sorted: this._sortedByTime, sorted_duree: this._sortedByDuree}
}

/**
  Détruit la scène de numéro +numero+
**/
static destroy(numero){
  if(undefined === this.scenes[numero]) return
  delete this.scenes[numero]
  this.updateAll()
}

/**
  Boucle sur toutes les scènes
  On peut l'interrompre en faisant renvoyer false (et strictement
  false) à la fonction +fn+
**/
static forEachScene(fn){
  for(var num in this.scenes){
    if(false === fn(this.scenes[num])) break // pour pouvoir interrompre
  }
}

/**
  Boucle sur chaque scène triée par temps
**/
static forEachSortedScene(fn){
  for(var scene of this.sortedByTime){
    // console.log("Boucle avec scène:", scene)
    if(false === fn(scene)) break // pour pouvoir interrompre
  }
}

/**
 * Retourne l'instance FAEscene de la scène au temps +time+
 *
 * +time+ est le temps par rapport au début défini du film, PAS le début
 * de la vidéo
 * @param   time  Le temps à considérer
 * @returns {FAEscene|Undefined}  undefined si c'est un temps avant le début
                                  du film
 */
static at(time){
  return (this.atAndNext(time)||{}).current
}
/**
  Retourne la scène se trouvant au temps +time+ et la scène suivante

  Note : la scène suivante sert par exemple à connaitre le temps du
  prochain changement de scène.

  @param   {Float}  time  Le temps considéré
  @returns {Object} {current: scène courante, next: scène suivante, next_time: temps suivant}
                    Noter que `next_time` est toujours défini, même lorsqu'au-
                    cune scène n'a été trouvée après. C'est alors le temps de
                    fin de la vidéo. Cela permet de ne pas rechercher la scène
                    jusqu'à la fin.
**/
static atAndNext(time){
  time = time.round(2)
  // console.log("[atAndNext] time:", time)
  if (current_analyse.filmStartTime && time < current_analyse.filmStartTime){
    // console.log(`[atAndNext] le temps courant (${time}) est inférieur au début du film (${current_analyse.filmStartTime}) => je retourne indéfini`)
    return
  } else if (this.firstScene && time < this.firstScene.time){
    return {current: null, next: this.firstScene, next_time: this.firstScene.time}
  }

  var founded
    , next_scene
    , last_scene

  this.forEachSortedScene(function(scene){
    if(scene.time > time) {
      founded     = last_scene
      next_scene  = scene
      return false // pour interrompre
    }
    last_scene = scene
  })
  return {current: founded || this.lastScene, next: next_scene, next_time: (next_scene ? next_scene.time : this.a.duration)}
}

/**
  @returns {FAEscene} La dernière scène (ou undefined si inexistante)
**/

static get firstScene(){
  return this.sortedByTime[0]
}
static get lastScene(){
  return this.sortedByTime[this.count-1]
}

static get a(){return this._a || current_analyse}


// Pour dispatcher les données propre au type
// Note : la méthode est appelée en fin de fichier
static dispatchData(){
  for(var prop in this.dataType) this[prop] = this.dataType[prop]
}
static get dataType(){
  return {
      hname: 'Scène'
    , short_hname: 'Scène'
    , type: 'scene'
  }
}

// ---------------------------------------------------------------------
//  INSTANCE

constructor(analyse, data){
  super(analyse, data)
  this.type       = 'scene'
  this.numero     = data.numero
  this.decor      = data.decor
  this.sous_decor = data.sous_decor
  this.effet      = data.effet
  this.lieu       = data.lieu
  this.sceneType  = data.sceneType
}

// ---------------------------------------------------------------------
//  HELPERS

get htype(){ return 'Scène' }

get hduree(){return this._hduree||defP(this,'_hduree', new OTime(this.duree).hduree)}


// ---------------------------------------------------------------------
//  MÉTHODES DE DONNÉES

get pitch(){return this.titre}
get resume(){return this.content}
get description(){
  console.error("DEPRECATED Il ne faut pas utiliser 'description', pour une scène, mais 'resume'")
  return this.content} // TODO Remplacer par resume
get duree(){return this.duration}

// ---------------------------------------------------------------------
//  MÉTHODES D'ÉTAT
/**
 * Méthode qui retourne true si l'évènement est valide (en fonction de son
 * type) et false dans le cas contraire.
 */
get isValid(){
  var errors = []

  this.numero  || errors.push({msg:"Le numéro de la scène devrait être défini.", prop: 'numero'})
  this.titre   || errors.push({msg:"Le pitch doit être défini.", prop:'titre'})
  this.content || errors.push({msg:"Le résumé de la scène est indispensable.", prop:'content'})

  if(errors.length){super.onErrors(this, errors)}
  return errors.length == 0
}

// ---------------------------------------------------------------------
//  MÉTHODES FONCTIONNELLES

reset(){
  super.reset()
  delete this._pitch
  delete this._numero
  delete this._hduree
  delete this._formated
  delete this._numeroFormated
}

// Méthode appelée après la création de la nouvelle scène
onCreate(){
  this.checkForDecor()
}
// Méthode appelée après la modification de la scène
onModify(){
  this.checkForDecor()
}

// Pour vérifier si c'est un nouveau décor
checkForDecor(){
  if(this.decor){
    if(undefined === FADecor.data[this.decor]){
      FADecor.resetAll()
    } else if (this.sous_decor && undefined === FADecor.data[this.decor].sousDecor(this.sous_decor)){
      FADecor.data[this.decor].reset()
      FADecor.resetAll()
    }
  }
}

/**
 * Actualisation du numéro de scène
 *
 * Noter que ça le change partout dans l'interface, si le numéro de scène
 * est bien formaté
 */
updateNumero(){
  $(`.numero-scene[data-id="${this.id}"]`).html(this.numero)
}

get isRealScene(){return this.sceneType !== 'generic'}
get isGenerique(){return this.sceneType === 'generic'}

} // Fin de FAEscene

FAEscene.dispatchData()
