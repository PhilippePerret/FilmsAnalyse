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

/**
  Retourne les données des décors, en les prenant dans les
  scènes définies.
**/
static get data(){
  return this._data || defP(this,'_data', this.getDataDecors())
}

/**
  Récupère la donnée des décors dans la liste des scènes, directement
  C'est une liste une contient en clé le nom du décor principal et en
  valeur la liste des sous-décors qu'il possède.
**/
static getDataDecors(){
  var dinst = {}  // table avec des instances

  FAEscene.forEachScene(function(scene){
    // console.log("scene:",scene)
    if(scene.decor && scene.decor != ''){
      if(undefined === dinst[scene.decor]){
        dinst[scene.decor] = new FADecor(scene.decor)
      }
      dinst[scene.decor].addScene(scene.numero)
      // Il faut que le décor existe pour que le sous-décor puisse
      // exister, c'est pour ça qu'on le met là.
      if(scene.sous_decor && scene.sous_decor != ''){
        if(undefined === dinst[scene.decor].sousDecor(scene.sous_decor)){
          dinst[scene.decor].addSousDecor(scene.sous_decor)
        }
        dinst[scene.decor].sousDecor(scene.sous_decor).addScene(scene.numero)
      }
    }
  })
  // console.log("Données décors :", dinst)
  return dinst
}

static get count(){
  return Object.keys(this.data).length
}
static forEachDecor(fn){
  for(var decor in this.data){
    if(false === fn(this.data[decor] /* instance FADecor */)) break
  }
}

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

/**
  Boucle avec une fonction sur tous les sous-decors du
  décor.
**/
forEachSousDecor(fn){
  for(var sname in this.sousDecors){
    if(false === fn(this.sousDecors[sname])) break
  }
}

/**
  Boucle avec une fonction sur la liste des scènes du sous-décor
**/
forEachScene(fn){
  for(var num of this.scenes){
    if(false === fn(FAEscene.getByNumero(num))) break
  }
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

/**
  Boucle avec une fonction sur la liste des scènes du sous-décor
**/
forEachScene(fn){
  for(var num of this.scenes){
    if(false === fn(FAEscene.getByNumero(num))) break
  }
}
get scenesCount(){return this.scenes.length}
}
