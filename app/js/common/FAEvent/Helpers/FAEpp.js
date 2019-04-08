'use strict'
/**
  Helpers pour les QRD
**/

Object.assign(FAEpp,{

})


Object.assign(FAEpp.prototype,{
/**
  Version courte de l'event
  Appeler `this.as('short', flag)`
**/
asShort(options){
  var str = ''
  let rep
  if(this.payoff){
    rep = `<label>Paiement : </label>${this.payoff}`
  } else {
    rep = '<span class="warning">PAIEMENT REQUIS</span>'
  }
  str += `<div>PP #${this.id} : ${this.setup} — ${rep}</div>`

  return str
}

,
/**
  Version complète de la QRD
**/
asFull(options){
  return DCreate('DIV', {append:[
    DCreate('DIV', {append: [
        DCreate('LABEL', {inner: 'PRÉPARATION : '})
      , DCreate('SPAN', {inner: this.setup})
      ]})
  , DCreate('DIV', {append:[
        DCreate('LABEL', {inner: 'PAIEMENT : '})
      , DCreate('SPAN', {inner: this.f_payoff})
      ]})
  , DCreate('DIV', {append:[
        DCreate('LABEL', {inner: 'Exploitation : '})
      , DCreate('SPAN', {inner: this.exploitation})
      ]})
  , DCreate('DIV', {append:[
        DCreate('DIV', {class:'small', inner: this.description})
      ]})
  ]}).outerHTML
}
})


Object.defineProperties(FAEpp.prototype,{
  // @return {String} La setup formatée, ou 'requise'
  f_payoff:{
    get(){
      if(this.payoff && this.payoff.length){
        return `${this.payoff} (${new OTime(this.tps_payoff).horloge_simple})`
      } else {
        return '<span class="warning">REQUIS</span>'
      }
    }
  }
})
