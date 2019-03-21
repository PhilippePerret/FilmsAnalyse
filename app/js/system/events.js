'use strict'
/**
 * Tout un tas de choses concernant les events (système, pas de l'analyse)
 */
function stopEvent(e){
  e.stopPropagation()
  e.preventDefault()
  return false
}

const KTAB      = 9 // keycode
const KRETURN   = 13 // keyCode

const K_S       = 91 //
