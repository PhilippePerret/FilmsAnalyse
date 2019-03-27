# SUR LE GRILL

* Une classe FlyingWindow pour gérer toutes les fenêtres de la même manière (formulaire d'event, writer, eventer, etc.)

* Une class Report pour faire des rapports de toute sorte, qui peuvent s'afficher à l'écran (dans une flying window) ou s'enregistrer dans un fichier.
  - il permet d'utiliser des classes pour mettre en exergue, signaler des erreurs, etc.

* Quand on clique sur les entêtes des writer, eventers, visualizor, etc. ils doivent passer au premier plan.

* Droppable
  - Normalement, tout est en place. Il faut simplement vérifier que tout fonctionne.
  - problème avec l'entête du formulaire d'event ('header') qui ne réagit aux events
  - puisque les documents ne sont pas des instances qui sont enregistrés (mais seulement des fichiers texte), faire le tour des events pour connaitre les events qui leur sont associés (leur propriété 'documents' contient la liste des documents auxquels ils sont associés)

* la vidéo doit être draggable
  - quand on la déplace dans un texte, ça ajoute une marque `{{time:<realtime>}}` au curseur.
  - mettre en forme cette marque, avec un lien qui lance la vidéo (en mode analyse)
  - faut-il que l'horloge principale aussi soit draggable ? (qu'on penserait plus intuitivement à déplacer)
  => Documenter ces utilisations


* PFA
  - Pouvoir éditer l'event en cliquant dessus dans le PFA

* Il faut qu'un cursor, dans une FATimeline, ait la hauteur de son contenu
  - Quand on survole le slider, il faut mettre un cursor fantôme
    (rouge plus clair) — note : sur toute la hauteur du container, là-aussi.

* Aggrandir les champs de saisie à menu qu'on aggrandit le texte.
  Essayer de trouver un système pour qu'on soit très à l'aide, mais peut être pas comme sur l'atelier, où ça "saute" trop.
  Peut-être ne pas avoir le même textearea qui s'aggrandit, mais travailler avec un autre qui sert de bac à sable.

* Pour la FATimeline
  - faire des instances FACursor

* Assemblage de l'analyse
  -> penser à faire un vérificateur, pour voir si tous les documents et tous les composants de l'analyse courantes sont bien utilisés
  - note : il faut toujours qu'un fichier texte commence par son titre. Ça permet de le "nommer" quand on en parle dans les comptes-rendus.

* Pour la sortie en PDF
  - il faudrait ajouter l'image de couverture au HTML
  - il faut partir du HTML pour faire le PDF
  - Pour tous les autres fichiers, faire les deux versions jusqu'à être sûr de la meilleure


# EN COURS DE DÉVELOPPEMENT

* Développer la main-timeline pour qu'elle affiche le paradigme de Field absolu, peut-être sous forme de point plutôt que de cases
  - noter que pour le moment le "slider" de l'instance FATimeline s'affiche au-dessus puisque la timeline est vide.
* L'état d'avancement de l'application (analyse_state.js)
* Construction du (des) PFA (poursuivre en mettant des éléments propres à l'analyse, et en stylisant — pour le moment, le PFA n'est pas encore présentable.)
* Construction des Fondamentales
* Construction des statistiques de fin

# TODO LIST

* Pouvoir modifier la vitesse à l'aide des touches `CMD +` et `CMD -`

* Par le writer (le menu « Document » peut-être), possibilité d'ajouter un nouveau document propre à l'analyse courante.

* Peut-être, pour particulariser chaque analyse, faut-il faire un "scénario" de construction qui explique comment procéder. Par exemple :
    - mettre introduction
    - mettre PFA
    - passer une page
    - mettre fil du film
    - mettre document <id/name>
    etc.
  Ce serait un document de type 'data'
* Faire du filtre d'event une classe séparée qui pourra être utilisée par n'importe quel composant.
* Construire les fondamentales (à partir du fichier data)
* Implémenter les fonctions windows `showEvent(event_id)` et `showScene(event_id)` qui permettent d'afficher les events ou les scènes dans les textes finaux.
  - Noter que la méthode showScene attend un identifiant d'event, PAS un numéro de scène (qui peut changer à tout moment)
* Barre d'état en bas pour montrer l'état d'avancement de l'analyse
  - Il faudrait que ce developpement soit enregistré de façon "hot" pour pouvoir toujours apparaitre comme une jauge.
* Implémenter les infos générales du film
  - note : pour faire simple, ça pourrait être un fichier document, avec l'extension ".md" mais qui serait en fait un YAML, qui serait édité comme les autres.

* Pouvoir avoir plusieurs writers pour éditer plusieurs documents en même temps
* Penser aux "notes générales" qui permettent d'annoter n'importe quoi. Peut-être que c'est un type particulier de document, qui peut être multiple, et qui ont une cible (target) définie, qui peut être le film dans sa globalité, ou un personnage en particulier, ou un thème, etc., tout élément qui ne peut pas être trouvé seulement au fil du texte.
* IL y a deux types de documents :
  1. Les documents "formatés" comme les 5 fondamentales
  2. Les documents "libres" comme un texte qui est inventé pour une analyse propre
* On charge Writer en dur :
  - on inscrit des balises dans le document et on attend qu'elles aient finies d'être chargées pour poursuivre. L'avantage : inutile d'indiquer les fichiers, ils sont tous chargés.
* Poursuivre les expériences pour exporter en ePub et autre format
  - voir comment incorporer les fichiers dans le template
    Peut-être chaque fichier doit-il avoir un ID (OUI), et une position:after
    et :before qui le place, et d'autres propriétés comme la position x ou y
    si c'est une image par exemple, ou des styles particuliers à appliquer,
    etc.

* Donc plutôt faire comme ça :
  - le publisher s'ouvre dans une nouvelle page (`pubW`)
  - il utilise (`loadURL`) une adresse "vierge" au départ, puis une page provenant d'un dossier `building` de l'analyse (qui contient toutes les images)
  - ce dossier contient le fichier `<filmId>-v-<version>.html` qui est la version HTML de l'analyse.
  - c'est version qui est transformée en ePub et peut-être autre version.
  - pour le format des pages (html ou markdown), essayer les deux pour voir quel serait le meilleur

* Faire un fichier `metadata.yml` pour les métadonnées du livre

* Une classe **Writer** pour écrire les longs textes de l'analyse. Un writer sera un grand textarea qui sera placé à la place du reader (ou un texte volant)

* PFA
  Construction du graphique du PFA.

* Menu pour passer à la version suivante de l'analyse
  - faut-il conserver un certain nombre de versions ?

* Pouvoir avoir un résumé (dans le reader) de l'état de l'analyse courante
  - nombre d'events (et peut-être le détail par type, mais en ouvrant un div-dossier)
  - nombre de Scènes
  - nombre de nœuds structurels définis


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
* API qui permettrait de récupérer les data des films online (au format json).
* On doit pouvoir rétrécir la largeur des eventers, writer, etc. Seul le visualisor, peut-être, doit être conserver pour donner l'apparence du document final.
