'use strict'
/**
 * Ce module du FAWriter est le module minimum chargé tout le temps, qui
 * contient les données minimum à connaitre.
 */

/**
 * Données des documents
 * ---------------------
 *
 *  Note : le +format+ doit correspondre impérativement à l'extension du
 *  fichier et du fichier modèle.
 *
 * Le `type` va définir s'il s'agit d'un document contenant des données, comme
 * les informations sur le film ou les fondamentales (type 'data'), OU alors
 * un « vrai » document, en markdown, qui sera affiché dans l'analyse.
 *
 * Les deux types doivent être séparés car ils seront séparés dans les
 * menus.
 */
const DATA_DOCUMENTS = {

  diminutifs:       {hname: 'Diminutifs', len:0, format:'yaml', type:'data'}
, snippets:         {hname: 'Snippets', len:0, format:'yaml', type:'data'}
, building_script:  {hname: 'Script d’assemblage', len:0, format:'md', type:'data'}

, separator1: 'separator'

, infos:            {hname: 'Informations', len: 1000, format: 'yaml', type:'data'}
, fondamentales:    {hname: 'Fondamentales', len: 1000, format: 'yaml', type:'data'}

, separator2: 'separator'

, introduction:     {hname: 'Introduction', len: 1000, type: 'real'}
, synopsis:         {hname: 'Synopsis', len: 1000, type: 'real'}
, au_fil_du_film:   {hname: 'Commentaires au fil du film', len: 50000, type: 'real'}
, personnages:      {hname: 'Les personnages', len: 1000, type: 'real'}
, themes:           {hname: 'Les thèmes', len: 1000, type: 'real'}
, lecon_tiree:      {hname: 'La leçon tirée du film', len: 1000, type: 'real'}
, conclusion:       {hname: 'Conclusion', len: 500, type: 'real'}
, annexes:          {hname: 'Annexes', len: 1000, type: 'real'}

}

// Pour les menus
module.exports = DATA_DOCUMENTS
