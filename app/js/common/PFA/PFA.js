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
    , node:function(nid){
        if(undefined === this.nodes) this.nodes = {}
        if(undefined === this.nodes[nid]){
          this.nodes[nid] = new SttNode(nid, this.DATA_STT_NODES[nid])
        }
        return this.nodes[nid]
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
    // ---------------------------------------------------------------------
    //  Méthodes de calculs

})
Object.defineProperties(PFA,{
    modified:{
        get:function(){return this._modified}
      , set:function(v){this._modified = v}
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
