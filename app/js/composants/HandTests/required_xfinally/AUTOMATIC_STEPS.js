'use strict'

Object.assign(HandTestStep.prototype,{
  /**
    Regarde si l'étape donnée est une étape automatique et renvoie true
    le cas échéant.
    L'étape peut être explicitement exacte (simplement entre guillemets)
    ou elle peut être une expression régulière
    @return {Boolean} true si c'est une étape automatique
  **/
  isAutomaticStep(){
    let cmd = this.command
    this.dataAutomaticStep = DATA_AUTOMATIC_STEPS[cmd.toLowerCase()]
    if (undefined === this.dataAutomaticStep){
      // console.log("Recherche de ", cmd)
      if(cmd.substring(0,1) == '/'){
        // C'est une expression régulière
        // console.log("Oui, elle commence par /")
        for(var kcmd in DATA_AUTOMATIC_STEPS){
          if(DATA_AUTOMATIC_STEPS[kcmd][0].regular){
            // Est-ce cette expression là ?
            if(cmd.match(new RegExp(kcmd))){
              // Oui ! on l'a trouvé
              // console.log("Expression régulière trouvée !", kcmd)
              this.dataAutomaticStep    = DATA_AUTOMATIC_STEPS[kcmd]
              this.keyDataAutomaticStep = kcmd
              return true
            }
          }
        }
      }
      return false
    }
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

    // La clé, quand c'est une expression régulière, a été mise
    // dans this.keyDataAutomaticStep
    let regExp = this.keyDataAutomaticStep

    try {
      for(pas of this.dataAutomaticStep){
        if( pas.regular === true ){
          // Par expression regulière

          res = this.command.match(regExp )
          var re
          if(res.groups){
            for(var prop in res.groups){
              re = new RegExp(`__${prop}__`,'g')
              pas.exec = pas.exec.replace(re, res.groups[prop])
            }
          }
          return eval(pas.exec)

        } else {
          // Par expression explicite
          res = eval(pas.exec)
          if(pas.expected != '---nothing---'){
            res === pas.expected || raise(pas.error.replace(/\%\{res\}/g, res))
          }
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
  "aucun event": [
    {exec: 'FAEvent.count', expected: 0, error: "L'analyse ne devrait compter aucun event…"}
  ]
, "aucun document":[
    {exec: 'FADocument.count', expected:0, error: "L'analyse ne devrait posséder aucun document…"}
  ]
, "aucun brin":[
    {exec: 'FABrin.count', expected: 0, error: "L'analyse ne devrait comporter aucun brin…"}
  ]
, "aucun personnage":[
    {exec: 'FAPersonnage.count', expected: 0, error: "L'analyse ne devrait comporter aucun personnage…"}
  ]
, "ouvrir l'app": [
    {exec: '"undefined"!==typeof(FAnalyse)', expected: true, error: 'FAnalyse devrait être défini'}
  ]
, "ouvrir l'analyse '(?<relpath>[\/a-zA-Z0-9_\-]+)'":[
    {regular: true, exec: 'HandTests.loadAnalyseAndWait("__relpath__")', expected:'---nothing---'}
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
