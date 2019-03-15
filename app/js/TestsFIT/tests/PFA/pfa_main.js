'use strict'
/**
 * Tests généraux du paradigme (object PFA)
 */

var t = new Test("Objet PFA, Paradigme de Field Augmenté")

t.case("Méthodes", () => {
  assert_property('PFA',current_analyse, {success:'PFA est une propriété de l’analyse courante'})
  assert_function('calcAbsolutePositions', current_analyse.PFA, {success: 'calcAbsolutePositions est une méthode PFA'})
})

t.case("calcAbsolutePositions permet de calculer les positions absolues", () => {
  // On définit quelques valeurs pour l'analyse courante
  current_analyse.filmStartTime = 0
  current_analyse.filmEndTime   = 90*60
})
