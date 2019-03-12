'use strict'
/**
 * Côté RENDERER, on reçoit les évènements envoyés
 */

// Définition de la taille de la vidéo
ipc.on('set-video-size', (ev, data) => {
  current_analyse.videoController.setSize(null, data.size)
})

ipc.on('set-film-start', (ev) => {
  current_analyse.setFilmStartTimeAt()
})

ipc.on('new-analyse', (ev) => {
  FAnalyse.onWantNewAnalyse()
})
ipc.on('open-analyse', (ev) => {
  FAnalyse.chooseAnalyse()
})
ipc.on('save-analyse', (ev) => {
  if(current_analyse.modified === true) current_analyse.save()
})
ipc.on('save-as-analyse', (ev) => {
  F.notify("Enregistrement sous… de l'analyse")
})

ipc.on('get-current-time', (ev) => {
  current_analyse.locator.getAndShowCurrentTime()
})

ipc.on('create-event', (ev, data) => {
  EventForm.onClickNewEvent(null, data.type)
})

// Activé par le menu pour prendre l'image courante comme vignette de
// la scène.
ipc.on('current-image-for-current-scene', (ev) => {
  // require('./app/js/tools/vignette_current_scene.js')(ev)
  require('./js/tools/vignette_current_scene.js')(ev)
})
