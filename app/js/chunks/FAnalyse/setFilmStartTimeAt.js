'use strict'

// Pour définir le début du film
let SetFilmStartTimeAt = function(){
  this.filmStartTime = this.locator.getOTime()
  this.modified = true
  this.setButtonGoToStart()
  F.notify(`J'ai pris le temps ${this.filmStartTime.horloge} comme début du film.`)
}

module.exports = SetFilmStartTimeAt
