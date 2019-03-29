'use strict'

function asPourcentage(float){
  return `${parseInt(100 * float,10) / 100} %`
}


const FAStater = {
  class: 'FAStater'
, inited: false

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
, displaySumaryState(){
    F.notify("Je vais régler la barre d'état de l'avancement.")
    // Pour essayer avec des valeurs :
    // this.setJaugeAtPourcent(20)
    // this.setNombreDocuments(5)
    // this.setNombreEvents(34)
    this.setJaugeAtPourcent(0.01)
    this.setNombreDocuments('...')
    this.setNombreEvents('...')

    // TODO Ici, on calcule
    // Reprendre le tool analyse_state
  }
, updateSumaryState(){
    F.notify("Je vais actualiser l'état d'avancement.")
  }

, displayFullState(){
    F.notify('Je vais afficher l’avancement dans le détail')
    var method = require('./js/tools/building/fondamentales.js')
    this.a.method.bind(this.a)()
  }

// ---------------------------------------------------------------------
// Méthodes DOM de réglage

// Règle la jauge au poucenter +pct+ donné
, setJaugeAtPourcent(pct){
    this.jqJauge.css('width', `${pct}%`)
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
})
