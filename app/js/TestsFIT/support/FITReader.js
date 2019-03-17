'use strict'

const FITReader = {
    class: 'FITReader'

  , forEachDOMEvent:function(method){
      var evs = this.get('dom-events')
      var nb_evs = evs.length
      var i = 0
      for(;i<nb_evs;++i){method(evs[i])}
    }

  , get:function(what){
      switch (what) {
        case 'dom-events':
          // Renvoie les objets DOM des events dans l'ordre où ils sont affichés
          return $('div#reader > div.event')
        case 'order-ids':
          // Renvoie la liste des IDs des events affichés
          return this.getOrdreIds()
        default:

      }
    }

  , getOrdreIds:function(){
      var arr = []
      this.forEachDOMEvent(ev => arr.push(parseInt(ev.getAttribute('data-id'),10)))
      return arr
    }


}
