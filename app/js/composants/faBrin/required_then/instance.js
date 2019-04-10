'use strict'

Object.assign(FABrin.prototype,{
addDocument(doc){
  // console.log("J'ajoute le document:", doc)
  this.addToList('documents', doc_id)
}
,
addEvent(ev_id){
  // console.log("J'ajoute l'event :", ev_id)
  this.addToList('events', ev_id)
}
,
addTime(time){
  // console.log("J'ajoute le time: ", time)
  this.addToList('times', time)
}
,
addToList(list, foo_id){
  // console.log("addToList:", list, foo_id)
  if(this[list].indexOf(foo_id) < 0){
    this[list].push(foo_id)
    this.modified = true
  } else {
    F.notify(`Le brin est déjà lié à cet élément « ${list} ».`)
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
})
