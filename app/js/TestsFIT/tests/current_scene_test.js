'use strict'
/**
 * Test pour tester le traitement de la scène courante
 */

var t = new Test("Scène courante (FAanalyse#currentScene)")

t.case("Se rendre à un point prévis calcule correctement la scène courante", ()=>{

  return FITAnalyse.setCurrent('tests/simple3scenes')
  .then(() => {

    // console.log("Dossier de l'analyse : ", current_analyse.folder)
    // console.log("ID de l'instance FAnalyse:", current_analyse.__object_id__)
    // return

    assert_equal(
        3
      , current_analyse.events.length
      , {success: "L'analyse courante a 3 events"})

    action("Je me rends au temps 22 (scène 1)", ()=>{
      current_analyse.locator.setRTime(22)
    })

    assert_equal(
        1
      , current_analyse.currentScene.numero
      , {success: "La scène courante est la scène 1"}
    )

    action("Je me rends au temps 24 (scène 1)", ()=>{
      current_analyse.locator.setRTime(24)
    })

    assert_equal(
        1
      , current_analyse.currentScene.numero
      , {success: "La scène courante est toujours la scène 1"}
    )

    action("Je me rends au temps 69 (début scène 2)", ()=>{
      current_analyse.locator.setRTime(69)
    })

    assert_equal(
        2
      , current_analyse.currentScene.numero
      , {success: "La scène courante est la scène 2"}
    )

    action("Je me rends au temps 72 (scène 2)", ()=>{
      current_analyse.locator.setRTime(72)
    })
    assert_equal(
        2
      , current_analyse.currentScene.numero
      , {success: "La scène courante toujours la scène 2"}
    )

    action("Je me rends au temps 40 (scène 1)", ()=>{
      current_analyse.locator.setRTime(40)
    })
    // curscene = current_analyse.currentScene
    assert_equal(
        1
      , current_analyse.currentScene.numero
      , {success: "La scène courante est la scène 1"}
    )

    action("Je me rends au temps 86 (scène 3)", ()=>{
      current_analyse.locator.setRTime(86)
    })

    assert_equal(
        3
      , current_analyse.currentScene.numero
      , {success: "La scène courante est la scène 3"}
    )

    action("Je me rends au temps 100 (scène 3)", ()=>{
      current_analyse.locator.setRTime(100)
    })

    assert_equal(
        3
      , current_analyse.currentScene.numero
      , {success: "La scène courante est toujours la scène 3"}
    )

  })
})
