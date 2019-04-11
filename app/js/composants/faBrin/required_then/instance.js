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
addToList(list_id, foo_id){
  console.log("addToList:", list_id, foo_id)
  if(undefined === this.data[list_id] || this.data[list_id].indexOf(foo_id) < 0){
    if (undefined === this.data[list_id]) this.data[list_id] = []
    this.data[list_id].push(foo_id)
    console.log(`this.data[${list_id}] vaut maintenant:`,this.data[list_id])
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
