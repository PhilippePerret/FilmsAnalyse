'use strict'
/**
 * Module de construction de l'analyse complète en HTML
 */

/**
 * +options+
 *
 *
 */
module.exports = options => {
  var my = current_analyse

  var temp_html_path = path.join('./app/building/template.html')
  fs.copyFileSync(temp_html_path, my.html_path)

}
