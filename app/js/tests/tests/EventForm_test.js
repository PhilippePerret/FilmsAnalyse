'use strict'

var t = new Test("Test du formulaire d'édition de l'event")

t.case("On peut l'ouvrir en cliquant sur un bouton d'event", function(){
  tester("Le formulaire doit être caché")
  var newEventId = 1 + EventForm.lastId
  var formId = `#form-edit-event-${newEventId}`
  if($(formId).length > 0){
    console.error("Le formulaire d'édition de l'event ne devrait pas être ouvert")
  }
  console.log("Je clique sur un bouton d'event")
  $('#btn-new-event').click()
  // tester("Le formulaire doit être affiché")
  if($(formId).length == 0){
    console.error("Le formulaire d'édition de l'event devrait être ouvert")
  }
})
