'use strict'
/**
 * Class Locator
 * -------------
 * Pour la gestion d'un locateur vidéo
 */

class Locator {
  constructor(analyse){
    this.analyse = analyse
    // console.log("Instanciation de Locator avec :", this.analyse)
  }

  get realTime(){ return VideoController.getRTime }

  /**
   * Méthode qui retourne les évènements proches du temps +time+
   */
  eventsAt(time) {
    var trancheTime = parseInt(time - (time % 5),10)
    // On commence à chercher 10 secondes avant (on pourra changer ce nombre)
    var fromTranche = trancheTime // - 20
    var toTranche   = trancheTime // + 20
    // On prend tous les évènements dans ce temps
    var evs = []
    var evsBT = this.eventsByTrancheTime
    for(var tranche = fromTranche; tranche <= toTranche; tranche+=5){
      // console.log("Recherche dans la tranche : ", tranche)
      if(undefined === evsBT[tranche]) continue
      for(var i=0, len=evsBT[tranche].length;i<len;++i){
        var idx = evsBT[tranche][i]
        evs.push(this.analyse.events[idx])
      }
    }
    return evs
  }
  /**
   * Propriété qui contient les évènements de l'analyse courante par tranche de
   * temps de 5 secondes.
   */
  get eventsByTrancheTime(){
    if(undefined === this._events_by_tranche_time){
      this._events_by_tranche_time = {}
      var i = 0, len = this.analyse.events.length, e, t
      for(i;i<len;++i){
        e = this.analyse.events[i]
        var t = parseInt(e.time - (e.time % 5),10)
        if(undefined === this._events_by_tranche_time[t]){
          this._events_by_tranche_time[t] = []
        }
        this._events_by_tranche_time[t].push(parseInt(i,10))
      }
      console.log("this._events_by_tranche_time:",this._events_by_tranche_time)
    }
    return this._events_by_tranche_time
  }

  /**
   * Retourne l'index courant dans la liste (Array) `events` de l'analyse
   * courante
   */
  get indexEvent(){
    return 0
  }

  currentEvent(){

  }


}
