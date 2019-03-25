'use strict'

const PFA = require('./PFA-mini')
Object.assign(PFA, {
    class: 'PFA'
  // ---------------------------------------------------------------------
  //  Méthodes de données

    /**
     * Retourne l'instance SttNode du noeud d'identifiant +nid+
     *
     * Note : +nid+ est une des clés de DATA_STT_NODES (cf. ci-dessus)
     */
  , node(nid){
      if(undefined === this.nodes) this.nodes = {}
      if(undefined === this.nodes[nid]){
        this.nodes[nid] = new SttNode(nid, this.DATA_STT_NODES[nid])
      }
      return this.nodes[nid]
    }

    /**
    * Boucle sur tous les nœuds structurels
    *
    * On peut interrompre la boucle en renvoyant false (et très exactement
    * false)
    **/
  , forEachNode(method){
      var kstt
      for(kstt in this.DATA_STT_NODES){ if (false === method(this.node(kstt))) break}
  }

  // ---------------------------------------------------------------------
  //  Méthodes d'entrée sorties
  , saveIfModified:function(){
      this.modified && this.save()
    }
  , save:function(){
      F.error("La procédure d'enregistrement du PFA n'est pas encore implémentée")
      return new Promise((ok,ko) => {
        ok()
      })
    }

  // Méthodes d'affichage
  , display(){
      console.log("-> PFA.display")
      if(!this.built) this.build().observe()
      console.log("<- PFA.display")
    }

  // ---------------------------------------------------------------------
  //  Méthodes de construction

  /**
   * Méthode principale de construction du PFA du film.
   */
, build(){
    require('./PFA_building.js').bind(this)()
    document.body.appendChild(this._output)
    this.built = true
    return this // chainage
  }
// ---------------------------------------------------------------------
//  Méthodes de calculs

, observe(){
    // On colle un FATimeline
    var tml = new FATimeline(this.jqObj[0])
    tml.init({height:40, only_slider_sensible: true})

    // On rend le PFA draggable
    this.jqObj.draggable()
}
})
Object.defineProperties(PFA,{
  jqObj:{
    get(){return this._jqObj||defP(this,'_jqObj',$('#pfas'))}
  }
, modified:{
    get(){return this._modified}
  , set(v){this._modified = v}
}
  //Retourne la class SttNode de l'incident perturbateur
, incPer:{
      get:function(){return this._incPer}
    , set:function(e){this._incPer = e}
  }
// Retourne l'incident déclencheur, comme SttNode
, incDec:{
      get:function(){return this._incDec}
    , set:function(e){this._incDec = e}
  }
})


module.exports = PFA
