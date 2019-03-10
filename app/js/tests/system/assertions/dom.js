'use strict'

const MAX_TIMEOUT = 5000 // 5 secondes

window. DGet = function(domId){
  return document.querySelector(domId)
  // return document.getElementById(domId)
}

const DOM = {
    MAX_TIMEOUT: 10000
  , exists: function(domId){
      // console.log(DGet(domId))
      return DGet(domId)
    }
}

window.assert_DomExists = function(domId, options){
  var waitingTime = 0
  var timerInterval
  if (undefined === options) options = {}

  var endFunction = function(res, options, ok){
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
      if (DOM.exists(domId)){
        endFunction(true, options, ok)
        ok() // pour poursuivre
      } else {
        // On poursuit la boucle
        waitingTime += 300
        if ( waitingTime > DOM.MAX_TIMEOUT){
          endFunction(false, options, ok)
          ko()
        }
      }
    }, 300)
  })
}
