'use strict'

let removeFile = function(fpath, msgfile){
  if(fs.existsSync(fpath)){
    fs.unlinkSync(fpath)
    if(fs.existsSync(fpath)){
      console.error(`Impossible de détruire ${msgfile}`, fpath)
    } else if (msg) {
      console.log(msg)
    }
  } else {
    console.log(`Le fichier "${fpath}" n'existee pas (inutile de le détruire).`)
  }
}
