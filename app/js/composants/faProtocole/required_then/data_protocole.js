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
    , {id:'collecte-stt', libelle:'Collecte des éléments structurels'}
    , {id:'collecte-dyna', libelle:'Collecte des éléments de Dynamique narrative'}
    , {id:'collecte-events', libelle:'Collecte de tous les events'}
    ]}
  , {id:'reflexion-lecon', libelle:'Réflexion sur le choix de la leçon tirée du film.'}

  , {type:'separator'}

  , {id:'documents-required', libelle:'Documents obligés', steps:[
      {id:'fondamentales', libelle: 'Les Fondamentales'}
    , {id:'pfa', libelle: 'Le Paradigme de Field Augmenté'}
    , {id:'qrd', libelle: 'Le Diagramme Dramatique'}
    , {id:'diagramme-dynamique', libelle: 'Le Diagramme Dynamique'}
    ]}

  , {type:'separator'}

  , {id:'documents-ebauches', libelle:'Ébauches de documents', steps:[
      {id:'ebauche-synopsis', libelle: 'Ébauche du synopsis'}
    , {id:'ebauche-introduction', libelle: 'Ébauche de l’Introduction'}
    , {id:'ebauche-personnages', libelle: 'Ébauche du chapitre Personnages'}
    , {id:'ebauche-themes', libelle: 'Ébauche du chapitre sur les thèmes'}
    , {id:'ebauche-lecon', libelle: 'Ébauche Leçon tirée du film'}
    ]}

  , {type:'separator'}

  , {id:'comments-stats', libelle:'Commentaires sur les statistiques'}
  , {id:'finalisation-introduction', libelle: 'Finalisation de l’introduction'}
  , {id:'finalisation-personnages', libelle:'Finalisation chapitre personnages'}
  , {id:'finalisation-themes', libelle:'Finalisation chapitre thèmes'}
  , {id:'finalisation-lecon-tiree', libelle:'Finalisation de la Leçon tirée du film'}
  , {id:'redaction-conclusion', libelle: 'Rédaction de la conclusion'}

  , {type:'separator'}

  , {id:'relecture', libelle:'Relecture complète'}
  , {id:'correction', libelle:'Correction complète du document'}
  , {id:'building-script', libelle:'Établissement du script d’assemblage'}

  , {type:'separator'}

  , {id: 'finalisation-cover', libelle: 'Finalisation de la couverture'}
  , {id: 'finalisation-ebook', libelle: 'Finalisation des eBooks'}
  , {id: 'publication', libelle:'Publication'}

  ]//FIn des steps
}
