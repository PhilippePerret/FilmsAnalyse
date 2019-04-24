'use strict'
/**
  Filtre des events
  ------------------

  USAGE
  =====

  var efilter = new EventsFilter(this, {filter: <filter>})

  avec <filter> = {é
    eventTypes:   Liste Array des types retenus
    fromTime:     Temps en seconde de start
    toTime:       Temps en seconde de fin
    invert:       Pour inverser tous les choix (exclusion)
  }

  =é

  Par exemple, pour filtrer seulement les scènes :
  var sceneFilter = new EventsFilter(this, {filter:{eventType:['scene']}})

**/
class EventsFilter {

// ---------------------------------------------------------------------
//  INSTANCE

constructor(owner, args){
  this.owner  = owner
  this.args   = args
  this.filter = (args && args.filter) || {}

  this.prepareFilter()
}

/**
  Boucle sur les events filtrés

  Note : on peut interrompre la boucle en faisant retourner
  la valeur false à la méthode. Mais la valeur undefined ne
  mettra pas fin à la boucle

**/
forEachFilteredEvent(method){
  for(var ev of this.filtereds){
    if(false === method(ev)) break
  }
}
get forEachFiltered(){ return this.forEachFilteredEvent.bind(this) }

/**
  Retourne la liste des filtrés
**/
get filtereds(){
  let my = this
    , fn_texte        // fonction pour chercher le texte
  // console.log("-> EventFilter#filtereds", this.filter)
  if(undefined === this._filtereds){
    this._filtereds = []
    this.a.forEachEvent(function(ev){
      // console.log("Event : ",ev)
      if(my.isFalse(my.hTypes[ev.type]))        return
      if(my.isFalse(ev.time >= my.fromTime))    return
      if(my.isFalse(ev.time <= my.toTime))      return
      if(my.isFalse(my.filtrePersonnages(ev)))  return
      if(my.filter.with_text){
        console.log("Je dois chercher avec le texte")
      }
      my._filtereds.push(ev)
    })
  }
  my = null
  return this._filtereds
}

filtrePersonnages(){
  let my = this
  if(undefined === this._filtrePersonnages){
    if(my.filter.with_personnages){
      if(my.filter.with_personnages.all){
        my.filter.with_personnages.regulars = []
        for(var pid of my.filter.with_personnages.list){
          my.filter.with_personnages.regulars.push(new RegExp(`@${pid}[^a-zA-Z0-9_]`))
        }
      } else {
        // Expression régulière quand 'all' (personnages) est faux et qu'on cherche
        // donc à ne trouver qu'au moins un personnage.
        my.filter.with_personnages.regulars = [
          new RegExp(`@(${my.filter.with_personnages.list.join('|')})[^a-zA-Z0-9_]`)
        ]
      }
      this._filtrePersonnages = function(ev){return ev.hasPersonnages(my.filter.with_personnages)}
    } else {
      this._filtrePersonnages = function(ev){return true}
    }
  }
  return this._filtrePersonnages
}

/**
  Retoune true si la condition +condition+ est fausse, en tenant
  compte de l'inversion.
**/
isFalse(condition){
//   console.log(`
// condition: ${condition}
// invert: ${this.invert}
// this.invert === condition = ${this.invert === !!condition}
//     `)
  return this.invert === !!condition
}

// ---------------------------------------------------------------------
//  Les données du filtre

get fromTime(){
  if(undefined === this._fromTime){
    if(undefined === this.filter.fromTime){
      this._fromTime = -10000
    } else {
      this._fromTime = this.filter.fromTime
    }
  }
  return this._fromTime
}

get toTime(){
  if(undefined === this._toTime){
    if(undefined === this.filter.toTime){
      this._toTime = 1000000
    } else {
      this._toTime = this.filter.toTime
    }
  }
  return this._toTime
}

// Pour inverser la condition générale
get invert(){
  if(undefined === this._invert){
    if(undefined === this.filter.invert){
      this._invert = false
    } else {
      this._invert = this.filter.invert
    }
  }
  return this._invert
}
/**
  Prépare le filtre
  On prépare le filtre pour qu'ils oit plus rapide. Par exemple,
  pour la liste des types, au lieu d'avoir une liste qu'on
  passe en revue chaque fois pour trouver l'indexOf, on fait
  une table.
**/
prepareFilter(){
  var my = this
  if(undefined === my.filter.eventTypes) my.filter.eventTypes = []

  my.hTypes = {}
  my.filter.eventTypes.forEach(function(el){my.hTypes[el] = true})
  my = null
}

get a(){return this._a||defP(this,'_a', current_analyse)}

}// fin de EventsFilter
