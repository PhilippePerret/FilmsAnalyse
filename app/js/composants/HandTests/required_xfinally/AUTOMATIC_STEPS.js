'use strict'

// Pour pouvoir interpréter une ligne interprétable
var regstr = '^'
regstr += "(?<action>créer|afficher|détruire|modifier)"
regstr += "( une?)?"
regstr += " (?<what>scène|noeud|note|info|procédé|idée|objectif|obstacle|conflit|moyen|personnage|brin|document)"
regstr += "( (?<where>au début|au milieu|au quart|au tiers|à la fin|au trois quart|à [0-9]:[0-9][0-9]:[0-9][0-9]))?"
regstr += "( avec)?"
regstr += " (?<args>\{(.*?)\})"
regstr += '$'
const REG_INTERPRETABLE = new RegExp(regstr, 'i')

Object.assign(HandTestStep.prototype,{
  /**
    Regarde si l'étape donnée est une étape automatique et renvoie true
    le cas échéant.
    L'étape peut être explicitement exacte (simplement entre guillemets)
    ou elle peut être une expression régulière
    ou elle peut être une expression interpretable
    @return {Boolean} true si c'est une étape automatique
  **/
  isAutomaticStep(){
    let cmd = this.command
    this.dataAutomaticStep = DATA_AUTOMATIC_STEPS[cmd.toLowerCase()]
    if (undefined === this.dataAutomaticStep){

      // <= la commande n'est pas une commande reconnue telle quelle
      // => On va chercher un peu mieux.
      //    D'abord, on va voir si elle est entourée de balance ("/"), ce qui
      //    signifierait que c'est une expression régulière connue.
      //    Ensuite on regardera si c'est une "expression interprétable", avec
      //    des variables.

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
      } else if (this.isInterpretableCommand()){
        return true
      }
      return false
    }
    if('string' === typeof this.dataAutomaticStep /* un "alias" */){
      this.dataAutomaticStep = DATA_AUTOMATIC_STEPS[this.dataAutomaticStep]
    }
    return true
  }


, isInterpretableCommand(){
    if(undefined === this._isInterpretable){
      this._isInterpretable = !!this.command.match(REG_INTERPRETABLE)
    }
    return this._isInterpretable
  }
  /**
    Exécute l'opération automatique et retourne le résultat
    `this.dataAutomaticStep` contient les données de l'étape automatique, notamment
    ce qu'il y a à faire
    @return {Boolean} True si c'est un succès, False otherwise.
  **/
, execAndTest(){

    if (this.isInterpretableCommand()){
      return this.execInterpretableCommand()
    }
    var pas, res

    // La clé, quand c'est une expression régulière, a été mise
    // dans this.keyDataAutomaticStep
    let regExp = this.keyDataAutomaticStep

    // console.log("-> execAndTest, avec commande : ", this.command)

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
          switch (eval(pas.exec)) {
            case true:  return pas.NaT ? 2 : 1
            case false: return 0
            case null:  return null // traitement asynchrone
            default:
              console.log("Ni true, ni false, ni null:", eval(pas.exec))
          }

        } else {
          // Par expression explicite
          res = eval(pas.exec)
          if(pas.expected != '---nothing---'){
            res === pas.expected || raise(pas.error.replace(/\%\{res\}/g, res))
          }
        }
      }
      return pas.NaT ? 2 : 1
    } catch (e) {
      console.error(e)
      F.error(e)
      return 0
    }
  }

/**
  Exécute une commande interprétable
  C'est ici qu'on traite les lignes de type :
      create scène au début avec OCROCHET pitch: "le pitch de la scène" FCROCHET
  Cf. le manuel développeur pour le détail.
**/
, execInterpretableCommand(){
    // console.log("-> execInterpretableCommand")

    let dureeFilm = current_analyse.duree
    // console.log("dureeFilm:", dureeFilm)

    let data_reg = this.command.match(REG_INTERPRETABLE).groups

    // Les actions possibles
    switch(data_reg.action.toLowerCase()){
      case 'créer':
        break
      case 'afficher':
        break
      case 'détruire':
        break
      case 'modifier':
        break
    }

    switch(data_reg.what){
      case 'scène':
        break
      default:
        throw(`Je ne sais pas encore interpréter les commandes avec l'objet ${data_reg.what}, malheureusement.`)
    }

    // Paramètres
    let args
    if (data_reg.args){
      eval(`args = ${data_reg.args}`)
    } else {
      args = {}
    }
    // console.log("args:", args)

    // Lieu où il faut créer l'élément
    let at
    if(data_reg.where){
      switch(data_reg.where){
        case 'au début' : at = 0; break
        case 'au quart' : at = (dureeFilm / 4).round(2); break
        case 'au tiers' : at = (dureeFilm / 3).round(2); break
        case 'au milieu': at = (dureeFilm/2).round(2); break
        case 'au deux tiers': at = (2*(dureeFilm/3)).round(2); break
        case 'au trois quart': at = (3*(dureeFilm/4)).round(2); break
        case 'à la fin': at = dureeFilm - 60; break
        default:
          // Une valeur comme "à <horloge>"
          var w = data_reg.where
          w = w.substring(2,w.length).trim()
          at = new OTime(w).seconds
      }
      args.time = at
    }

    // console.log("args à la fin:", args)

    // On appelle la fonction ad hoc et on retourne son résultat
    return HTCreator.create[data_reg.what](args)
  }
})

const HTCreator = {
  create:{
    scène: function(args){
      // Args doit contenir toutes les valeurs requises de la scène
      if(undefined === args.id)       args.id       = EventForm.newId()
      if(undefined === args.numero)   args.numero   = 1000 // sera recalculé
      if(undefined === args.titre){
        args.titre = args.pitch || `Scène à ${(new Date)}`
      }
      if(undefined === args.content)  args.content  = `Le contenu de la scène ${args.titre}.`
      if(undefined === args.time)     args.time     = 0
      let nev = new FAEscene(current_analyse, args)
      current_analyse.addEvent(nev)
      nev.onCreate()
      FAEscene.reset()
      return 2
    }
  }
}

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
    {NaT: true /* pas un test */, exec: '"undefined"!==typeof(FAnalyse)', expected: true, error: 'FAnalyse devrait être défini'}
  ]
, "ouvrir l'analyse '(?<relpath>[\/a-zA-Z0-9_\-]+)'":[
    {NaT: true, regular: true, exec: 'HandTests.loadAnalyseAndWait("__relpath__")', expected:'---nothing---'}
  ]
, "enregistrer l'analyse":[
    {NaT: true, exec: "current_analyse.save()", expected: '---nothing---'}
  ]
, "déverrouiller l'analyse":[
    {NaT: true, exec: "if(current_analyse.locked === true){current_analyse.locked=false};current_analyse.locked", expected: false}
  ]
, "enregistrer le document courant":[
    {NaT: true, exec: "FAWriter.currentDoc.save()", expected: '---nothing---'}
  ]
, "afficher la liste des décors": "ouvrir la fenêtre des décors"
, "afficher les décors": "ouvrir la fenêtre des décors"
, "ouvrir la fenêtre des décors":[
    {NaT: true, exec: "current_analyse.displayDecors()", expected: '---nothing---'}
  ]
, "afficher la liste des brins": "ouvrir la fenêtre des brins"
, "afficher les brins": "ouvrir la fenêtre des brins"
, "ouvrir la fenêtre des brins":[
    {NaT: true, exec: "current_analyse.displayBrins()", expected: '---nothing---'}
  ]
, "ouvrir le document dbrins":[
    {NaT: true, exec: "FAWriter.openDoc('dbrins')", expected: '---nothing---'}
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
