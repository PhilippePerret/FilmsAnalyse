'use strict'
/**
  Helpers d'instance
**/
Object.assign(FABrin.prototype,{
asDiv(options){
  return DCreate('DIV', {class: 'brin', append:[
    DCreate('SPAN', {class: 'brin-title', inner: this.title})
  , DCreate('SPAN', {class: 'brin-description small', inner: this.description})
  , DCreate('DIV', {class: 'brin-associateds small', inner: `Associés : ${this.associateds()}`})
  , DCreate('BUTTON', {type:'button', class: 'toggle-next'})
  , DCreate('DIV', {class:'brin-associateds-detailled', style:'display:none;', append: this.divAssociateds()})
  , DCreate('DIV', {style:'clear:both;'})
  ], attrs:{'data-id': this.id}})
}
,

divAssociateds(){
  var divs = [ DCreate('H4', {inner:'Associés'}) ]
    , id, ass
  for(id of this.documents){
    ass = FADocument.get(id)
    divs.push(DCreate('DIV', {attrs:{'data-type':'document', 'data-id': ass.id}, append:[
      DCreate('SPAN', {class:'document-title', inner: ass.as('short',FORMATED|LINKED|LABELLED,{no_warm:true})})
    ]}))
  }
  for(id of this.events){
    ass = FABrin.a.ids[id]
    divs.push(DCreate('DIV', {attrs:{'data-type':'event', 'data-id': ass.id}, append:[
      DCreate('SPAN', {class:'event-title', inner: ass.as('short',FORMATED|LINKED|LABELLED,{no_warm:true})})
    ]}))
  }
  for(id of this.times){
    ass = new OTime(id)
    divs.push(DCreate('DIV', {attrs:{'data-type':'event', 'data-id': ass.id}, append:[
      DCreate('SPAN', {class:'time', inner: `<a onclick="showTime(${id})">Temps : ${ass.horloge_simple}</a>`})
    ]}))
  }
  return divs
}
,
/**
  Retourne la liste des éléments associés, en mode court (il suffit de glisser la souris sur l'ID pour le lire)
**/
associateds(){
  var ass = [], id
  for(id of this.documents){
    ass.push(`<span title="Document « ${FADocument.get(id).title} »">Doc: ${id}</span>`)
  }
  for(id of this.events){
    ass.push(`<span title="${FABrin.a.ids[id].as('short',FORMATED|ESCAPED,{no_warm:true})}">Ev#${id}</span>`)
  }
  for(id of this.times){
    ass.push(`<span>temps: ${new OTime(id).horloge_simple}</span>`)
  }
  if (ass.length){
    return ass.join(', ')
  } else {
    return '- aucun -'
  }
}
})

Object.defineProperties(FABrin.prototype,{

})
