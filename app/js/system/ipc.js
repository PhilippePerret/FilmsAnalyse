'use strict'

ipc.on('set-video-size', (ev, data) => {
  current_analyse.videoController.setSize(null, data.size)
})

ipc.on('set-film-start', (ev) => {
  current_analyse.setFilmStartTimeAt()
})

ipc.on('new-analyse', (ev) => {
  F.notify("Nouvelle analyse demandée")
})
ipc.on('open-analyse', (ev) => {
  F.notify("Ouverture d'une analyse demandée")
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
