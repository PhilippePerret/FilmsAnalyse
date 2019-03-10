'use strict'

var t = new Test("Test du formulaire d'édition de l'event")//, document.currentScript.src

t.case("On peut l'ouvrir en cliquant sur un bouton d'event", function(){

  // On récupère le dernier identifiant pour trouver le prochain
  // identifiant d'un nouvel event
  var newEventId = 1 + EventForm.lastId
  var formId = `#form-edit-event-${newEventId}`

  assert(
      $(formId).length == 0
    , "Pas de formulaire pour le nouvel évènement"
    , "Le formulaire d'édition de l'event ne devrait pas exister"
  )
  action('On clique sur le bouton pour un nouvel event', ()=>{
    $('#btn-new-event').click()
  })

  assert(
    $(formId).length == 1
    , 'Le formulaire de l’event est ouvert'
    , "Le formulaire d'édition de l'event devrait être ouvert"
  )

})
