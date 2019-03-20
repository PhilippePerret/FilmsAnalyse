'use strict'

const PFA = {
    class: 'PFA'
  , DATA_STT_NODES: {
        // cZone définit le calcul de la zone où le noeud peut se trouver
        // Noter qu'on peut indiquer "<identifiant>" pour ne pas préciser un
        // temps mais préciser le noeud qui servira de fin ou de début
        // Dans ces cas-là, une troisième donnée peut être fournie, dans le cas
        // où le noeud ne serait pas défini.
        EXPO:   {hname: 'EXPOSITION', shortHname: 'EXPO.', cZone:'[0,quart]', zone: null}
      , preamb: {hname: 'Préambule', shortHname: 'Préamb.', cZone:'[0,huiti]'}
      , incPer: {hname: 'Incident perburbateur', shortHname: 'Inc.Perturb.', cZone:'[0,douzi]'}
      , incDec: {hname: 'Incident déclencheur', shortHname: 'Inc.Déc.', cZone:'[iem24,quart-iem24]'}
      , zone_r: {hname: 'Zone de refus', shortHname: 'Zone R.', cZone:'["incDec","pivot1"]'}
      , pivot1: {hname: 'Pivot 1', shortHname: 'Pvt 1', cZone: '[quart-iem24,quart]'}
      , DEV1:   {hname: 'DÉVELOPPEMENT (1ère partie)', shortHname: 'DÉV. Part 1', cZone:'[quart,moiti]'}
      , tiers1: {hname: 'Premier Tiers', shortHname: '1/3', cZone:'[tiers-iem24,tiers+iem24]'}
      , cledev: {hname: 'Clé de voûte', shortHname: 'C.d.V.', cZone:'[moiti-iem24,moiti+iem24]'}
      , DEV2:   {hname: 'DÉVELOPPEMENT (2nde partie)', shortHname: 'DÉV. Part 2', cZone:'[moiti,tresQ]'}
      , tiers2: {hname: 'Second Tiers', shortHname: '2/3', cZone:'[deuxT-iem24,deuxT+iem24]'}
      , pivot2: {hname: 'Pivot 2', shortHname: 'Pvt 2', cZone:'[tresQ-iem24,tresQ]'}
      , DNOU:   {hname: 'DÉNOUEMENT', shortHname: 'DÉNOUE.', cZone:'[tresQ,duree]'}
      , crisis: {hname: 'Crise', shortHname: 'Crise', cZone:'[tresQ,"climax"]', cZoneAlt:'[tresQ-douzi,tresQ]'}
      , climax: {hname: 'Climax', shortHname: 'Climax', cZone:'[duree-huiti,duree]'}
      , desine: {hname: 'Désinence', shortHname:'Désin.', cZone:'["climax",duree]'}
    }
}

module.exports = PFA
