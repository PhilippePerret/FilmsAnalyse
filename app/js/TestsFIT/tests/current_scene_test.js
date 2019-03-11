'use strict'
/**
 * Test pour tester le traitement de la scène courante
 */

var t = new Test("Scène courante (FAanalyse#currentScene)")

t.case("Se rendre à un point prévis calcule correctement la scène courante", ()=>{
  tester("Le choix d'un temps règle le film à ce temps et choisit la bonne scène courante")

  assert_equal(0, current_analyse.events.length, {success: "L'analyse courante n'a pas d'évènements"})
  
})
