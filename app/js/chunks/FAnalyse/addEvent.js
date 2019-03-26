'use strict'

let addEvent = function(nev, whenLoading){
  if(undefined === this.ids){
    this.events = []
    this.ids    = {}
  }
  if (this.events.length){
    // On place l'event à l'endroit voulu dans le film
    var idx_event_before = this.getIndexOfEventAfter(nev.time)
    this.events.splice(idx_event_before, 0, nev)
  } else {
    this.events.push(nev)
  }
  this.ids[nev.id] = nev

  if (!whenLoading) {
    this.locator.addEvent(nev)
    // Si le nouvel event est une scène, il faut peut-être numéroter
    // les suivantes
    if(nev.type === 'scene'){this.updateNumerosScenes()}
    // Si le nouvel event est un noeud structurel, il faut l'enregistrer
    // dans les données du paradigme de Field
    if(nev.type === 'stt'){
      // note : le PFA est toujours chargé
      // => On peut placer le nouveau noeud directement
      //    dans les données et les enregistrer
      var d = this.PFA.data
      d[nev.sttID] = {event_id: nev.id, stt_id: nev.sttID}
      this.PFA.data = d
      this.PFA.save()
      this.PDA.update()
    }

    // On place tout de suite l'évènement sur le lecteur
    nev.show()
    this.modified = true
    nev = null
    idx_event_before = null
  }

}

module.exports = addEvent
