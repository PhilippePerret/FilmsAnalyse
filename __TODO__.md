
* Stop-points : ne pas ajouter un point qui existe déjà
* Commencer à travailler sur le logo (un microscope ou un monitoring et une bande de film)

* Ne pas pouvoir créer deux scènes sur le même temps. Il faut CHECKER avant qu'on ouvre le formulaire, PAS une fois qu'on a rentré toutes les données.
  Il faut aussi proposer d'éditer la scène en question.

* Mettre la taille de la vidéo dans les options de l'analyse, pas dans les data.

* Faire toujours une copie du fichier data de l'analyse, en cas de problème
* Quand un event est affiché et qu'on repasse sur son temps, le mettre en exergue dans le reader.

* Le menu pour "dire de repartir (play) dès qu'on va sur un temps" existe, il faut le synchroniser avec les options de l'analyse


* Modification de l'évènement
  Voir si sa position (temps) a bougé et le replacer dans les listes de FAnalyse
* Pouvoir définir la DURÉE en cliquant-glissant de droite à gauche (les touches MAJ et CTRL permettent de faire gros ou fin)
  -> manuel
* Pouvoir utiliser intensivement le DRAG & DROP pour lier ou insérer des évènements
* Utiliser un moyen de sauvegarder les derniers évènements sauvés (modifiés ou créés dans un fichier séparé pour ne pas surcharger la sauvegarde et surtout avoir un moyen de récupérer les données en cas de plantage)
* Quand on clique pour éditer un évènement dans le reader, mettre en route le film quelques secondes avant (ou plutôt un CB pour demander de le faire, dans la boite de l'évènement, parce que sinon ça va être énervant)
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
