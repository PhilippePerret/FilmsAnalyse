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

static resetAll(){
  delete this._data
  this.resetForSort()
}

static resetForSort(){
  delete this._sortedDecors
  delete this._optionsDecors
}

/**
  Retourne les données des décors, en les prenant dans les
  scènes définies.
**/
static get data(){
  return this._data || defP(this,'_data', this.getDataDecors())
}

/**
  Retourne la liste des décors (instances FADecor) classés par
  nombre de scènes.
**/
static get sortedDecors(){
  if(undefined === this._sortedDecors){
    this._sortedDecors = Object.values(this.data)
    this._sortedDecors.sort((a,b) => b.scenes.length - a.scenes.length)
    // console.log("this._sortedDecors:", this._sortedDecors)
  }
  return this._sortedDecors
}

/**
  Helper retournant la liste des options pour le menu des
  décors
**/
static optionsDecors(){
  if(undefined === this._optionsDecors){
    let my = this
      , sorteds = this.sortedDecors
      // Note : il faut que je prenne sortedDecors ici, sinon
      // il initialise la propriété _optionDecors ci-dessous ce qui
      // fait qu'il se retrouve indefinie dans la boucle for

    my._optionsDecors = ['<option value="">Choisir…</option>']
    for(var decor of sorteds){
      my._optionsDecors.push(`<option value="${decor.name}">${decor.name}</option>`)
    }
    my._optionsDecors = my._optionsDecors.join('')
  }
  return this._optionsDecors
}


/**
  Méthode appelée à la création ou la modification
  d'une scène pour voir si le décor ou le sous-décor existent
  déjà, si la scène appartient à l'un d'eux, etc., afin de
  garder à jour les positions, etc.
**/
static checkDecorOfScene(scene){
  var updateRequired = false
  if(!scene.decor || scene.decor === ''){
    return
  } else if(undefined === this.data[scene.decor]){
    // <= les décors ne connaissent pas ce décor
    // => C'est un nouveau décor qu'il faut créer
    //    Ça consiste à actualiser les données
    updateRequired = true
  } else {
    // <= Ce décor existe
    // => Il faut voir si la scène appartient déjà à ce
    //    décor et l'ajouter le cas échéant
    //    TODO : il faudrait aussi voir si la scène appartenanit
    //    à un autre décor avant.
    if(this.data[scene.decor].scenes.indexOf(scene.numero) < 0){
      // <= Le décor ne possède pas encore cette scène
      // => Il faut ajouter cette scène au décor
      //    Ça consiste à actualiser les données
      updateRequired = true
    }
    // Pour le sous-decor
    if(scene.sous_decor && scene.sous_decor !== ''){
      if(undefined === this.data[scene.decor].sousDecors[scene.sous_decor]){
        // <= Le décor ne connait pas ce sous-décor
        // => Il faut actualiser les données
        updateRequired = true
      } else if (this.data[scene.decor].sousDecors[scene.sous_decor].scenes.indexOf(scene.numero) < 0) {
        // <= Le sous-décor ne possède pas cette scène
        // => Il faut actualiser les données
        updateRequired = true
      }
    }
  }
  updateRequired && this.resetAll()
  // On actualise tout de suite les données, surtout pour voir dans le
  // log
  this.data
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
//  INSTANCE FADecor

constructor(name, data){
  this.name       = name
  this.data       = data
  this.scenes     = []
  this.sousDecors = {}
}

/**
  Ajoute la scène de numéro +numero+

  @param {Number} numero  Numéro de la scène
**/
addScene(numero){
  this.scenes.push(numero)
  FADecor.resetForSort() // pour recalculer le classement
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
  this.resetForSort()
  this.sousDecors[name] = new FASousDecor(this, name, data)
  return this.sousDecors[name]
}

reset(){
  this.resetForSort()
}

resetForSort(){
  delete this._sousDecorsSorted
  delete this._optionsSousDecors
}

get sousDecorsSorted(){
  if(undefined === this._sousDecorsSorted){
    this._sousDecorsSorted = Object.values(this.sousDecors)
    this._sousDecorsSorted.sort((a,b) => b.scenesCount - a.scenesCount)
  }
  return this._sousDecorsSorted
}

optionsSousDecors(){
  if(undefined === this._optionsSousDecors){
    this._optionsSousDecors = ['<option value="">Choisir le sous-décor…</option>']
    for(var sdecor of this.sousDecorsSorted){
      this._optionsSousDecors.push(`<option value="${sdecor.name}">${sdecor.name}</option>`)
    }
    this._optionsSousDecors = this._optionsSousDecors.join('')
  }
  return this._optionsSousDecors
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


// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------


class FASousDecor {

// ---------------------------------------------------------------------
//  INSTANCE FASousDecor

constructor(decor, name, data){
  this.decor  = decor
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
  this.decor.resetForSort()
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
