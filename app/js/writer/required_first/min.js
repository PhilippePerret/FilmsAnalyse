'use strict'
/**
 * Ce module du Writer est le module minimum chargé tout le temps, qui
 * contient les données minimum à connaitre.
 */

/**
 * Données des documents
 * ---------------------
 */
const DATA_DOCUMENTS = {
  introduction:   {hname: 'Introduction', len: 1000}
, synopsis:       {hname: 'Synopsis', len: 1000}
, fondamentales:  {hname: 'Fondamentales', len: 1000}
, au_fil_du_film: {hname: 'Commentaires au fil du film', len: 50000}
, personnages:    {hname: 'Les personnages', len: 1000}
, themes:         {hname: 'Les thèmes', len: 1000}
, lecon_tiree:    {hname: 'La leçon tirée du film', len: 1000}
, conclusion:     {hname: 'Conclusion', len: 500}
, annexes:        {hname: 'Annexes', len: 1000}

}

// Pour les menus
module.exports = DATA_DOCUMENTS
