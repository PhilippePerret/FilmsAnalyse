'use strict'

const DUREE_FILM = current_analyse.duration


const PFABuilder = {
/**
* Retourne le code du PFA absolu
**/
  get absolutePFA(){
    return DCreate('SECTION',{
      id: `pfa-absolute`
    , class: 'pfa'
    , append: [
        this.divAbsParts
      , this.divAbsZones('top')
      , this.divAbsZones('bottom')
    ]})
}
, get relativePFA(){
    return DCreate('SECTION',{
      id: `pfa-relative`
    , class: 'pfa'
    , append: [
        this.divRelZones('bottom')
      , this.divRelZones('top')
      , this.divRelParts
    ]})
}
, get divAbsParts(){
    var div = this.divParts('Abs')
    return div
}
, get divRelParts(){
  var div = this.divParts('Rel')
  return div
}
, divParts(dimT /* 'Abs' ou 'Rel'*/ ){
  var  div, zoneId, node, span
  div = DCreate('DIV',{
    id:    `pfa-div-parts-${dimT}`
  , class: 'pfa-div-parts'
  , style: `width:${this.plain}px;`
  })
  for(zoneId of this.partsIds){
    node = this.a.PFA.node(zoneId)
    span = node[`in${dimT}PFA`](this.coefT2P)
    span && div.appendChild(span)
  }
  node = null
  return div
}

/**
* Il y a deux lignes de zones, une supérieure avec les nœuds les plus
* importants et une ligne en dessous avec les noeuds moindres
**/
, divAbsZones(which){
    var div = this.divZones('Abs', which)
    return div
}
, divRelZones(which){
    var div = this.divZones('Rel', which)
    return div
}
, divZones(dimT, which){
    var div, zoneId, node, span, zoneIds
    div = DCreate('DIV')
    div.className = 'pfa-div-zones'
    div.id = `pfa-div-zones-${dimT}`
    if (which === 'top'){
      zoneIds = this.a.PFA.MAIN_STTNODES
    } else {
      zoneIds = this.a.PFA.SUB_STTNODES
    }
    for(zoneId of zoneIds){
      node = this.a.PFA.node(zoneId)
      span = node[`in${dimT}PFA`](this.coefT2P)
      span && div.appendChild(span)
    }
    return div
}
/**
* Méthode qui calcule toutes les dimensions d'après la largeur voulue
**/
, calcDimsFor(larg){
    this.quart  = this.qu = larg / 4
    this.tiers  = this.ti = larg / 3
    this.moitie = this.mo = larg / 2
    this.troisquart = 3 * this.quart
    this.plain  = larg
}

, get coefT2P(){
    if(undefined === this._coefT2P){
      this._coefT2P = this.plain / DUREE_FILM
    }
    return this._coefT2P
}
, get a(){return current_analyse}

, get partsIds() {return this._partsIds || this.defineIds().parts}
, get zonesIds() {return this._zonesIds || this.defineIds().zones}

, defineIds(){
  var ps = [], zs = [], kstt, dstt
  for(kstt in this.a.PFA.DATA_STT_NODES){
    dstt = this.a.PFA.DATA_STT_NODES[kstt]
    if ( dstt.main ){
      ps.push(kstt)
    } else {
      zs.push(kstt)
    }
  }
  this._partsIds = ps
  this._zonesIds    = zs
  return {parts: ps, zones: zs}
}

}


// Retourne les styles propres, calculés en fonction du film
PFABuilder.styles = function(){
  var sty = document.createElement('LINK')
  sty.setAttribute('rel', "stylesheet")
  sty.setAttribute('media', "screen")
  sty.href = './js/common/PFA/PFA.css'
  return sty
}()

module.exports = function(options){
  // console.log("-> Construction du PFA")

  var pfa_id = 1

  PFABuilder.calcDimsFor(ScreenWidth - 200)

  var pfas = document.createElement('SECTION')
  pfas.id = 'pfas'
  pfas.appendChild(PFABuilder.styles)
  pfas.appendChild(PFABuilder.absolutePFA)
  pfas.appendChild(PFABuilder.relativePFA)

  this._output = pfas

  // console.log("<- Construction du PFA")
}
