#!/usr/bin/env bash

# Afficher ce script dans Atom et jouer CMD-I pour le lancer et
# actualiser les deux manuels

cd '/Users/philippeperret/Programmation/Electron/FilmsAnalyse/Manuel'

# Update du Manuel utilisateur
pandoc -s Manuel.md --css="manuel.css" --metadata pagetitle="Manuel" --from=markdown --output=Manuel.html;

# Update du Manuel développement
pandoc -s Manuel_developpement.md --css="manuel.css" --metadata pagetitle="Manuel développement" --from=markdown --output=Manuel_developpement.html;
