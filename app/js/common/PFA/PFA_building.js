'use strict'

const DUREE_FILM = current_analyse.duration

/**
  * Méthodes de construction du PFA
  **/
  /**
   * Construction du PFA absolu, en fonction de la longueur du film
   *
   * => Production de this._absolutePFA
   */
function buildAbsolutePFA(pfa_id){
  // Soit on fait un pourcentage, soit on fait par valeur fixe en calculant
  // le coefficiant par rapport à la durée.
  //
  this._absolutePFA = `
  <section id="absolute-pfa-${pfa_id}" class="pfa absolute-pfa">
  <div class="pfa-part pfa-exposition">
    <span class="pfa-part-name">EXPOSITION</span>
  </div>
  <div class="pfa-part pfa-develop-part1">
    <span class="pfa-part-name">DÉV. PART 1</span>
  </div>
  <div class="pfa-part pfa-develop-part2">
    <span class="pfa-part-name">DÉV. PART 2</span>
  </div>
  <div class="pfa-part pfa-denouement">
    <span class="pfa-part-name">DÉNOUEMENT</span>
  </div>
  </section>
  `
}
  /**
   * Construction du PFA relatif
   *
   * => Production de this._relativePFA
   */
function buildRelativePFA(pfa_id){
  this._relativePFA = `
  <section id="relative-pfa-${pfa_id}" class="pfa relative-pfa">
  <div class="pfa-part pfa-exposition">
    <span class="pfa-part-name">EXPOSITION</span>
  </div>
  <div class="pfa-part pfa-develop-part1">
    <span class="pfa-part-name">DÉV. PART 1</span>
  </div>
  <div class="pfa-part pfa-develop-part2">
    <span class="pfa-part-name">DÉV. PART 2</span>
  </div>
  <div class="pfa-part pfa-denouement">
    <span class="pfa-part-name">DÉNOUEMENT</span>
  </div>
  </section>
  `
}

  /**
   * Assemblage des deux PFA du film, absolu et relatif
   *
   * => Production de this._assembledPFAs
   */
function assemblePFAs(pfa_id){
    this._assembledPFAs = `<section id="section-pfa-${pfa_id}" class="section-pfa">`
    this._assembledPFAs += this._buildAbsolutePFA
    this._assembledPFAs += this._relativePFA
    this._assembledPFAs += '</section>'
}

module.exports = function(options){
  console.log("-> Construction du PFA")
  var pfa_id = 1
  this.buildAbsolutePFA = buildAbsolutePFA.bind(this)
  this.buildRelativePFA = buildRelativePFA.bind(this)
  this.assemblePFAs     = assemblePFAs.bind(this)

  this.buildAbsolutePFA(pfa_id)
  this.buildRelativePFA(pfa_id)
  this.assemblePFAs(pfa_id)

  console.log("<- Construction du PFA")
}
