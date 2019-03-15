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
    if(undefined === current_analyse.duration) return
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
      z[0] = refNode.endAt || refNode.zoneEnd
      // On indique la dépendance, pour reseter en cas de redéfinition
      refNode.dependencies.push(sttnode.id)
    }
    if('string' === typeof z[1]){
      refNode = current_analyse.PFA.node(z[1])
      z[1] = refNode.startAt || refNode.zoneStart
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
    this.id = nid
    for(var p in data){this[`_${p}`] = data[p]}
    // Par exemple, on définit `this._cZone`

    // Les nœuds dépendants de ce noeud (au niveau des temps). Ils seront
    // définis dans la méthode de classe `calcZone`
    this.dependencies = []
  }


  // ---------------------------------------------------------------------
  //  Méthodes de données fixes (absolues)

  get hname(){ return this._hname }
  get shortHname(){return this._shortHname}
  get cZone(){ return this._cZone }


  // ---------------------------------------------------------------------
  //  Méthodes de données relatives (du film courant)

  /**
   * ID de l'event associé
   */
  // Note : pas de `set`, on utilise `this.event = `
  get event_id(){ return this._event_id}

  get startAt() { return this._startAt }
  set startAt(v){ this._startAt = v ; this.resetDependencies() }
  get endAt()   { return this._endAt }
  set endAt(v)  { this._endAt = v ; this.resetDependencies() }

  // ---------------------------------------------------------------------
  //  Méthodes de données volatiles

  get modified(){return this._modified }
  set modified(v){this._modified = true ; current_analyse.PFA.modified = true }

  reset(props){
    if(undefined===props)props=['zone']
    for(var i=0,len=props.length;i<len;++i){this[`_${props[i]}`] = undefined}
  }

  get zone(){return this._zone || defineP(this,'_zone',SttNode.calcZone(this))}

  get zoneStart() { return this.zone[0] }
  get zoneEnd()   { return this.zone[1] }

  get scene(){ return this._scene }

  get event(){return this._event || defineP(this,'_event',current_analyse.ids[this.event_id])}
  set event(v){this._event = v ; this._event_id = v.id ; this.modified = true }

  resetDependencies(){
    for(var i=0,len = this.dependencies.length;i<len;++i){
      current_analyse.PFA.node(this.dependencies[i]).reset(['zone'])
    }
    this.modified = true
  }

  // ---------------------------------------------------------------------
  // Méthodes de calculs


}


module.exports = SttNode
