'use strict'
/**

  Construction du Paradigme de Field Augmenté pour le livre

  Ce paradigme-là est vertical, contrairement au paradigme normal, et il
  est beaucoup plus littéraire.
  C'est une table avec en première colonne les grandes parties

**/

// Le constructeur de PFA
const PFABuilder = {
  class: 'PFABuilder'

, descriptionZone(zoneId){
  if(this.pfa.data[zoneId]){
    // console.log("event:", this.pfa.a.getEventById(this.pfa.data[zoneId].event_id))
    return `Description de la zone ${zoneId}<br>Donnée par ${this.pfa.a.getEventById(this.pfa.data[zoneId].event_id).content}.`
  } else {
    return `Description de la zone ${zoneId}<br>INEXISTANTE.`
  }
}
, build(pfa){

    this.pfa = pfa

    var allDivs = [
        DCreate('DIV',{class:'pfa-part-name expo', append:[
          DCreate('SPAN', {inner:'EXPOSITION'})
        ]})
      , DCreate('DIV',{class:'pfa-part-name dev1', append:[
          DCreate('SPAN', {inner:'DÉV 1'})
        ]})
      , DCreate('DIV',{class:'pfa-part-name dev2', append:[
          DCreate('SPAN', {inner:'DÉV 2'})
        ]})
      , DCreate('DIV',{class:'pfa-part-name dnou', append:[
          DCreate('SPAN', {inner:'DÉNOUEMENT'})
        ]})
    ]
    var divZone
    for(var kstt in pfa.DATA_STT_NODES){
      var dstt = pfa.DATA_STT_NODES[kstt]
      if(dstt.main) continue
      divZone = DCreate('DIV', {
          class: `pfa-zone ${kstt}`
        , append: [
            DCreate('DIV', {class: `pfa-zone-name ${kstt}`, inner: dstt.hname})
          , DCreate('DIV', {class: `pfa-zone-desc ${kstt}`, inner: this.descriptionZone(kstt)})
          ]
      })
      allDivs.push(divZone)
    }

    // On retourne le paradigme de field
    return DCreate('DIV', {
      id:'pfa-container'
    , append: allDivs
    })

}

}// /PFABuilder

module.exports = function(options){
  var my = this // FABuilder

  // Note : on doit se servir de l'objet PFA pour le faire
  my.log("* Construction du paradigme de Field Augmenté…")

  var pfa = my.a.PFA

  let str = ''
  str += '<h1 id="section-pfa">Paradigme de Field Augmenté du film</h1>'
  str += '<!-- TODO : lien version explication -->'
  str += '<section id="pfa">'
  str += PFABuilder.build(pfa).outerHTML
  str += '</section>'

  return str
}
