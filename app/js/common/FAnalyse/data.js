'use strict'

// ---------------------------------------------------------------------
//  CLASS

/**
  Méthode de classe qui charge l'analyse dont le dossier est +aFolder+
  et en fait l'analyse courante.
 */
FAnalyse.classMethod = function(){
  // ... Code
}

// ---------------------------------------------------------------------
//  INSTANCE

Object.defineProperties(FAnalyse.prototype,{
  data:{
    get(){
      return {
          folder:             this.folder
        , title:              this.title
        , version:            this.version
        , locked:             !!this.locked
        , filmStartTime:      this.filmStartTime
        , filmEndTime:        this.filmEndTime
        , filmEndGenericFin:  this.filmEndGenericFin
        , videoPath:          this.videoPath
        , lastCurrentTime:    (this.locator ? this.locator.getRTime() : 0)
        , stopPoints:         (this.locator ? this.locator.stop_points : [])
      }
    }
  , set(v){
      this.title                = v.title
      this.version              = v.version
      this.locked               = !!v.locked || false
      this.filmStartTime        = v.filmStartTime || 0
      this.filmEndTime          = v.filmEndTime
      this.filmEndGenericFin    = v.filmEndGenericFin
      this._videoPath           = v.videoPath
      this.lastCurrentTime      = v.lastCurrentTime || 0
      this.stopPoints           = v.stopPoints || []
    }
  }

, modified:{
    get(){ return this._modified }
  , set(v){
      this._modified = v
      this.markModified[v ? 'addClass':'removeClass']('on')
    }
  }

, title: {
    get(){return this._title || defP(this,'_title', path.basename(this.folder))}
  , set(v){this._title = v ; this.modified = true}
  }

, version: {
    get(){return this._version || defP(this,'_version', '0.0.1')}
  , set(v){this._version = v ; this.modified = true}
  }

, filmId:{get(){return this._filmId||defP(this,'_filmId',this.title.camelize())}}

// ---------------------------------------------------------------------
//  Les données temporelles

, duration:{
    // avant de le calculer vraiment :
    get(){ return this._duration || defP(this,'_duration', this.calcDuration()) }
  , set(v){ this._duration = v ; this.modified = true }
  }

, filmStartTime:{
    get() {return this._filmStTi || defP(this,'_filmStTi', 0)}
  , set(v){ this._filmStTi = v ; this.duration = undefined }
  }

, filmEndTime:{
    get(){return this._filmEndTime || defP(this,'_filmEndTime',this.calcFilmEndTime())}
  , set(v){ this._filmEndTime = v ; this.duration = undefined }
}

, filmEndGenericFin:{
    get(){return this._filmEGF}
  , set(v){this._filmEGF = v ; this.modified = true }
  }

, lastCurrentTime:{
    get(){return this._lastCurT||defP(this,'_lastCurT',this.locator.getRTime())}
  , set(v){ this._lastCurrentTime = v }
  }

})



Object.assign(FAnalyse.prototype, {

  calcDuration(){
    if(!this.filmEndTime) return null
    return this.filmEndTime - this.filmStartTime
  }

, calcFilmEndTime(){
    var endt = null
    if(this.videoPath){
      this._filmEndTime = this.videoController.video.duration
      endt = this._filmEndTime
    }
    return endt
  }

})
