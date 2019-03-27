'use strict'

/**
 *  Class SttNode
 *  ----------------
 *  Pour la gestion des noeud structurels
 */
class SttNode {

  // ---------------------------------------------------------------------
  //  CLASS

  // Calcule et retourne la zone à partir du String +czone+
  // Cf. comment +czone+ est défini dans PFA.DATA_STT_NODES
  //
  // +nid+ sert uniquement pour les dépendances
  static calcZone(sttnode){
    var czone = sttnode.cZone
    // Durée et divisions, pour calculer les zones des Nœuds
    var duree = this._duree || this.initDuree('duree', current_analyse.duration)
    var moiti = this._moiti || this.initDuree('moiti', duree/2)
    var quart = this._quart || this.initDuree('quart', duree/4)
    var tresQ = this._tresQ || this.initDuree('tresQ', 3*duree/4)
    var huiti = this._huiti || this.initDuree('huiti', duree/8)
    var douzi = this._douzi || this.initDuree('douzi', duree/12)
    var iem24 = this._iem24 || this.initDuree('iem24', duree/24)
    var tiers = this._tiers || this.initDuree('tiers', duree/3)
    var deuxT = this._deuxT || this.initDuree('deuxT', 2*duree/3)

    var z = eval(czone)

    /*
    * Les deux valeurs de z peut être soit des nombres, soit des
    * string. Quand ce sont des strings, ils font références à d'autres
    * noeuds qui doivent donner leur position, soit de façon absolue (si non
    * définis) soit de façon relative (si défini)
    * [2] Si les valeurs sont identiques (ce qui arrive, on élargit la zone d'un
    * 12ième de chaque côté)
    */
    var refNode
    if('string' === typeof z[0]){
      refNode = current_analyse.PFA.node(z[0])
      z[0] = refNode.endAtRel || refNode.endAtAbs
      // On indique la dépendance, pour reseter en cas de redéfinition
      refNode.dependencies.push(sttnode.id)
    }
    if('string' === typeof z[1]){
      refNode = current_analyse.PFA.node(z[1])
      z[1] = refNode.startAtRel || refNode.startAtAbs
      refNode.dependencies.push(sttnode.id)
    }
    // [2]
    if(z[0] == z[1]){
      z[0] = z[0] - iem24
      z[1] = z[1] + iem24
    }
    return z
  }
  static initDuree(kduree, value){
    this[`_${kduree}`] = parseInt(value,10)
    return value
  }


// ---------------------------------------------------------------------
//  INSTANCE

constructor(nid, data){
  if(undefined == nid) throw("ERREUR: Impossible d'instancier un SttNode sans identifiant de structure")
  this.id = nid
  // console.log("data:", data)
  for(var p in data){this[`_${p}`] = data[p]}
  // Par exemple, on définit `this._cZone`

  // Les nœuds dépendants de ce noeud (au niveau des temps). Ils seront
  // définis dans la méthode de classe `calcZone`
  this.dependencies = []

  this.renseignePFA()

}

renseignePFA(){
  if (this.next){
    if(undefined === this.pfa.nodes[this.next]){
      current_analyse.PFA.DATA_STT_NODES[this.next].previous = this.id
    } else {
      current_analyse.PFA.node(this.next)._previous = this.id
    }
  }

  if (this.first){
    if(undefined === current_analyse.PFA.nodes[this.first]){
      current_analyse.PFA.DATA_STT_NODES[this.first].last = this.id
    } else {
      current_analyse.PFA.node(this.first)._last = this.id
    }
  }
}

// ---------------------------------------------------------------------
// Méthodes d'Helper

/**
* Méthode qui retourne l'élément DOM pour ce noeud
* en version absolue, d'après un coefficiant +coef+
**/
inAbsPFA(coefT2P){
  return DCreate('SPAN', {
    class: `pfa-part-${this.isMainPart?'part':'zone'}`
  , style: `left:${this.leftAbs(coefT2P)};width:${this.widthAbs(coefT2P)};`
  , append: [this.aSpanName]
  })
}

inRelPFA(coefT2P){
  if(false === this.isDefined) return null
  return DCreate('SPAN', {
    class: `pfa-part-${this.isMainPart?'part':'zone'} ${this.markGoodPos /* inzone, outzone, nearzone */}`
  , style: `left:${this.leftRel(coefT2P)};width:${this.widthRel(coefT2P)};`
  , append: this.aSpanName
  , attrs:{onclick: `current_analyse.editEvent(${this.event_id})`}
  })
}

leftAbs(coef){return this._leftAbs||defP(this,'_leftAbs', `${parseInt(this.startAtAbs * coef,10)}px`)}
widthAbs(coef){return this._widthAbs||defP(this,'_widthAbs', `${parseInt((this.endAtAbs - this.startAtAbs) * coef,10)}px`)}

leftRel(coef){return this._leftRel||defP(this,'_leftRel', `${parseInt(this.startAtRel * coef,10)}px`)}
widthRel(coef){return this._widthRel||defP(this,'_widthRel', `${parseInt((this.endAtRel - this.startAtRel) * coef,10)}px`)}


/**
* Retourne un SPAN pour le nom du noeud.
* Noter qu'il faut faire des instances différentes pour chaque partie.
**/
get aSpanName(){
  return DCreate('SPAN', {class:'name', inner: this.isMainPart?this.hname:this.shortHname})
}


// ---------------------------------------------------------------------
//  Méthodes de données fixes (absolues)

get hname(){ return this._hname }
get shortHname(){return this._shortHname}
get cZone(){ return this._cZone }
get tolerance(){return this._tolerance}
// True si c'est un noeud qui définit une main-part, c'est-à-dire
// l'exposition, le développement ou le dénouement.
get main(){return this._main}
// ID du noeud structurel suivant
// Note : il y a deux niveaux, les main-parts et les sub-parts
get next(){return this._next}
get previous(){return this._previous}
// Pour gérer les boucles sur tous les noeuds, on utilise cette propriété
// pour indiquer de où il faut repartir quand on arrive au dernier mot. Pour
// le dénouement, cette propriété vaut 'EXPO' et pour la desinence, elle vaut
// 'preamb'
get first(){return this._first}
// Idem, mais à l'envers
get last(){return this._last}

// Début et fin absolus
get startAtAbs(){return this.zoneStart}
get endAtAbs()  {return this.zoneEnd}

// Début et fin relatifs, en fonction des noeuds définis, s'ils
// le sont. Cf. defineStartRel et defineEndRel
get startAtRel(){
  return this._startAtRel || defP(this,'_startAtRel', this.defineStartRel())}
set startAtRel(v){
  this._startAtRel = v ; this.resetDependencies() }
get endAtRel(){
  return this._endAtRel || defP(this,'_endAtRel', this.defineEndRel())}
set endAtRel(v){
  this._endAtRel = v ; this.resetDependencies()
}

// ---------------------------------------------------------------------
// Méthodes d'état

// Retourne true si le noeud relatif est défini
get isDefined(){ return undefined !== this._event_id }

get markGoodPos(){
  switch (true) {
    case this.isInZone:
      return 'inzone'
    case this.isNearZone:
      return 'nearzone'
    case this.isOutZone:
      return 'outzone'
  }
}


get isInZone()  {return this._isInZone || defP(this,'_isInZone',this.defineGoodPos().in)}
get isOutZone() {return this._isOutZone || defP(this,'_isOutZone',this.defineGoodPos().out)}
get isNearZone(){return this._isNearZone || defP(this,'_isNearZone',this.defineGoodPos().near)}

// Retourne true si le noeud relatif est défini et qu'il se
// trouve dans la zone définie, avec la tolérance acceptée
defineGoodPos(){
  var to, vStart, vEnd, diff, som

  if(!this.isDefined) return // forcément
  to = this.tolerance
  var vStart = 0
  if(this.startAtRel >= this.startAtAbs){
    vStart = 2
  } else {
    diff = this.startAtAbs - this.startAtRel
    if(to === 'none'){
      vStart = 0
    } else if(to === 'before'){
      vStart = 1
    } else if (to === '24ieme' && diff < this.pfa.ieme24){
      vStart = 1
    } else {
      vStart = 0
    }
  }

  var vEnd = 0
  if(this.endAtRel <= this.endAtAbs){
    vEnd = 2
  } else {
    diff = this.endAtRel - this.endAtAbs
    if(to === 'none'){
      vEnd = 0 // on confirme
    } else if (to === 'after'){
      vEnd = 1
    } else if (to === '24ieme' && diff < this.pfa.ieme24){
      vEnd = 1
    } else {
      vEnd = 0
    }
  }

  som = vStart + vEnd
  this._isOutZone   = vStart === 0 || vEnd === 0
  this._isInZone    = som === 4
  this._isNearZone  = this._isOutZone === false && this._isInZone === false


  return {in: this._isInZone, out: this._isOutZone, near: this._isNearZone}
}

// ---------------------------------------------------------------------
//  Méthodes de données relatives (du film courant)

/**
 * ID de l'event associé, s'il est défini
 */
// Note : pas de `set`, on utilise `this.event = `
get event_id(){ return this._event_id}

// ---------------------------------------------------------------------
//  Méthodes de données absolues

get zone(){return this._zone || defP(this,'_zone',SttNode.calcZone(this))}
get zoneStart() { return this.zone[0] }
get zoneEnd()   { return this.zone[1] }

// ---------------------------------------------------------------------
//  Méthodes de données volatiles

get modified(){return this._modified }
set modified(v){this._modified = true ; this.pfa.modified = true }

get scene(){ return this._scene }

get event(){return this._event || defP(this,'_event', this.defineEventIfExists())}
set event(v){
  this._event = v
  this._event_id = v ? v.id : undefined
  this.resetDependencies()
  this.modified = true
}
defineEventIfExists(){
  if(undefined === this._event_id) return undefined
  else return this.a.ids[this.event_id]
}

get isMainPart(){return this._isMainPart || defP(this,'_isMainPart', this.main === true)}

// ---------------------------------------------------------------------
//  Méthodes fonctionnelles

reset(props){
  if(undefined===props)props=['zone']
  for(var i=0,len=props.length;i<len;++i){this[`_${props[i]}`] = undefined}
}

resetDependencies(){
  for(var i=0,len = this.dependencies.length;i<len;++i){
    this.pfa.node(this.dependencies[i]).reset(['zone'])
  }
  this.modified = true
}

// ---------------------------------------------------------------------
// Méthodes fonctionnelles
/**
* Retourne le début et la fin relatives du noeud, si le noeud
* relatif est défini.
**/
defineStartRel(){
  if(!this.isDefined) return null
  return this.event.startAt
}
defineEndRel(){
  if(!this.isDefined) return null
  return this.event.endAt

}

get a(){return current_analyse}

get pfa(){ return this.a.PFA}

}


module.exports = SttNode
