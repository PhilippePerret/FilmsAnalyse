* Pouvoir "draguer" le temps courant dans un champ (peut-être, tout simple : quand on clique sur le bouton 'temps courant', on met l'horloge dans le clipboard)
* Pour les QRD, il faudrait enregistrer le temps de la réponse.
* Ne pas pouvoir créer deux scènes sur le même temps. Il faut CHECKER avant qu'on ouvre le formulaire, PAS une fois qu'on a rentré toutes les données.
  Il faut aussi proposer d'éditer la scène en question.

* Définir (dans la classe) les champs absolument requis en fonction du type de l'évènement
* Création de l'évènement
  L'ajouter à la liste des FAnalyse.times
  L'ajouter à la table de hashage par ID (id => event)
* Modification de l'évènement
  Voir si sa position (temps) a bougé et le replacer dans les listes de FAnalyse
* FORMULAIRE D'EVENT
  * Reprendre le submit
* Pouvoir définir la durée en cliquant-glissant de droite à gauche (les touches MAJ et CTRL permettent de faire gros ou fin)
* Pouvoir utiliser intensivement le DRAG & DROP pour lier ou insérer des évènements
* Utiliser un moyen de sauvegarder les derniers évènements sauvés (modifiés ou créés dans un fichier séparé pour ne pas surcharger la sauvegarde et surtout avoir un moyen de récupérer les données en cas de plantage)
* titre
* Penser à prendre le dernier identifiant en chargeant un film (et le mettre dans `EventForm.lastId = `)
* Essayer de mettre le traitement particulier avec OWN_PROPS dans la super class FAEvent (dans sa méthode 'data') en essayant de prendre justement la propriété OWN_PROPS de la sous-classe (est-ce possible ?) OU en la lisant dans une autre propriété d'instance OU en la passant à une méthode
* Revoir la méthode FAnalyse.formateTexte pour que ce ne soit pas elle qui formate l'évènement mais la methode 'div' propre à tous les évènements.
* Étudier le cas de l'édition de l'évènement
  Il faut lui affecter une ID absolu
* On pourrait essayer de reprendre la lecture à l'enregistrement de l'event
* Toutes les données absolues du formulaire (les types, les catégories, etc.) doivent être enregistrées dans des fichiers JSON et les éléments du formulaire doivent être construits à la volée.
  Bien se servir du type de l'évènement pour régler la class du tag
  Faire un script pour les prendre en compte après changement
* Quand on clique sur l'évènement dans le reader, il doit s'éditer et s'actualiser en retour dans le reader
* Poursuivre le "formulaire" d'entrée de données en fonction du type de la donnée.
* Quand on ajoute un event, il doit aussi être ajouté dans le `times` du locator
* "Aller au temps" doit tenir compte du temps de début du film
* Un CB pour dire de repartir (play) dès qu'on va sur un temps (ou au contraire de ne rien faire)
* Les QD non résolues doivent s'afficher en bas à droite (même chose pour les PP)
* Indiquer comment indiquer les (faire référence aux) scènes, les brins, les personnages dans le texte/description/commentaire de tout évènement (utiliser un balisage simple)
* Quand on utilise les boutons pour se déplacer +/- 1 ou 5 secondes, il faut aussi traiter les évènements à afficher.

* Faire un mode d'emploi interactif
* Panneaux pour afficher les scènes, les personnages, les brins, etc.
* Proposer la liste des décors/sous-décors quand on focusse dans ces champs
* Pouvoir ajouter et retirer des diminutifs (peut-être utiliser les mêmes boutons pour le moment, en précisant "@T = Theodore")
* Lorsqu'on (re)définit le début du film avec des events déjà définis, on doit demander si on doit changer les temps. Penser que c'est peut-être une redéfinition et qu'un temps a déjà été pris en compte. Il faut donc, pour chaque évènement, ajouter ce temps pour obtenir le temps initial puis retirer le nouveau temps.
* Avant le load de la vidéo, il faut vérifier que le fichier existe toujours.
* Voir comment ajouter les sous-titres avec ffmpeg
* Pouvoir suivre en même temps deux endroits dans le film (donc deux visualiseurs avec chacun leur vidéo)
