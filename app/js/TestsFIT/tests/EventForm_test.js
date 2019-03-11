'use strict'

beforeTests(() => {
  return new Promise(ok => {
    FITAnalyse.setCurrent('tests/simple', {remove_events: true}, ok)
  })
})
afterTests(()=>{
  console.log("Après les tests, je jouerai ça")
})


var t = new Test("Test du formulaire d'édition de l'event")//, document.currentScript.src

t.case("On peut l'ouvrir en cliquant sur un bouton d'event", function(){

  // On récupère le dernier identifiant pour trouver le prochain
  // identifiant d'un nouvel event
  var newEventId = 1 + EventForm.lastId
  var domId = `form-edit-event-${newEventId}`
  var jqId = `#${domId}`

  assert(
      $(jqId).length == 0
    , "Pas de formulaire pour le nouvel évènement"
    , "Le formulaire d'édition de l'event ne devrait pas exister"
  )

  var cliqueBoutonNewNote = action.bind(null, 'On clique sur le bouton pour un nouvel event de type note', () => {
    $('#btn-new-note').click()
  })

  action("On se rend au temps voulu où mettre une note", ()=>{
    current_analyse.locator.setTime(300)
  })
  cliqueBoutonNewNote()
  return assert_DomExists(jqId, {failure: "Le formulaire devrait exister", success: "Le formulaire de création de l'event est affiché"})
  .then(() => {

    action('Je remplis le formulaire avec les données de la note', ()=>{
      var data = {
          titre:    "Le titre de la note"
        , content:  "Contenu de la note"
        , note:     "La note subsidiaire de la note"
      }
      fillEventFormWith(newEventId, data, {submit: true})
    })


  })
  .catch((err) => {
    if(err) throw(err)
    // console.log("On doit arrêter le test ici.", err)
  })

})
