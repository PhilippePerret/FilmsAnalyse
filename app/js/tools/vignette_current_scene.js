'use strict'

module.exports = function(ev){
// ffmpeg -ss <horloge départ> -t <duration> -i <video path> -r <ratio> <image name.ext>
  // var imgName = `scene-${current_analyse.currentScene || 1}-%01d.jpeg`
  var sceneNumber = current_analyse.currentScene ? current_analyse.currentScene.number : 1
  var imgName = `scene-${sceneNumber}.jpeg`
  var vignettesFolder
  if(!fs.existsSync(current_analyse.vignettesScenesFolder)){
    fs.mkdirSync(current_analyse.vignettesScenesFolder)
  }
  var imgPath = path.resolve(path.join(current_analyse.vignettesScenesFolder, imgName))
  // var cmd = `ffmpeg -ss ${current_analyse.locator.getOTime().horloge_simple} -t 0.200 -i ${current_analyse.videoPath} -r 0.03 ${imgPath}`
  var cmd = `ffmpeg -ss ${current_analyse.locator.getOTime().horloge_simple} -i ${current_analyse.videoPath} -frames:v 1 -r 1 ${imgPath}`
  // -r 0.5 => prendre toutes les deux secondes
  var callback = function(err, stdout, stderr){
    if(err) console.error(err)
    if (fs.existsSync(imgPath)){
      F.notify("La vignette pour la scène courante a été créée avec succès !")
    } else {
      F.error("Bizarrement, la vignette pour la scène courante n'a pas été créée. Consulter la console pour en trouver la raison.")
    }
    if(stderr)throw(stderr)
    // console.log(`${stdout}`)
  }
  // console.log("cmd:", cmd)
  exec(cmd, callback)
}
