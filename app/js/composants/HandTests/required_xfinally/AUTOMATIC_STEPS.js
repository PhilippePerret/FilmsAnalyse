'use strict'

Object.assign(HandTestStep.prototype,{
  /**
    @return {Boolean} true si c'est une étape automatique
  **/
  isAutomaticStep(){
    this.dataAutomaticStep = DATA_AUTOMATIC_STEPS[this.command.toLowerCase()]
    if (undefined === this.dataAutomaticStep) return false
    if('string' === typeof this.dataAutomaticStep /* un "alias" */){
      this.dataAutomaticStep = DATA_AUTOMATIC_STEPS[this.dataAutomaticStep]
    }
    return true
  }
  /**
    Exécute l'opération automatique et retourne le résultat
    `this.dataAutomaticStep` contient les données de l'étape automatique, notamment
    ce qu'il y a à faire
    @return {Boolean} True si c'est un succès, False otherwise.
  **/
, execAndTest(){
    var pas, res
    try {
      for(pas of this.dataAutomaticStep){
        res = eval(pas.exec)
        if(pas.expected != '---nothing---'){
          res === pas.expected || raise(pas.error.replace(/\%\{res\}/g, res))
        }
      }
      return true
    } catch (e) {
      console.error(e)
      F.error(e)
      return false
    }
  }
})

const DATA_AUTOMATIC_STEPS = {
  "ouvrir l'app": [
    {exec: '"undefined"!==typeof(FAnalyse)', expected: true, error: 'FAnalyse devrait être défini'}
  ]
, "enregistrer l'analyse":[
    {exec: "current_analyse.save()", expected: '---nothing---'}
  ]
, "déverrouiller l'analyse":[
    {exec: "if(current_analyse.locked === true){current_analyse.locked=false};current_analyse.locked", expected: false}
  ]
, "enregistrer le document courant":[
    {exec: "FAWriter.currentDoc.save()", expected: '---nothing---'}
  ]
, "afficher la liste des brins": "ouvrir la fenêtre des brins"
, "ouvrir la fenêtre des brins":[
    {exec: "current_analyse.displayBrins()", expected: '---nothing---'}
  ]
, "ouvrir le document dbrins":[
    {exec: "FAWriter.openDoc('dbrins')", expected: '---nothing---'}
  ]

// ---------------------------------------------------------------------
//  VÉRIFICATIONS

, "la liste des events doit être vide":[
    {exec: "current_analyse.events.length", expected: 0, error: "Il ne devrait y avoir aucun event, il y en a %{res}"}
  ]
, "la liste des documents doit être vide":[
  {exec: 'FADocument.count()', expected: 0, error: 'Il ne devrait pas y avoir de documents. Il y en a %{res}'}
]

// ---------------------------------------------------------------------
//  ALIAS
// Dans l'ordre alphabétique

, "lancer l'app": "ouvrir l'app"
, "lancer l'application":"ouvrir l'app"
, "ouvrir l'application": "ouvrir l'app"
}
