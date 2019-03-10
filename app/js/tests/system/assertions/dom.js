'use strict'

const MAX_TIMEOUT = 5000 // 5 secondes


const DOMTEST = {
    MAX_TIMEOUT: 10000
  , exists: function(domId){
      // console.log(DGet(domId))
      return null !== this.DGet(domId)
    }
  , DGet: function(domId){
      return document.querySelector(domId)
      // return document.getElementById(domId)
    }
}

window.assert_DomExists = function(domId, options){
  var waitingTime = 0
  var timerInterval
  if (undefined === options) options = {}

  var endFunction = function(res, options){
    clearInterval(timerInterval)
    assert(
        res
      , `L'élément DOM ${domId} existe`
      , `L'élément DOM ${domId} est introuvable.`
      , options
    )
  }
  return new Promise((ok,ko) => {
    timerInterval = setInterval(function(){
      // console.log("-> Je test l'existence de ", domId)
      // console.log("DOMTEST.DGet", domId, DOMTEST.DGet(domId))
      // console.log("DOMTEST.exists(domId):", DOMTEST.exists(domId))
      if (DOMTEST.exists(domId)) {
        endFunction(true, options)
        ok() // pour poursuivre
      } else {
        // On poursuit la boucle
        waitingTime += 300
        if ( waitingTime > DOMTEST.MAX_TIMEOUT){
          endFunction(false, options)
          ko()
        }
      }
    }, 300)
  })
}
