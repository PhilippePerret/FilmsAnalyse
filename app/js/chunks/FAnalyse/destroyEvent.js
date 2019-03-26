'use strict'

// TODO
// Si un event détruit était un event structurel, il faut modifier
// la données pfa.json
const destroyEvent = function(event_id, form_instance){
  var ev = this.ids[event_id]

  // Si c'est une scène, il faut la retirer de la liste des
  // scène et updater les numéros
  if(ev.type === 'scene'){

    // Cas particulier de la destruction d'une scène
    Scene.destroy(ev.numero)
    this.updateNumerosScenes()

  } else if (ev.type === 'stt'){
    // Cas particulier de la destruction d'un event de structure (qui doit
    // donc être en relation avec un sttNode)
    ev.sttNode.event = undefined
  }

  if(ev.type === 'stt'){
    // Si l'event est un noeud structurel, il faut le supprimer
    // des données du PFA (et peut-être actualiser le PFA s'il
    // est affiché)
    delete this.PFA.data[ev.sttID] // = undefined
    this.PFA.save()
    this.PFA.update()
  }

  // Destruction dans la liste events
  // console.log("this.events avant:", Object.assign([], this.events))
  // console.log("Index de l'évènement à détruire : ", this.indexOfEvent(event_id))
  this.events.splice(this.indexOfEvent(event_id),1)
  // console.log("this.events après:", this.events)

  // Destruction dans la table par clé identifiants
  delete this.ids[event_id]
  this.ids[event_id] = undefined

  // On peut détruire l'instance du formulaire
  form_instance = undefined

  // On peut détruire l'élément dans le reader s'il est affiché
  $(`#reader #revent-${event_id}`).remove()

  F.notify("Event détruit avec succès.")

  this.modified = true
}


module.exports = destroyEvent
