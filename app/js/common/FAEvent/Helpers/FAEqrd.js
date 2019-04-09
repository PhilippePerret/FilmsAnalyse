'use strict'
/**
  Helpers pour les QRD
**/

Object.assign(FAEqrd,{

})


Object.assign(FAEqrd.prototype,{
/**
  Version courte de l'event
  Appeler `this.as('short', flag)`
**/
asShort(options){
  var str = ''
  let rep
  if(this.reponse){
    rep = `<label>Réponse : </label>${this.reponse}`
  } else {
    rep = '<span class="warning">RÉPONSE REQUISE</span>'
  }
  str += `<div>QRD #${this.id} : ${this.question} — ${rep}</div>`

  return str
}

,
/**
  Version complète de la QRD
**/
asFull(options){
  return DCreate('DIV', {append:[
    DCreate('DIV', {append: [
        DCreate('LABEL', {inner: 'QUESTION : '})
      , DCreate('SPAN', {inner: this.question})
      ]})
  , DCreate('DIV', {append:[
        DCreate('LABEL', {inner: 'RÉPONSE : '})
      , DCreate('SPAN', {inner: this.f_reponse})
      ]})
  , DCreate('DIV', {append:[
        DCreate('DIV', {class:'small', inner: this.description})
      ]})
  ]}).outerHTML
}
})


Object.defineProperties(FAEqrd.prototype,{
  // @return {String} La question formatée, ou 'requise'
  f_reponse:{
    get(){
      if(this.reponse && this.reponse.length){
        return `${this.reponse} (${new OTime(this.tps_reponse).horloge_simple})`
      } else {
        return '<span class="warning">REQUISE</span>'
      }
    }
  }
})