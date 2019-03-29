'use strict'
/**
 * Class Scene
 * -----------
 * Gestion des scènes du film
 *
 */
class Scene {

// ---------------------------------------------------------------------
//  CLASSE

/**
 * Initialisation de la classe. Par exemple lorsque l'on change
 * d'analyse sans recharger l'application
 */
static init(){
  this.scenes = {}
  this._scene_number_to_id  = undefined
  this._scenes_by_time      = undefined
}

/**
  Conserve la scène courante, c'est-à-dire la scène
  affichée à l'écran si elle existe.
**/
static get current(){ return this._current }
static set current(s){ this._current = s}

/**
 * Retourne l'instance de scène de numéro +numero+ (l'instancie if needed)
 */
static get(numero){
  if (undefined === this.scenes) this.scenes = {}
  if (undefined === this.scenes[numero]){
    this.scenes[numero] = new Scene({
        numero: numero
      , event_id: this.SceneNumberToID[numero]
    })
  }
  return this.scenes[numero]
}

static destroy(numero){
  if(!this.scenes) return
  this.scenes[numero] = undefined
  delete this.scenes[numero]
  // Pour forcer le recalcul
  this._scene_number_to_id = undefined
  this._scenes_by_time = undefined
}

static forEachScene(fn){
  var nb_scenes = this.ScenesByTimes.length
  for(var i = 0; i < nb_scenes; ++i){
    fn(this.get(this.ScenesByTimes[i].numero))
  }
}

/**
 * Retourne l'instance Scene de la scène au temps +time+
 *
 * +time+ est le temps par rapport au début défini du film, PAS le début
 * de la vidéo
 */
static sceneAt(time){
  time = Math.round(time)
  if (time < current_analyse.filmStartTime) return
  var len = this.ScenesByTimes.length
  var i = 0
  for(;i<len;++i){
    if (this.ScenesByTimes[i].time > time ) {
      if(undefined === this.ScenesByTimes[i-1]) return null // première
      return this.get(this.ScenesByTimes[i-1].numero)
    }
  }
  // Sinon, c'est la dernière
  if(undefined === this.ScenesByTimes[i-1]) return null
  return this.get(this.ScenesByTimes[i-1].numero)
}
/**
 * Liste qui contient en clé le numéro de la scène et en valeur son
 * temps de départ
 */
static get SceneNumberToID(){
  if(undefined === this._scene_number_to_id){
    var my = this
    my._scene_number_to_id = {}
    my._scenes_by_time = []
    current_analyse.forEachEvent(function(ev){
      if(ev.type === 'scene' && ev.sceneType !== 'generic'){
        my._scene_number_to_id[ev.numero] = ev.id
        my._scenes_by_time.push({numero: ev.numero, time: ev.time, id: ev.id})
      }
    })
    my = null
  }
  // console.log("this._scene_number_to_id:", this._scene_number_to_id)
  return this._scene_number_to_id
}
/**
 * Retourne un Array contenant des objects contenant
 * {:time, :numero, :id} (numéro de la scène et id de l'event)
 */
static get ScenesByTimes(){
  if(undefined === this._scenes_by_time){
    this.SceneNumberToID // pour forcer le calcul
    this._scenes_by_time.sort(function(a,b){return a.time - b.time})
    // console.log("this._scenes_by_time:", this._scenes_by_time)
  }
  return this._scenes_by_time
}

// ---------------------------------------------------------------------
//  INSTANCE

constructor(data){
  // Par exemple, data.numero => this._numero
  for(var p in data){this[`_${p}`] = data[p]}
}

/**
* Méthode d'export de la scène
**/
export(options){
  return this.export_html()
}
export_md(options){
  return `

\`\`\`heading
${this.numero} ${this.lieu}-${this.effet} — ${this.decor.toUpperCase()}
\`\`\`

\`\`\`pitch
${this.pitch}
\`\`\`

  `
}

export_html(options){
  return this.formater.formate(
            this.f_scene_heading.outerHTML
          + this.f_pitch.outerHTML
        )

}
// ---------------------------------------------------------------------
// Méthodes d'helper

// Une instance FATexte pour utiliser ensuite :
//  this.formater.formate(<le texte à corriger>[, <options éventuelles>])
get formater(){return this._formater||defP(this,'_formater', new FATexte(''))}

get f_scene_heading(){
  if(undefined === this._f_scene_heading){
    var headingElements = [
        DCreate('SPAN', {class:'scene-numero', inner: `${this.numero}. `})
      , DCreate('SPAN', {class:'scene-lieu', inner: `${this.lieu.toUpperCase()}. `})
      , DCreate('SPAN', {class:'scene-effet', inner: this.effet.toUpperCase()})
      , DCreate('SPAN', {inner:' – '})
      , DCreate('SPAN', {class:'scene-decor', inner: this.decor.toUpperCase()})
    ]
    if(this.sous_decor){
      headingElements.push(DCreate('SPAN', {inner: ' : '}))
      headingElements.push(DCreate('SPAN', {class:'scene-sous-decor', inner: this.sous_decor.toUpperCase()}))
    }
    headingElements.push(DCreate('SPAN', {class:'scene-time', inner: ` (${new OTime(this.time).horloge_simple})`}))
    // On peut assembler l'entête
    this._f_scene_heading = DCreate('DIV', {
      class: 'scene-heading'
    , append: headingElements
    })
  }
  return this._f_scene_heading
}
get f_pitch(){
  if(undefined === this._f_pitch){
    this._f_pitch = DCreate('DIV', {class:'scene-pitch', inner: this.pitch})
  }
  return this._f_pitch
}

// ---------------------------------------------------------------------
// Méthodes fonctionnelles

reset(){
  delete this._pitch
  delete this._numero
}

// ---------------------------------------------------------------------
//  Données
/**
 * Numéro de la scène
 */
get numero(){ return this._numero }
set numero(v){ this._numero = v}

get pitch(){return this.event.pitch}
get lieu(){return this.event.lieu}
get effet(){return this.event.effet}
get decor(){return this.event.decor}
get sous_decor(){return this.event.sous_decor}

get event_id(){return this._event_id}
get event(){
  if(undefined === this._event){this._event = current_analyse.ids[this.event_id]}
  return this._event
}

get time(){ return this.event.time }
}
