* [BUG] Les durées des events ne semblent pas être enregistrées
* Implémenter #13 (un event jouant interrompt un autre event jouant avant)

* Mettre un cursor horizontal quand on est sur une horloge (<horloge>, <duree>, une classe existe déjà)

* Une classe **Writer** pour écrire les longs textes de l'analyse. Un writer sera un grand textarea qui sera placé à la place du reader (ou un texte volant)

* Pouvoir avoir un résumé (dans le reader) de l'état de l'analyse courante
  - nombre d'events (et peut-être le détail par type, mais en ouvrant un div-dossier)
  - nombre de Scènes
  - nombre de nœuds structurels définis

* Quand on change de film, il faut vider le reader (de façon générale, reseter l'UI)

* Pouvoir indiquer qu'un event est "printable", c'est-à-dire qu'il sera affiché dans l'analyse finale. Ou alors, définir **OÙ** il sera printable (par exemple en lien avec un autre event) et où il ne le sera pas (par exemple dans le listing général des events de même type).

* Le bouton "Aller au temps" doit être horlogeable

* Mettre en place un système de Tips qui s'affichera au moins une fois pour rappeler les bons trucs (pouvoir l'activer et le désactiver)
  -> Objet **Tips**

* Quand un event est affiché et qu'on repasse sur son temps, le mettre en exergue dans le reader.
  - de façon générale, il faut encore revoir le système d'affichage des events. Par exemple, si on revient en arrière, les nouveaux events sont affichés après ceux qui sont déjà présents
  => mettre peut-être le temps de l'even dans sa balise, pour pouvoir insérer très facilement les nouveaux events (par leur temps)

* Modification de l'évènement
  Voir si sa position (temps) a bougé et le replacer dans les listes de FAnalyse

* Outil pour dessiner le paradigme de Field Augmenté du film.
  -> Objet **PFA** (une classe, car il peut y avoir plusieurs paradigmes de Field ?)
  -> Classe **SttNode** (qui peut hériter de FAEvent)

* Faire la classe **Timeline**
  - elle permettra d'afficher par exemple les brins, leur position dans le film
  - on fait une classe car de nombreux éléments peuvent avoir une timeline. Le PFA peut en avoir une, par exemple, et même deux : une pour les temps absolues et une pour les temps du film

* Pouvoir utiliser intensivement le DRAG & DROP pour lier ou insérer des évènements
* Utiliser un moyen de sauvegarder les derniers évènements sauvés (modifiés ou créés dans un fichier séparé pour ne pas surcharger la sauvegarde et surtout avoir un moyen de récupérer les données en cas de plantage)

* Toutes les données absolues du formulaire (les types, les catégories, etc.) doivent être enregistrées dans des fichiers JSON et les éléments du formulaire doivent être construits à la volée.
  Bien se servir du type de l'évènement pour régler la class du tag
  Faire un script pour les prendre en compte après changement
* Poursuivre le "formulaire" d'entrée de données en fonction du type de la donnée.
* Les QD non actuellement résolues doivent s'afficher en bas à droite
* Les PP non actuellement résolues doivent s'afficher en bas à droite

* Faire un mode d'emploi interactif
* Proposer la liste des décors/sous-décors quand on focusse dans ces champs
* Pouvoir ajouter et retirer des diminutifs (peut-être utiliser les mêmes boutons pour le moment, en précisant "@T = Theodore")
* Lorsqu'on (re)définit le début du film avec des events déjà définis, on doit demander si on doit changer les temps. Penser que c'est peut-être une redéfinition et qu'un temps a déjà été pris en compte. Il faut donc, pour chaque évènement, ajouter ce temps pour obtenir le temps initial puis retirer le nouveau temps.
* Pouvoir suivre en même temps deux endroits dans le film (donc deux visualiseurs avec chacun leur vidéo !)
* Possibilité d'afficher tous les évènements d'un coup, pour pouvoir lire et se déplacer dans le film
* Pouvoir exporter en PDF le reader
  - procédure de mise en forme
  - sortie en format Kindle ou autre livre en ligne
