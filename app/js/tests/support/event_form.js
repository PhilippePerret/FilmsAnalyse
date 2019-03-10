'use strict'
/**
 * Méthodes pratiques pour le formulaire d'event
 */


// Pour remplir un formulaire quelconque
// TODO Passer la méthode dans le système normal
window.fillFormWith = function(formId, data, options){
  if(formId.substr(0,1)!='#') formId = `#${formId}`
  for(var domId in data){
    // console.log("Remplissage de, avec:", domId, data[domId])
    var fullDomId = `form${formId} #${domId}`
    var formObj = document.querySelector(fullDomId)
    if (formObj == null) throw(`Le champ d'édition "${fullDomId}" est inconnu.`)
    $(formObj).val(data[domId])
  }
}

// Pour remplir un formulaire d'event (modification ou création)
window.fillEventFormWith = function(eventId, data, options){
  var formId = `#form-edit-event-${eventId}`
  var formData = {}
  for(var prop in data){
    var propId = `event-${eventId}-${prop}`
    formData[propId] = data[prop]
  }
  fillFormWith(formId, formData, options)
}
