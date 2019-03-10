'use strict'

var t = new Test("Test du formulaire d'édition de l'event")//, document.currentScript.src

t.case("On peut l'ouvrir en cliquant sur un bouton d'event", function(){

  // On récupère le dernier identifiant pour trouver le prochain
  // identifiant d'un nouvel event
  var newEventId = 1 + EventForm.lastId
  var domId = `form-edit-event-${newEventId}`
  var jqId = `#${domId}`

  // assert(
  //     $(jqId).length == 0
  //   , "Pas de formulaire pour le nouvel évènement"
  //   , "Le formulaire d'édition de l'event ne devrait pas exister"
  // )

  var cliqueBoutonNewNote = action.bind(null, 'On clique sur le bouton pour un nouvel event de type note', () => {
    // $('#btn-new-note').click()
    $('#btn-new-note').trigger('click')
  })

  var dexiste = {failure: "Le formulaire devrait exister", success: "Le formulaire de création de l'event est affiché"}


  return wait(4000, "J'attends 2 secondes avant de cliquer le bouton")
  .then(cliqueBoutonNewNote)
  .then(wait.bind(null, 2000, "J'attends 2 secondes avant de voir si le formulaire existe"))
  .then(assert_DomExists.bind(null, jqId, dexiste))
  .then(()=>{
    tester("On remplit le formulaire")
  })
  .catch(()=>{
    console.log("On doit arrêter le test ici.")
  })

})
