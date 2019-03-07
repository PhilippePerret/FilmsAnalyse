* "Coller" la vidéo et le reader (span de type "inline-block" ? sans float ?)
* Mémoriser dans les données de l'analyse courante l'état du visualiseur (vignette, medium ou large)
* Quand on clique sur l'évènement dans le reader, il doit s'éditer et s'actualiser ensuite
* Poursuivre le "formulaire" d'entrée de données en fonction du type de la donnée.
* Quand on ajoute un event, il doit aussi être ajouté dans le `times` du locator
* "Aller au temps" doit tenir compte du temps de début du film
* Un CB pour dire de repartir (play) dès qu'on va sur un temps (ou au contraire de ne rien faire)
* Les QD non résolues doivent s'afficher en bas à droite (même chose pour les PP)
* Indiquer comment indiquer les (faire référence aux) scènes, les brins, les personnages dans le texte/description/commentaire de tout évènement (utiliser un balisage simple)

* Panneaux pour afficher les scènes, les personnages, les brins, etc.
* Les sous-décors sont ajouté avec ":" entre décor et sous-décor
* Pouvoir ajouter et retirer des diminutifs (peut-être utiliser les mêmes boutons pour le moment, en précisant "@T = Theodore")
* Lorsqu'on (re)définit le début du film avec des events déjà définis, on doit demander si on doit changer les temps. Penser que c'est peut-être une redéfinition et qu'un temps a déjà été pris en compte. Il faut donc, pour chaque évènement, ajouter ce temps pour obtenir le temps initial puis retirer le nouveau temps.
* Avant le load de la vidéo, il faut vérifier que le fichier existe toujours.
* Voir comment ajouter les sous-titres avec ffmpeg
* Pouvoir suivre en même temps deux endroits dans le film (donc deux visualiseurs avec chacun leur vidéo)
