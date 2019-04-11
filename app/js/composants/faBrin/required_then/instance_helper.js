'use strict'
/**
  Helpers d'instance
**/
Object.assign(FABrin.prototype,{

/**
  Pour conformité avec les autres éléments, events, documents, etc.
  Cf. le détail des arguments dans FAEvent
**/
as(format, flag, opts){
  if (undefined === flag) flag = 0
  // Pour le moment, on lie par défaut (NON !)
  // Pour le moment, on corrige par défaut
  flag = flag | FORMATED

  // console.log("-> as(format, flag)", format, flag)

  var str
  switch (format) {
    case 'short':
      str = this.asShort(opts)
      break
    case 'book':
      // Sortie pour le livre
      str = this.asBook(opts)
      break
    case 'full':
      // Affiche complet, avec toutes les informations
      str = this.asFull(opts)
      break
    case 'associate':
      str = this.asAssociate(opts)
      break
    default:
      str = this.title
  }

  if(flag & LABELLED) str = `<label>${this.htype} #${this.id} : </label> ${str}`

  if(flag & DUREE) str += ` (${this.hduree})`

  if(flag & FORMATED) str = DFormater(str)

  if(flag & ESCAPED){
    // Note : il exclut editable et linked
    str = str.replace(/<(.*?)>/g, '')
    str = str.replace(/\"/g, '\\\"')
    str = str.replace(/[\n\r]/,' --- ')
  } else if ( flag & EDITABLE ){
    // Note : il exclut LINKED
    str = this.linkedToEdit(str)
    // console.log("str:", str)
  } else if(flag & LINKED){
    str = this.linked(str)
  }
  return str
}
,
asShort(opts){
  return `&lt;&lt;Brin: ${this.title}&gt;&gt;`
}
,
asBook(opts){
}
,
asFull(opts){
  return `${this.libelle} -- ${this.description}`
}
,
asAssociate(opts){
  return this.asShort(opts)
}
,
linked(str){
  return `<a onclick="showBrin('${this.id}')">${str}</a>`
}
,
linkedToEdit(str){
  return this.linked(str)//pour le moment
}

,
asDiv(options){
  if(undefined === options) options = {}
  var divs = [
      DCreate('SPAN', {class: 'brin-title', inner: `Brin #${this.numero}. ${this.title}`})
    , DCreate('SPAN', {class: 'brin-description small', inner: this.description})
  ]
  if(options.forBook === true){
    divs.push(DCreate('DIV', {class:'brin-associateds-detailled', append: this.divAssociateds()}))
  } else {
    divs.push(DCreate('DIV', {class: 'brin-associateds small', inner: `Associés : ${this.associateds()}`}))
    divs.push(DCreate('BUTTON', {type:'button', class: 'toggle-next'}))
    divs.push(DCreate('DIV', {class:'brin-associateds-detailled', style:'display:none;', append: this.divAssociateds()}))
  }
  divs.push(DCreate('DIV', {style:'clear:both;'}))

  return DCreate('DIV', {class: 'brin', append:divs, attrs:{'data-type':'brin', 'data-id': this.id}})
}
,

divAssociateds(){
  var divs = [ DCreate('H4', {inner:'Associés'}) ]
    , id, ass
  for(id of this.documents){
    ass = FADocument.get(id)
    divs.push(DCreate('DIV', {attrs:{'data-type':'document', 'data-id': ass.id}, append:[
      DCreate('LI', {class:'document-title', inner: ass.as('associate',FORMATED|LINKED|LABELLED,{no_warm:true})})
    ]}))
  }
  for(id of this.events){
    ass = FABrin.a.ids[id]
    divs.push(DCreate('DIV', {attrs:{'data-type':'event', 'data-id': ass.id}, append:[
      DCreate('LI', {class:'event-title', inner: ass.as('short',FORMATED|LINKED|LABELLED,{no_warm:true})})
    ]}))
  }
  for(id of this.times){
    ass = new OTime(id)
    divs.push(DCreate('DIV', {attrs:{'data-type':'event', 'data-id': ass.id}, append:[
      DCreate('LI', {class:'time', inner: `<a onclick="showTime(${id})">Temps : ${ass.horloge_simple}</a>`})
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
