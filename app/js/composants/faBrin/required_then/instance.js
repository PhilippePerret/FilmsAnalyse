'use strict'

Object.assign(FABrin.prototype,{
addDocument(doc_id){
  this.addToList('documents', doc_id)
}
,
addEvent(ev_id){
  this.addToList('events', ev_id)
}
,
addTime(time){
  this.addToList('times', time)
}
,
addBrin(brin_id){
  if(this.id === brin_id){
    return F.notify('Un brin ne peut pas être associé à lui-même, voyons…', {error: true})
  }
  this.addToList('brins', brin_id)
}
,
addToList(list_id, foo_id){
  console.log("addToList:", list_id, foo_id)
  if(undefined === this.data[list_id] || this.data[list_id].indexOf(foo_id) < 0){
    if (undefined === this.data[list_id]) this.data[list_id] = []
    this.data[list_id].push(foo_id)
    // console.log(`this.data[${list_id}] vaut maintenant:`,this.data[list_id])
    this.modified = true
  } else {
    F.notify(`Le brin est déjà lié à cet élément « ${list_id} ».`)
  }
}
})
Object.defineProperties(FABrin.prototype,{
id:{get(){return this.data.id}}
,
modified:{
  get(){return this._modified || false}
, set(v){
    this._modified = v
    if (true === v) FABrin.modified = true
  }
}
,
title:{get(){return DFormater(this.data.title)}}
,
libelle:{get(){return this.title}} // alias
,
description:{get(){return DFormater(this.data.description)}}
,
documents:{
  get(){return this.data.documents || []}
, set(v){this.data.documents = v}
}
,
events:{
  get(){return this.data.events || []}
, set(v){this.data.events = v}
}
,
times:{
  get(){return this.data.times || []}
, set(v){this.data.times = v}
}
,
/**
  Retourne la liste des scènes du brin.
  Cette méthode est indispensable à l'instance FAStats pour les calculs de
  statistiques.
  Mais ce comptage des scènes, pour les brins, est assez compliqué, puisqu'il
  y a les scènes auxquelles il appartient par la scène elle-même, mais il y a
  aussi les scènes des éléments associés, qui ne sont pas des event.scene.
  Par convention, on ne tient pas compte des documents, qui ne peuvent pas
  avoir de durée à proprement parler.

  @return {Array of FAEscene} Liste des instances scène du brin
**/
scenes:{
  get(){
    if(undefined === this._scenes){
      var arr = []
      for(var time of this.times){
        arr.push(FAEscene.at(time))
      }
      for(var ev_id of this.events){
        arr.push(this.a.ids[ev_id].scene)
      }
      this._scenes = arr
    }
    return this._scenes
  }
}
,
stats:{get(){return this._stats||defP(this,'_stats',new FAStats(this))}}
})
