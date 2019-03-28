'use strict'
/**
* Données minimales qui peuvent être chargées lorsqu'on ne charge pas
* tout le module.
**/
const PFA = {
  class: 'PFA'
, DATA_STT_NODES: {
      // cZone définit le calcul de la zone où le noeud peut se trouver
      // Noter qu'on peut indiquer "<identifiant>" pour ne pas préciser un
      // temps mais préciser le noeud qui servira de fin ou de début
      // Dans ces cas-là, une troisième donnée peut être fournie, dans le cas
      // où le noeud ne serait pas défini.
      /**
      *
      * Détail des propriétés
      * ----------------------
      *   Note : NRC signifie « Noeud Relatif Correspondant »
      *   tolerance   Cette propriété définit la différence qu'il peut y
      *               avoir, au niveau du positionnement temporel, entre le
      *               noeud absolu et le NRC.
      *               Cette propriété est obligatoire.
      *               Les valeurs possibles sont les suivants :
      *               'none'      Le NRC doit se trouver exactement dans la
      *                           zone absolue définie.
      *               'before'    Le NRC peut se trouver avant la zone définie
      *               'after'     Le NRC peut terminer après la zone absolue
      *               '24ieme'    Le NRC peut se trouver à plus ou moins le
      *                           24e de temps de distance, au début et/ou à
      *                           la fin de la zone absolue.
      *
      **/
      EXPO:   {hname: 'EXPOSITION', shortHname: 'EXPO.', cZone:'[0,quart]', zone: null, main: true, next: 'DEV1', tolerance: '24ieme'}
    , preamb: {hname: 'Préambule', shortHname: 'Préamb.', cZone:'[0,iem24]', next:'incPer', tolerance: 'after'}
    , incPer: {hname: 'Incident perburbateur', shortHname: 'Inc.Pert.', cZone:'[iem24,douzi]', next:'incDec', tolerance: 'before'}
    , incDec: {hname: 'Incident déclencheur', shortHname: 'Inc.Déc.', cZone:'[douzi,quart-douzi]', next:'zone_r', tolerance: 'before'}
    , zone_r: {hname: 'Zone de refus', shortHname: 'Zone R.', cZone:'[quart-douzi-50,quart-50]', next:'pivot1', tolerance: 'before'}
    , pivot1: {hname: 'Pivot 1', shortHname: 'Pvt 1', cZone: '[quart-iem24,quart]', next:'actio1', tolerance: 'none'}
    , DEV1:   {hname: 'DÉVELOPPEMENT (1ère partie)', shortHname: 'DÉV. Part 1', cZone:'[quart,moiti]', main: true, next: 'DEV2', tolerance: '24ieme'}
    , actio1: {hname: 'Première action', shortHname: '1ère action', cZone:'[quart,quart+iem24]', next:'tiers1', tolerance:'none'}
    , tiers1: {hname: 'Premier Tiers', shortHname: '1/3', cZone:'[tiers-iem24,tiers+iem24]', next: 'cledev', tolerance:'none'}
    , cledev: {hname: 'Clé de voûte', shortHname: 'C.d.V.', cZone:'[moiti-iem24,moiti+iem24]', next: 'tiers2', tolerance:'none'}
    , DEV2:   {hname: 'DÉVELOPPEMENT (2nde partie)', shortHname: 'DÉV. Part 2', cZone:'[moiti,tresQ]', main: true, next: 'DNOU', tolerance: '24ieme'}
    , tiers2: {hname: 'Second Tiers', shortHname: '2/3', cZone:'[deuxT-iem24,deuxT+iem24]', next: 'pivot2', tolerance:'none'}
    , pivot2: {hname: 'Pivot 2', shortHname: 'Pvt 2', cZone:'[tresQ-iem24,tresQ]', next: 'crisis', tolerance: 'none'}
    , DNOU:   {hname: 'DÉNOUEMENT', shortHname: 'DÉNOUE.', cZone:'[tresQ,duree]', main: true, next: null, first: 'EXPO', tolerance: '24ieme'}
    , crisis: {hname: 'Crise', shortHname: 'Crise', cZone:'[tresQ+iem24,duree-huiti]', next: 'climax', tolerance:'before'}
    , climax: {hname: 'Climax', shortHname: 'Climax', cZone:'[duree-huiti,duree-iem24]', next: 'desine', tolerance:'after'}
    , desine: {hname: 'Désinence', shortHname:'Désin.', cZone:'[duree-iem24,duree]', next: null, first: 'preamb', tolerance:'none'}
  }
, MAIN_STTNODES:  ['incDec', 'pivot1', 'cledev', 'pivot2', 'climax']
, SUB_STTNODES:   ['preamb', 'incPer', 'zone_r', 'actio1', 'tiers1', 'tiers2', 'crisis', 'desine']
}

module.exports = PFA
