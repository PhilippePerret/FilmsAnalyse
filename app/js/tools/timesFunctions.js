'use strict'

// Pour définir le début du film
let setFilmStartTimeAt = function(){
  this.filmStartTime = this.locator.getTime()
  this.modified = true
  this.setButtonGoToStart()
  F.notify(`J'ai pris le temps ${new OTime(this.filmStartTime).horloge} comme début du film.`)
}

// Pour définir le début du film
let setFilmEndTimeAt = function(){
  this.filmEndTime = this.locator.getTime()
  this.modified = true
  F.notify(`J'ai pris le temps ${new OTime(this.filmEndTime).horloge} comme fin du film.`)
}

// Pour définir la fin du générique de fin
let setEndGenericFin = function(){
  this.filmEndGenericFin = this.locator.getTime()
  this.modified = true
  F.notify(`J'ai pris le temps ${new OTime(this.filmEndGenericFin).horloge} comme fin du générique de fin.`)
}

module.exports = {
    _setFilmStartTimeAt: setFilmStartTimeAt
  , _setFilmEndTimeAt:   setFilmEndTimeAt
  , _setEndGenericFinAt: setEndGenericFin
}
