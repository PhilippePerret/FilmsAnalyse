'use strict'

class HandTestFile {
constructor(path, options){
  this.HTestPath = this.path = path
  this.options   = options // pour la position de fenêtre, entre autres
}

run(){
  var htest
  this.index_htest = -1
  this.nextTest() // on commence
}

/**
  Joue le test suivant
**/
nextTest(options){
  if(undefined === options) options = this.options
  let test_id = Object.keys(this.data)[++this.index_htest]
  if(test_id){
    let htest = new HandTest(this, test_id, this.data[test_id], options)
    htest.run()
  } else {
    // Fin des tests de ce fichier
    HandTests.nextHTestFile(options)
  }
}

get data(){return this._data||defP(this,'_data',YAML.safeLoad(fs.readFileSync(this.HTestPath,'utf8')))}
get relpath(){return this.path.replace(new RegExp(HandTests.folder),'.')}
}
