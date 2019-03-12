'use strict'

module.exports = function(fpath, prop){
  // console.log(this)
  var my = this
  if(fs.existsSync(fpath)){
    fs.readFile(fpath, 'utf8', (err, data) => {
      if (err) throw(err)
      // console.log("data:",data)
      my[prop] = JSON.parse(data)
      my.onLoaded(fpath)
    })
  } else {
    // Si le fichier n'existe pas
    my.onLoaded(fpath)
  }

}
