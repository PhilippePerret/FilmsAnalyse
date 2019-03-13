* Affiner encore la procédure de démarrage (voir avec l'ajout de FAnalyse#allIsReady : il se peut qu'elle soit appelée avant la fin normale de chargement de la vidéo)

* Implémenter l'option pour dire de commencer à jouer x secondes avant l'event choisi.

* On doit pouvoir rectifier le temps d'un event
  - soit en glissant la souris après avoir cliqué sur son horloge dans la boite d'édition
  - soit en le spécifiant en disant que ça doit être le temps courant (bouton spécial)

* Faire toujours une copie du fichier data de l'analyse, en cas de problème (de tous ses fichiers, d'ailleurs)

* Quand un event est affiché et qu'on repasse sur son temps, le mettre en exergue dans le reader.


* Modification de l'évènement
  Voir si sa position (temps) a bougé et le replacer dans les listes de FAnalyse
* Pouvoir définir la DURÉE en cliquant-glissant de droite à gauche (les touches MAJ et CTRL permettent de faire gros ou fin)
  -> manuel
* Pouvoir utiliser intensivement le DRAG & DROP pour lier ou insérer des évènements
* Utiliser un moyen de sauvegarder les derniers évènements sauvés (modifiés ou créés dans un fichier séparé pour ne pas surcharger la sauvegarde et surtout avoir un moyen de récupérer les données en cas de plantage)

* Toutes les données absolues du formulaire (les types, les catégories, etc.) doivent être enregistrées dans des fichiers JSON et les éléments du formulaire doivent être construits à la volée.
  Bien se servir du type de l'évènement pour régler la class du tag
  Faire un script pour les prendre en compte après changement
* Poursuivre le "formulaire" d'entrée de données en fonction du type de la donnée.
* Les QD non actuellement résolues doivent s'afficher en bas à droite
* Les PP non actuellement résolues doivent s'afficher en bas à droite

* Faire les menus
  - menu pour choisir une analyse
  - menu pour créer une nouvelle analyse
  - menu pour définir le film (mp4/webm/ogg) de l'analyse
* Faire un mode d'emploi interactif
* Panneaux pour afficher les scènes, les personnages, les brins, etc.
* Proposer la liste des décors/sous-décors quand on focusse dans ces champs
* Pouvoir ajouter et retirer des diminutifs (peut-être utiliser les mêmes boutons pour le moment, en précisant "@T = Theodore")
* Lorsqu'on (re)définit le début du film avec des events déjà définis, on doit demander si on doit changer les temps. Penser que c'est peut-être une redéfinition et qu'un temps a déjà été pris en compte. Il faut donc, pour chaque évènement, ajouter ce temps pour obtenir le temps initial puis retirer le nouveau temps.
* Avant le load de la vidéo, il faut vérifier que le fichier existe toujours.
* Voir comment ajouter les sous-titres avec ffmpeg
* Pouvoir suivre en même temps deux endroits dans le film (donc deux visualiseurs avec chacun leur vidéo !)
* Possibilité d'afficher tous les évènements d'un coup, pour pouvoir lire et se déplacer dans le film
* Pouvoir exporter en PDF le reader
