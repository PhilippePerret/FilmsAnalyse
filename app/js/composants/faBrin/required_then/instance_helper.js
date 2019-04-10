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
  ], attrs:{'data-id': this.id}})
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
    ass.push(`<span title="${FABrin.a.ids[id].as('short',FORMATED|ESCAPED)}">Ev#${id}</span>`)
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
