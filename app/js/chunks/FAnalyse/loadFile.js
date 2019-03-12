'use strict'

module.exports = function(fpath, prop){
  // var this = this
  if(fs.existsSync(fpath)){
    fs.readFile(fpath, 'utf8', (err, data) => {
      if (err) throw(err)
      // console.log("data:",data)
      this[prop] = JSON.parse(data)
      this.onLoaded(fpath)
    })
  } else {
    // Si le fichier n'existe pas
    this.onLoaded(fpath)
  }

}
