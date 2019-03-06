'use strict'

function affiche(msg){
  $('div#message').html(msg)
}

const VideoController = {
    class: 'VideoController'
  , controller: null
  , init: function(){
      var my = this
      this.controller = document.getElementById('video')
      $('#btn-get-time').on('click', my.getTime.bind(my))
      $('#btn-go-to-time').on('click', my.goToTime.bind(my))
      this.controller.addEventListener('canplay', () => {
        affiche('Je suis prêt.')
        console.log("Durée de la vidéo:", this.controller.duration)
        console.log("startDate:", this.controller.startDate)
      })
    }
    /**
     * Méthode qui récupère le temps courant du film
     */
  , getTime: function(){
      var otime = new OTime(this.controller.currentTime)
      affiche(otime.horloge)
    }
    /**
     * Méthode qui définit le temps du film
     */
  , setTime: function(time){
      this.controller.currentTime = time
    }
    /**
     * Méthode appelée pour se rendre au temps voulu.
     * Le temps est défini comme une horloge avec des virgules
     */
  , goToTime: function(ev){
      var otime = new OTime($('#time').val())
      this.setTime(otime.seconds)
      // TODO Vérifier que ce temps soit possible
      // console.log("Time en seconds:", otime.seconds)
      // console.log("Horloge recalculée:", otime.s2h())
    }
}


$(document).ready(()=>{
  VideoController.init()
})
