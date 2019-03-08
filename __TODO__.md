* Quand on clique sur l'évènement dans le reader, il doit s'éditer et s'actualiser en retour dans le reader

* À la création d'une scène, trouver son numéro (en fonction de son temps) et l'indiquer dans le formulaire

* Ne pas pouvoir créer deux scènes sur le même temps. Il faut CHECKER avant qu'on ouvre le formulaire, PAS une fois qu'on a rentré toutes les données.
  Il faut aussi proposer d'éditer la scène en question.

* Modification de l'évènement
  Voir si sa position (temps) a bougé et le replacer dans les listes de FAnalyse
* Pouvoir définir la durée en cliquant-glissant de droite à gauche (les touches MAJ et CTRL permettent de faire gros ou fin)
* Pouvoir utiliser intensivement le DRAG & DROP pour lier ou insérer des évènements
* Utiliser un moyen de sauvegarder les derniers évènements sauvés (modifiés ou créés dans un fichier séparé pour ne pas surcharger la sauvegarde et surtout avoir un moyen de récupérer les données en cas de plantage)
* Revoir la méthode FAnalyse.formateTexte pour que ce ne soit pas elle qui formate l'évènement mais la methode 'div' propre à tous les évènements.
* Quand on clique pour éditer un évènement dans le reader, mettre en route le film quelques secondes avant (ou plutôt un bouton pour le faire, dans la boite de l'évènement, parce que sinon ça va être énervant)
* Toutes les données absolues du formulaire (les types, les catégories, etc.) doivent être enregistrées dans des fichiers JSON et les éléments du formulaire doivent être construits à la volée.
  Bien se servir du type de l'évènement pour régler la class du tag
  Faire un script pour les prendre en compte après changement
* Poursuivre le "formulaire" d'entrée de données en fonction du type de la donnée.
* Quand on ajoute un event, il doit aussi être ajouté dans le `times` du locator + la liste des ID/temps
* Un CB pour dire de repartir (play) dès qu'on va sur un temps (ou au contraire de ne rien faire)
* Les QD non actuellement résolues doivent s'afficher en bas à droite (même chose pour les PP)
* Indiquer comment indiquer les (faire référence aux) scènes, les brins, les personnages dans le texte/description/commentaire de tout évènement (utiliser un balisage simple)
  => Note : en fait, il faudrait seulement pouvoir drag & droper sur le champ d'édtion pour que soit coller la référence à la chose
* En cas de nouvelle scène, updater les numéros des scènes existantes
* Quand on utilise les boutons pour se déplacer +/- 1 ou 5 secondes, il faut aussi traiter les évènements à afficher.

* Faire un mode d'emploi interactif
* Panneaux pour afficher les scènes, les personnages, les brins, etc.
* Proposer la liste des décors/sous-décors quand on focusse dans ces champs
* Pouvoir ajouter et retirer des diminutifs (peut-être utiliser les mêmes boutons pour le moment, en précisant "@T = Theodore")
* Lorsqu'on (re)définit le début du film avec des events déjà définis, on doit demander si on doit changer les temps. Penser que c'est peut-être une redéfinition et qu'un temps a déjà été pris en compte. Il faut donc, pour chaque évènement, ajouter ce temps pour obtenir le temps initial puis retirer le nouveau temps.
* Avant le load de la vidéo, il faut vérifier que le fichier existe toujours.
* Voir comment ajouter les sous-titres avec ffmpeg
* Pouvoir suivre en même temps deux endroits dans le film (donc deux visualiseurs avec chacun leur vidéo !)
