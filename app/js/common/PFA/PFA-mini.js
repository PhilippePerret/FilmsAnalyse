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
        EXPO:   {hname: 'EXPOSITION', shortHname: 'EXPO.', cZone:'[0,quart]', zone: null, main: true, next: 'DEV1'}
      , preamb: {hname: 'Préambule', shortHname: 'Préamb.', cZone:'[0,huiti]', next:'incPer'}
      , incPer: {hname: 'Incident perburbateur', shortHname: 'Inc.Perturb.', cZone:'[0,douzi]', next:'incDec'}
      , incDec: {hname: 'Incident déclencheur', shortHname: 'Inc.Déc.', cZone:'[iem24,quart-iem24]', next:'zone_r'}
      , zone_r: {hname: 'Zone de refus', shortHname: 'Zone R.', cZone:'["incDec","pivot1"]', next:'pivot1'}
      , pivot1: {hname: 'Pivot 1', shortHname: 'Pvt 1', cZone: '[quart-iem24,quart]', next:'tiers1'}
      , DEV1:   {hname: 'DÉVELOPPEMENT (1ère partie)', shortHname: 'DÉV. Part 1', cZone:'[quart,moiti]', main: true, next: 'DEV2'}
      , tiers1: {hname: 'Premier Tiers', shortHname: '1/3', cZone:'[tiers-iem24,tiers+iem24]', next: 'cledev'}
      , cledev: {hname: 'Clé de voûte', shortHname: 'C.d.V.', cZone:'[moiti-iem24,moiti+iem24]', next: 'tiers2'}
      , DEV2:   {hname: 'DÉVELOPPEMENT (2nde partie)', shortHname: 'DÉV. Part 2', cZone:'[moiti,tresQ]', main: true, next: 'DNOU'}
      , tiers2: {hname: 'Second Tiers', shortHname: '2/3', cZone:'[deuxT-iem24,deuxT+iem24]', next: 'pivot2'}
      , pivot2: {hname: 'Pivot 2', shortHname: 'Pvt 2', cZone:'[tresQ-iem24,tresQ]', next: 'crisis'}
      , DNOU:   {hname: 'DÉNOUEMENT', shortHname: 'DÉNOUE.', cZone:'[tresQ,duree]', main: true, next: null}
      , crisis: {hname: 'Crise', shortHname: 'Crise', cZone:'[tresQ,"climax"]', cZoneAlt:'[tresQ-douzi,tresQ]', next: 'climax'}
      , climax: {hname: 'Climax', shortHname: 'Climax', cZone:'[duree-huiti,duree]', next: 'desine'}
      , desine: {hname: 'Désinence', shortHname:'Désin.', cZone:'["climax",duree]', next: null}
    }
}

module.exports = PFA
