# Manuel de développement

# Point d'entrée

Le point d'entrée du main process se fait par `./main.js`

Le point d'entrée de l'analyser (`analyser.html`) se fait par `./app/js/lecteur/on_ready.js`

On fabrique une instance `FAnalyse`, qui est l'analyse courante. Normalement, pour le moment, c'est un singleton, mais on pourra imaginer certaines parties du programme qui travaillent avec plusieurs analyses en même temps.

Cette instance `FAnalyse` construit un « controleur vidéo » (instance `VideoController`) et un « lecteur d'analyse » (instance `AReader`)
