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

  /**
   * Retourne l'instance Scene de la scène au temps +time+
   *
   * +time+ est le temps par rapport au début défini du film, PAS le début
   * de la vidéo
   */
  static sceneAt(time){
    time = Math.round(time)
    if (time < (current_analyse.filmStartTime || 0)){
      F.error("Impossible de trouver une scène avant le début du film.")
      return
    }
    var len = this.ScenesByTimes.length
    var i = 0
    for(;i<len;++i){
      if (this.ScenesByTimes[i].time > time ) {
        return this.get(this.ScenesByTimes[i - 1].numero)
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
   * Numéro de la scène
   */
  get numero(){ return this._numero }
  set numero(v){ this._numero = v}

  get event_id(){return this._event_id}
  get event(){
    if(undefined === this._event){this._event = current_analyse.ids[this.event_id]}
    return this._event
  }
}
