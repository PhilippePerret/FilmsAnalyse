'use strict'

function asPourcentage(expected, actual){
  return `${pourcentage(expected,actual)} %`
}
function pourcentage(expected, actual){
  return Math.round(100 * (100 * actual / expected)) / 100
}

/**
  Données pour les documents, leur valeur dans l'estimation
**/
const DOCS_VALUES = {
  'introduction':     {requirity: 10}
, 'annexes':          {requirity: 5}
, 'au_fil_du_film':   {requirity: 10}
, 'building_script':  {requirity: 10}
, 'fondamentales':    {requirity: 9}
, 'infos':            {requirity: 5}
, 'lecon_tiree':      {requirity: 8}
, 'lexique':          {requirity: 4}
, 'personnages':      {requirity: 6}
, 'pfa':              {requirity: 9}
, 'synopsis':         {requirity: 10}
, 'themes':           {requirity: 5}
}

const FAStater = {
  class: 'FAStater'
, inited: false

/**
  Initialisation du stater, le gestion d'état de l'analyse courante
**/
, init(analyse){
    this.a = this.analyse = analyse

    // Quand on clique sur la jauge d'avancement, ça ouvre le
    // détail
    if(this.a){
      $('#statebar-jauger').on('click', this.a.displayAnalyseState.bind(this.a))
    } else {
      console.log("Pas d'analyse")
    }

    this.inited = true
  }


/**
  Demande d'affichage de l'état d'avancement en bas de la fenêtre.
**/
, displaySumaryState(){

    // Pour essayer avec des valeurs :
    // this.setJaugeAtPourcent(20)
    // this.setNombreDocuments(5)
    // this.setNombreEvents(34)

    // Pour le moment, on appelle cette méthode, mais peut-être qu'on pourra
    // imaginer ensuite de mémoriser les valeurs et de les afficher simplement.
    this.updateSumaryState()

  }

// Actualisation de l'état d'avancement
, updateSumaryState(){

  // Les nombres totaux qui seront utilisés pour obtenir le
  // pourcentage. Le premier correspond à la valeur maximale,
  // la valeur "100%", la seconde correspond à la valeur
  // courant, pour l'analyse courante.
  this.totalMaxValue = 0
  this.totalCurValue = 0

  delete this._documentsCount
  delete this._documentsAffixes

  // On remet les compteurs à 0 (ou presque…)
  this.setJaugeAtPourcent(0.01)
  this.setNombreDocuments('...')
  this.setNombreEvents('...')
  // TODO Ici, on calcule
  // Reprendre le tool analyse_state

  // Nombre de documents
  this.calcAndShowDocumentsCount()
  // Pourcentage par rapport à ceux attendus
  this.calcPourcentageDocuments()
  // Nombre d'events et pourcentage
  this.calcAndShowEventsCount()
  this.calcPourcentageEvents()


  // On règle enfin le pourcentage final
  this.setJaugeAtPourcent(pourcentage(this.totalMaxValue, this.totalCurValue), asPourcentage(this.totalMaxValue, this.totalCurValue))

  }

/**
  Pour calculer le pourcentage d'events, on part du principe
    1. qu'il en faut au moins 2000 pour une analyse complète,
    2. qu'il faut une scène par minute
**/
, calcPourcentageEvents(){
    this.scenesCountExpected = Math.round(this.a.duration / 60)
    this.scenesCountActual   = Scene.count

    console.log("Nombre de scènes attendues et réelles :", this.scenesCountExpected, this.scenesCountActual)

    if ( this.scenesCountActual > this.scenesCountExpected){
      this.scenesCountExpected = this.scenesCountActual
    }

    this.totalMaxValue += this.scenesCountExpected
    this.totalCurValue += this.scenesCountActual
    console.log("Pourcentage pour les scènes : ", asPourcentage(this.scenesCountExpected, this.scenesCountActual))
  }

, calcAndShowEventsCount(){
    var eventsCount =

    this.eventsCountExpected = 2000
    this.eventsCountActual   = this.a.events.length
    this.setNombreEvents(this.eventsCountActual)

    if (this.eventsCountActual > this.eventsCountExpected ){
      this.eventsCountExpected = this.eventsCountActual
      // Pour ne pas dépasser 100%
    }

    this.totalMaxValue += Math.round(2000 / 10)
    this.totalCurValue += Math.round(this.eventsCountActual / 10)

    console.log("Pourcentage pour les events : ", asPourcentage(this.eventsCountExpected, this.eventsCountActual))

  }
/**

  TODO Il faudra prendre en compte la longueur des documents pour
  qu'ils puissent compter.
**/
, calcPourcentageDocuments(){
    // console.log("this.documentsAffixes:", this.documentsAffixes)
    // La valeur maximale que peut atteindre la liste
    // des documents (en fonction de la requirity de chaque
    // document)
    var maxValue = 0
    // La valeur pour l'analyse
    var curValue = 0

    for(var kdoc in DOCS_VALUES){
      var ddoc = DOCS_VALUES[kdoc]
      maxValue += ddoc.requirity
      if(undefined === this.documentsAffixes.items[kdoc]){
        console.log("Document inconnu:", kdoc)
      } else {
        console.log("Document connu:", kdoc)
        curValue += ddoc.requirity
      }
    }

    // Pour les documents
    var pct = asPourcentage(maxValue, curValue)
    console.log("Pourcentage documents :", maxValue, curValue, pct)
    // Pour le total
    this.totalMaxValue += maxValue
    this.totalCurValue += curValue
  }

, calcAndShowDocumentsCount(){
    this.setNombreDocuments(this.documentsCount)
  }

, displayFullState(){
    F.notify('Je vais afficher l’avancement dans le détail')
    var method = require('./js/tools/building/fondamentales.js')
    this.a.method.bind(this.a)()
  }

// ---------------------------------------------------------------------
// Méthodes DOM de réglage

// Règle la jauge au poucenter +pct+ donné
, setJaugeAtPourcent(pct, pctStr){
    console.log("-> setJaugeAtPourcent : ", pct, pctStr)
    this.jqJauge.css('width', `${pct}%`)
    this.jqJauger.attr('title', `État d'avancement estimé à ${pctStr}`)
  }
, setNombreDocuments(nb){
    $('#statebar-docs-count').html(nb)
  }
, setNombreEvents(nb){
    $('#statebar-events-count').html(nb)
  }

}
Object.defineProperties(FAStater,{
  jqJauge:{
    get(){return this._jqJauge||defP(this,'_jqJauge', $('#statebar-jauge'))}
  }
, jqJauger:{
    get(){return this._jqJauger||defP(this,'_jqJauger', $('#statebar-jauger'))}
  }
, documentsAffixes:{
    get(){
      if(undefined === this._documentsAffixes){
        this._documentsAffixes = {length: 0, items: {}}
        glob.sync(path.join(this.a.folderFiles,'*.*')).forEach(file => {
          var affixe = path.basename(file,path.extname(file))
          this._documentsAffixes.items[affixe] = {affixe: affixe, name: path.basename(file)}
          ++ this._documentsAffixes.length
        })
      }
      return this._documentsAffixes
    }
  }
, documentsCount:{
    get(){
      if(undefined === this._documentsCount){
        this._documentsCount = this.documentsAffixes.length
      }
      return this._documentsCount
    }
  }

})
