'use strict'

module.exports = (format, options) => {
  // F.notify("Exporter l'analyse au format " + format)
  if(undefined === options) options = {}

  // On charge le module d'export en fonction du format
  require(`./export/as-${format}.js`)(options)

}
