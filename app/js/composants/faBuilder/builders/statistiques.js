'use strict'

module.exports = function(options){
  var my = this
  my.log("* Construction des statistiques…")
  let str = ''
  str += '<h1 id="statistiques-title">Statistiques</h1>'
  str += '<section id="statistiques">'
  str += my.generalDescriptionOf('statistiques')
  str += FAStatistiques.output()
  str += '</section>'
  my = null
  return str
}

const FAStatistiques = {
  class:  'FAStatistiques'
, type:   'object'
/**
  Méthode retournant le code final des statistiques telles
  qu'elles doivent être écrites dans le livre.
**/
, output(options){
    // Les "briques" des statistiques
    let appends = []
    appends.push(this.divStatsPersonnages())
    appends.push(this.divStatsScenes())
    // Le div final (body)
    let div = DCreate('DIV', {class:'body', append:appends})

    // Garbage collector
    delete Scene.divscenesCount
    appends = null

    if(options && options.format === 'dom'){
      return div
    } else {
      return div.outerHTML
    }
  } // /output

/**
  Bloc principal de statistiques sur les personnages
**/
, divStatsPersonnages(){

    return DCreate('DIV', {class: 'stats-personnages', append:[
      DCreate('H2', {inner: 'Statistiques sur les personnages'})
    , DLibVal(FAPersonnage, 'count', 'Nombre personnages')
    , DCreate('H3', {inner: 'Temps de présence des personnages'})
    , DCreate('DIV', {append: FAPersonnage.perPresenceTime()})
    ]})
  }

/**
  Bloc principal de statistiques sur les scènes
**/
, divStatsScenes(){
    var my = this
    return DCreate('DIV', {class: 'stats-scenes', append:[
      DCreate('H2', {inner: 'Statistiques sur les scènes'})
    , DLibVal(Scene, 'count', 'Nombre de scènes')
    , DLibVal(Scene, 'dureeMoyenne', 'Durée moyenne')
    , DLibVal(Scene, 'plusLongue', 'La plus longue')
    , DLibVal(Scene, 'plusCourte', 'La plus courte')
    , DCreate('H3', {inner: 'Les dix scènes les plus longues'})
    , DCreate('DIV', {class: 'div', append: Scene.perMaxLongueur()})
    , DCreate('H3', {inner: 'Les dix scènes les plus courtes'})
    , DCreate('DIV', {class: 'div', append: Scene.perMinLongueur()})
    ]})
}


}// /FAStatistiques

/** ---------------------------------------------------------------------
  Extension de la classe SCENE pour les STATISTIQUES
**/
Object.assign(Scene,{
  get dureeMoyenne(){
    return `${new OTime(Scene.a.duration / Scene.count).duree_sec} secs`
  }
, get plusLongue(){
    this._longest_scene || this.searchLongestShortest()
    return `${this._longest_scene.asShort} (${new OTime(this._longest_scene.duree).hduree})`
  }
, get plusCourte(){
    this._shortest_scene || this.searchLongestShortest()
    return `${this._shortest_scene.asShort} (${new OTime(this._shortest_scene.duree).hduree})`
  }
, searchLongestShortest(){
    if (undefined === this._longest_scene){
      var sc_max = {duree: 0}
      var sc_min = {duree: 1000000}
      Scene.forEachScene(function(sc){
        if(sc.duree > sc_max.duree) sc_max = sc
        if(sc.duree < sc_min.duree) sc_min = sc
      })
      this._longest_scene   = sc_max
      this._shortest_scene  = sc_min
    }
  }
})

/**
  Retourne les divs des 10 SCÈNES les plus longues
**/
Scene.perMaxLongueur = function(){
  var my = this
  let divs = []
  for(var i = 0; i < 10; ++i){
    let sc = this.sortedByDuree()[i]
    if(undefined === sc) break
    divs.push(DCreate('DIV', {class: 'pitch-data', append:[
      DCreate('SPAN', {class:'pad4 left', inner: DFormater(my.get(sc.numero).asShort)})
    , DCreate('SPAN', {class:'right', inner: new OTime(my.get(sc.numero).duree).hduree})
    ]}))
  }
  return divs
}
Scene.perMinLongueur = function(){
  var my = this
    , divs = []
    , arr = Object.assign([], this.sortedByDuree())
    , sc
  arr.reverse()
  for(var i = 0; i < 10; ++i){
    sc = arr[i]
    if(undefined === sc) break
    divs.push(DCreate('DIV', {class: 'pitch-data', append:[
      DCreate('SPAN', {class:'pad4 left', inner: DFormater(my.get(sc.numero).asShort)})
    , DCreate('SPAN', {class:'right', inner: new OTime(my.get(sc.numero).duree).hduree})
    ]}))
  }
  return divs
}
Scene.sortedByDuree = function(){
  if(undefined === this._sortedDuree){
    this._sortedDuree = Object.assign([], this._scenes_by_time)
    this._sortedDuree.sort(function(a,b){
      return b.event.duration - a.event.duration
    })
  }
  return this._sortedDuree
}

/**
  Extension de la classe PERSONNAGES pour les STATISTIQUES
**/
// Retourne les DIV des dix personnages les plus présents
// dans le film.
FAPersonnage.perPresenceTime = function(){
  let divs = []
    , persos = Object.assign([], this.personnages)

  persos.sort(function(a,b){a.presence - b.presence})

  for(var i = 0 ; i < 10 ; ++i){
    if(undefined === persos[i]) break
    divs.push(DLibVal(persos[i], 'f_presence', persos[i].pseudo))
  }
  return divs
}
Object.defineProperties(FAPersonnage.prototype,{
  /**
    Renvoie le temps de présence du personnage dans le film. Ce temps
    est calculé en fonction de sa présence dans la scène, qu'on trouve
    par le biais de son diminutif dans la description ou le pitch.
  **/
  presence:{
    get(){return this._presence||defP(this,'_presence', this.calcPresence())}
  }
, f_presence:{
    get(){return this._f_presence||defP(this,'_f_presence', this.formatePresence())}
  }
})
/**
  Calcule le temps de présence du personnage dans le film en
  fonction de sa présence dans les scènes.
**/
FAPersonnage.prototype.calcPresence = function(){
  let time = 0
    , reg = new RegExp(`(^|[^a-zA-Z0-9_])@${this.dim}([^a-zA-Z0-9_]|$)`)
  Scene.forEachScene(function(scene){
    if(scene.pitch.match(reg) || scene.description.match(reg)){
      time += scene.duration
    }
  })
  return time
}
/**
  Méthode qui met en forme le temps de PRÉSENCE du PERSONNAGE pour
  les statistiques.
  On doit afficher la durée totale et le pourcentage de temps
  que sa représence.
**/
FAPersonnage.prototype.formatePresence = function(){
  let otime = new OTime(this.presence)
  return `${otime.hduree} (${asPourcentage(this.a.duration, this.presence)})`
}
