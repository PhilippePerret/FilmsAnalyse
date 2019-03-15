'use strict'

const PFA = {
    class: 'PFA'
  , DATA_STT_NODES: {
        // TODO : Faire plutôt des instances de SttNode
        // cZone définit le calcul de la zone où le noeud peut se trouver
        // Noter qu'on peut indiquer "<identifiant>" pour ne pas préciser un
        // temps mais préciser le noeud qui servira de fin ou de début
        // Dans ces cas-là, une troisième donnée peut être fournie, dans le cas
        // où le noeud ne serait pas défini.
        EXPO:   {hname: 'EXPOSITION', shortHname: 'EXPO.', cZone:'[0,quart]', zone: null}
      , preamb: {hname: 'Préambule', shortHname: 'Préamb.', cZone:'[0,huiti]'}
      , incPer: {hname: 'Incident perburbateur', shortHname: 'Inc.Perturb.', cZone:'[0,douzi]'}
      , incDec: {hname: 'Incident déclencheur', shortHname: 'Inc.Déc.', cZone:'[iem24,quart-iem24]'}
      , zone_r: {hname: 'Zone de refus', shortHname: 'Zone R.', cZone:'["incDec","pivot1",quart-huiti,quart]'}
      , pivot1: {hname: 'Pivot 1', shortHname: 'Pvt 1', cZone: '[quart-iem24,quart]'}
      , DEV1:   {hname: 'DÉVELOPPEMENT (1ère partie)', shortHname: 'DÉV. Part 1', cZone:'[quart,moiti]'}
      , tiers1: {hname: 'Premier Tiers', shortHname: '1/3', cZone:'[tiers-iem24,tiers+iem24]'}
      , cledev: {hname: 'Clé de voûte', shortHname: 'C.d.V.', cZone:'[moiti-iem24,moiti+iem24]'}
      , DEV2:   {hname: 'DÉVELOPPEMENT (2nde partie)', shortHname: 'DÉV. Part 2', cZone:'[moiti,tresQ]'}
      , tiers1: {hname: 'Second Tiers', shortHname: '2/3', cZone:'[deuxT-iem24,deuxT+iem24]'}
      , pivot2: {hname: 'Pivot 2', shortHname: 'Pvt 2', cZone:'[tresQ-iem24,tresQ]'}
      , DENOU:  {hname: 'DÉNOUEMENT', shortHname: 'DÉNOUE.', cZone:'[tresQ,duree]'}
      , crisis: {hname: 'Crise', shortHname: 'Crise', cZone:'[tresQ,"climax"]', cZoneAlt:'[tresQ-douzi,tresQ]'}
      , climax: {hname: 'Climax', shortHname: 'Climax', cZone:'[duree-huiti,duree]'}
      , desine: {hname: 'Désinence', shortHname:'Désin.', cZone:'["climax",duree]'}
    }

    /**
     * Méthode qui calcule les positions absolues des noeuds et parties en
     * fonction du temps du film.
     */
  , calcAbsolutePositions:function(){
      console.log("-> calcAbsolutePositions")
      if(undefined === current_analyse.duration) return

      // Durée et divisions, pour calculer les zones des Nœuds
      var duree = current_analyse.duration // nom plus court + calcul
      var moiti = parseInt(duree/2,10)
      var quart = parseInt(duree/4,10)
      var tresQ = parseInt(3*duree/4,10)
      var huiti = parseInt(duree/8,10)
      var douzi = parseInt(duree/12,10)
      var iem24 = parseInt(duree/24,10)
      var tiers = parseInt(duree/3,10)
      var deuxT = parseInt(2*duree/3,10)

      for(var nid in this.DATA_STT_NODES){
        var node = this.DATA_STT_NODES[nid]
        node.zone = eval(node.cZone)
        if(node.cZoneAlt) node.zoneAlt = eval(node.cZoneAlt)
      }
      console.log(this.DATA_STT_NODES)
    }

}
Object.defineProperties(PFA,{
    //Retourne la class SttNode de l'incident perturbateur
    incPer:{
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
