'use strict'
/**
 * Test permettant de savoir si l'event a bien été déplacé dans FAnalyse.events
 * lorsque son temps a changé
 *i
 */

var t = new Test("Changement du temps d'un event")

// t.beforeTest(()=>{return FITAnalyse.load.bind(FITAnalyse)('tests/simple3scenes')})
t.beforeTest(FITAnalyse.load.bind(FITAnalyse,'tests/simple3scenes'))

t.case('Une modification de l’event sans changement de temps le laisse en place', () => {
  console.log("Je joue le premier cas")
})
t.case('Une modification du temps de l’event, mais pas assez consistante, le laisse en place', () => {

})
t.case("Une modification conséquente du temps de l'event le déplace", ()=>{


  tester("Ça déplace aussi l'event dans le reader, s'il est affiché")

})
