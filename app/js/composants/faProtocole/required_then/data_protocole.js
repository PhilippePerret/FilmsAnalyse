'use strict'
/**

  Données d'un protocole d'analyse

**/
FAProtocole.DATA = {
  steps:[
    {id:'infos-film', libelle: "Informations complètes sur le film (réalisateur, scénariste, etc.)"}
  , {id:'full-collecte', libelle: 'Collecte complète', steps: [
      {id:'collecte-scenes', libelle: 'Collecte des scènes'}
    , {id:'collecte-procedes', libelle: 'Collecte des procédés'}
    , {id:'collecte-events', libelle:'Collecte de tous les events'}
    ]}

  , {type:'separator'}

  , {id:'documents-required', libelle:'Documents obligés', steps:[
      {id:'fondamentales', libelle: 'Les Fondamentales'}
    , {id:'pfa', libelle: 'Le Paradigme de Field Augmenté'}
    , {id:'synopsis', libelle: 'Le Synopsis'}
    , {id:'qrd', libelle: 'Le Diagramme Dramatique'}
    , {id:'diagramme-dynamique', libelle: 'Le Diagramme Dynamique'}
    ]}

  , {type:'separator'}

  , {id:'redaction-introduction', libelle: 'Rédaction de l’introduction'}
  , {id:'redaction-personnages', libelle:'Chapitre sur les personnages'}
  , {id:'redaction-themes', libelle:'Chapitre sur les thèmes'}
  , {id:'lecon-tiree', libelle:'Rédaction de la Leçon tirée du film'}
  , {id:'redaction-conclusion', libelle: 'Rédaction de la conclusion'}

  , {type:'separator'}

  , {id: 'correction', libelle: 'Correction complète du document'}
  , {id: 'building-script', libelle: 'Établissement du script d’assemblage'}

  , {type:'separator'}

  , {id: 'finalisation-cover', libelle: 'Finalisation de la couverture'}
  , {id: 'finalisation-ebook', libelle: 'Finalisation des eBooks'}
  , {id: 'publication', libelle:'Publication'}

  ]//FIn des steps
}
