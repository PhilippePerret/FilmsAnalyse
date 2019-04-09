'use strict'
/**

  Class FADecor
        FASousDecor
  -----------------
  Gestion des décors

**/
class FADecor {
// ---------------------------------------------------------------------
//  CLASS

// ---------------------------------------------------------------------
//  INSTANCE
constructor(name, data){
  this.name = name
  this.data = data
  this.scenes     = []
  this.sousDecors = {}
}

/**
  Ajoute la scène de numéro +numero+

  @param {Number} numero  Numéro de la scène
**/
addScene(numero){
  this.scenes.push(numero)
}
/**
  Retourne le sous décor de nom (name) +name+
  @return {FASousDecor} Instance du sous-décor
**/
sousDecor(name){return this.sousDecors[name]}

/**
  Ajoute le sous-decor de nom +name+ et de données
  +data+
  @param {String} name    Nom du sous-décor
  @param {Object} data    Les données du sous-décor
**/
addSousDecor(name, data){
  this.sousDecors[name] = new FASousDecor(name, data)
  return this.sousDecors[name]
}

get sousDecorsCount(){return Object.keys(this.sousDecors).length}
get scenesCount(){ return this.scenes.length}
}// /fin FAdecor


class FASousDecor {
// ---------------------------------------------------------------------
//  INSTANCE
constructor(name, data){
  this.name   = name
  this.data   = data // rien pour le moment
  this.scenes = []
}
/**
  Ajoute la scène de numéro +numero+

  @param {Number} numero  Numéro de la scène
**/
addScene(numero){
  this.scenes.push(numero)
}

get scenesCount(){return this.scenes.length}
}
