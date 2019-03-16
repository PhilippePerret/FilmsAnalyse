'use strict'
/**
 * Test permettant de savoir si l'event a bien été déplacé dans FAnalyse.events
 * lorsque son temps a changé
 *i
 */

var t = new Test("Changement du temps d'un event")

// t.beforeTest(()=>{return FITAnalyse.load.bind(FITAnalyse)('tests/simple3scenes')})
t.beforeTest(FITAnalyse.load.bind(FITAnalyse,'tests/simple3scenes',{reader: 'display-all-event'}))

t.case('Une modification de l’event sans changement de temps le laisse en place', () => {
  let idx_init = current_analyse.indexOfEvent(3)
  let ev3 = current_analyse.ids[3]
  current_analyse.updateEvent(ev3, {initTime: ev3.time})
  let idx_new = current_analyse.indexOfEvent(3)
  assert_equal(
    idx_init, idx_new,
    {success: `L'event est toujours en ${idx_init + 1}e position`,
    failure: `L'event devrait être toujours en ${idx_init+1}e position… Il est en ${idx_new+1}e position`}
  )
})
t.case('Une modification du temps de l’event, mais pas assez consistante, le laisse en place', () => {
  let idx_init = current_analyse.indexOfEvent(3)
  let ev3 = current_analyse.ids[3]
  var initTime = ev3.time
  ev3.time -= 20
  current_analyse.updateEvent(ev3, {initTime: initTime})
  assert(
    current_analyse.modified,
    "L'analyse a été marquée modifiée", "L'analyse aurait dû être marquée modifiée"
  )
  // Prendre le nouvel index
  let idx_new = current_analyse.indexOfEvent(3)
  assert_equal(
    idx_init, idx_new,
    {
      success: `L'event est toujours en ${idx_init + 1}e position`,
      failure: `L'event devrait être toujours en ${idx_init+1}e position… Il est en ${idx_new+1}e position`
    }
  )
  assert_equal(
    2, ev3.numero,
    {
      success: "L'event a toujours le numéro de scène 2",
      failure: `L'event devrait avoir le numéro de scène 2, il a le numéro ${ev3.numero}`
    }
  )
})
t.case("Une modification conséquente du temps de l'event le déplace", ()=>{

  let idx_init = current_analyse.indexOfEvent(3)
  let ev3 = current_analyse.ids[3]
  var initTime = ev3.time
  ev3.time = 100
  current_analyse.updateEvent(ev3, {initTime: initTime})
  assert(
    current_analyse.modified,
    "L'analyse a été marquée modifiée", "L'analyse aurait dû être marquée modifiée"
  )
  // Prendre le nouvel index
  let idx_new = current_analyse.indexOfEvent(3)
  assert_equal(
    2, idx_new,
    {
      success: `L'event est maintenant en ${idx_new + 1}e position`,
      failure: `L'event devrait être maintenant en 3e position… Il est en ${idx_new+1}e position`
    }
  )
  assert_equal(
    3, ev3.numero,
    {
      success: "L'event a maintenant le numéro de scène 3",
      failure: `L'event devrait avoir le numéro de scène 3, il a le numéro ${ev3.numero}`
    }
  )

  tester("Ça déplace aussi l'event dans le reader, s'il est affiché")

})
