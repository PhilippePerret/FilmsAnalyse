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
  var divs = []
  divs.push(DCreate('SPAN', {class:'question', append:[
        DCreate('LABEL', {inner: 'Question'})
      , DCreate('SPAN', {class: 'value', inner: DFormater(this.question)})
    ]}))
  divs.push(DCreate('SPAN', {class:'reponse', append:[
      DCreate('LABEL', {inner: 'Réponse'})
    , DCreate('SPAN', {class: 'value', inner: this.f_reponse})
    ]}))

  return divs
}

,
/**
  Version complète de la QRD
**/
asFull(options){
  return [
    DCreate('DIV', {append: [
        DCreate('LABEL', {inner: 'QUESTION : '})
      , DCreate('SPAN', {inner: DFormater(this.question)})
      ]})
  , DCreate('DIV', {append:[
        DCreate('LABEL', {inner: 'RÉPONSE : '})
      , DCreate('SPAN', {inner: this.f_reponse})
      ]})
  , DCreate('DIV', {append:[
        DCreate('DIV', {class:'small', inner: DFormater(this.description)})
      ]})
  ]
}
})


Object.defineProperties(FAEqrd.prototype,{
  // @return {String} La question formatée, ou 'requise'
  f_reponse:{
    get(){
      if(this.reponse && this.reponse.length){
        return `${DFormater(this.reponse)} (${new OTime(this.tps_reponse).horloge_simple})`
      } else {
        return '<span class="warning">REQUISE</span>'
      }
    }
  }
})
