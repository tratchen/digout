#digout - HTML5 Short Game

##objectifs du jeu

* Trouver la clé du niveau pour progresser sans mourrir
* Parcourir le plus de donjons possible -> score
* Booster son personnage via la monnaie obtenue en donjon
* Débloquer toutes les personnages
* Résoudre toutes les quêtes (trophés)

###Fonctionnement

Après une rapide introduction le joueur doit choisir le viel aventurier pour jouer. Le premier niveau est un tutoriel qui explique les bases. Cette aide peut être désactivée.

Le jeux consiste en une suite de donjon : plateaux fixes généré aléatoirement composé de cases de tas de sable. Certaines cases sont spéciales et doivent se trouver sur le plateau mais leurs position est aléatoire : L'entrée, la sortie, la clé, le marchand (pas toujours présent). Les cases "normales" doivent être creusées et peuvent contenir des ennemis, des coffres (avec chance de bonus) ou rien du tout.

Le marchand est très important dans ce jeu car il va permettre d'équilibrer un manque de chance coté joueur au début du jeu, et sera indispendable en fin de jeu pour obtenir des emeraudes rapidement.

Le personnage ne peut se déplacer que sur les zones nettoyées du sable ou non occupé par un monstre. Les monstres n'attaque que si on les attaques (en réponce de coups).

La difficulté augmente graduellement en fonction de l'avancement dans les niveaux .Les monstres gagnes en force et en endurance. Les monstres varient par palier.

Des monstres élites peuvent apparaîtres, ils sont identique au monstres normaux exepté pour les dégats, vie et récompences. Des boss peuvent faire leurs apparition (Maximum 1 par 5 niveaux à partir du niveau 5).

A chaque nouveau monstre rencontré un message décrit ce monstre.

La partie est sauvée a tout moment pour permettre aux joueur de revenir, continuer sa progression.

##Les personnages

### Le viel aventurier
* Faibles stats, personnage qui va servir a débloquer les features du jeu via des dialogues dans le jeu.
* Seul personnage avec des capacités à niveau unique.
* Capacité 1 : **"Chance"** : Active les chance de bonus
* Capacité 2 : **"Langes"** : Débloque l'options de commerce
* Capacité 3 : **"Mérite"** : Débloque l'options de trophés et introduit les émeraudes

Personnes accéssibles après le niveau 10 :

###L'assassin royal
* Personnage un peut plus endurant mais surtout plus puissant.
* Capacité 1 (3 niveaux) : **"En plein coeur"** : Chance de critique augmenté de 4, 6, 8%
* Capacité 2 (3 niveaux) : **"Initiative"** : Chance de frapper en premier dés l'apparition du monstre de 3, 6, 10%
* Capacité 3 (1 niveaux cher) : **"Sang royal"** : 5% chance de passer en mode trance d'assassin qui permet sur 3 déplacement/coups de tout esquiver, double frappe, regagne de vie en faisant des dégats

Personnages accessibles après le niveau 20 :

###Le robot-egyptien-momie
* Personnage insensibles aux affections (poison, stun …)
* Personnage très endurant mais faible force de frappe
* Capacité 1 (3 niveaux) : **"Bouclier"** : Chance de parer le permier coup d'un enemis 10, 15, 20%
* Capacité 2 (3 niveaux) : **"Réparations"** : A chaque entrée dans un nouveau donjon il regagne 2, 3, 5% du total de vie
* Capacité 3 (1 niveau) : **"Téléportation"** : Une fois la clés trouvée, possibilité de passer au niveau suivant directement

Personnages accessibles après le niveau 30 :

###L'ombre d'osiris
* Personnage destiné a obtenir plus d'or par partie
* Personnage au fonctionnement particulier : Il n'as pas de points de vie mais de l'or (100 pièces au départ).
* Quand il meurt les pièces sont perdues contrairement aux autres personnages
* Peut être sacrifié à tout moment pour un coup de 100 pièces d'or -> retour au départ avec les pièces trouvées
* Capacité 1 (3 niveaux) : **"Gold farmer"** : Chance d'augmenter l'or trouvé de 2, 4, 6%
* Capacité 2 (3 niveaux) : **"Les ombres"** : Chance de recevoir l'aider d'ombres qui attaque l'ennemis et prend les coups - Chance 2, 4, 6% - Ombre hit 1, 2, 3 - live 1, 2, 3
* Capacité 3 (1 niveau) : **"Immatériel"** : Peut traveser les monstres sans se faire attaquer

##Liste des monstres (par difficulté)

###Animaux Tier 1
* **Scarabé** : hit 1, live 2, bonus 0.25%
* **Gros Scarabé** : hit 1, live 4 (2 status), bonus 0.33%
* **Serpent** : hit 1, live 1, bonus 0.15%
* **Chat sans poils** : hit 1, live 1, bonus 0.15%, reborn: 0.50%
* **Ver** : hit 1, live 1, bonus 0.15%
* **Hippos** ailé : hit 2, live 4, bonus 0.50%

###Momies Tier 2
* **Momie** : hit 1.5, live 2, bonus 0.33%
* **Grosse Momie** : hit 2, live 4, bonus 1
* **Lady Momy** : hit 1.5, live 3, bonus 1, reborn 0.50%
 
###Maléfiques Tier 3
* **Statue d'argile** : hit 0 , live 1, bonus 0.15%
* **Sarcophage hanté** : hit 1, live 5, bonus 0.50%
* **Statue de chat** : hit 2, live 1, bonus 0.33%, reborn: 0.75%
* **Oeil Maléfique** : hit 3, live 2, bonus 0.25%
* **Coffre hanté** : hit 2, live 4, bonus 1

###Boss?
* **Le crocos Momie** : hit 5, live 10, bonus 1 + spécial bonus
* **L'homme des sables de star Wars** : hit 7, live 8, bonus 1 + spécial bonus
* **La statue à tête de chacal** : hit 5, live 15, bonus 1 + spécial bonus
* **Un sphynx corrompu** : hit 10, live 20, bonus 1 + spécial bonus

##Les bonus
###CLés de sortie
* Unique par niveau, permet de passé au suivant (se trouve dans le sable, après un combat de monstre obligatoire)

###Les anneaux d'or (appelé or)
* S'échange au marchant aléatoire contre : Vie (1 pour 1) émeraudes (10 pour 1).

###L'expérience
Se consomme hors jeu (popin) contre soit :
* Des niveaux -> amélioration de stats
* Échange contre or (2 pour 1);

###Les émeraudes
* Se gagne soit en jeu soit via trophés
* Ils sont plutôt rares
* Servent à amélioré sur les capacités des personnages

###Niveau total du joueur ?
* l'idée est de compiler tout les points obtenus durant les parties en un scrore unique et sauvé.

##In game design To Do

###Cases (96x96 - resolution 16x16)

* √ type 0 - Mur front
* o type 0 - Mur front variante cassé
* o type 0 - Mur front variante torche
* o type 0 - Mur front variante motifs A "oeil"
* o type 0 - Mur front variante motifs B "anubis"
* o type 0 - Mur front variante motifs C "sarcophage"
* √ type 0 - Mur coin top left
* √ type 0 - Mur coin top right
* o type 0 - Mur coin bottom left
* o type 0 - Mur coin bottom right

* √ type 1 - Sol
* √ type 1 - Sol alternative
 
* √ type 2 - Sable deco poterie
* o type 2 - Sable deco bloc de pierre
* o type 2 - Sable deco statue
* √ type 2 - Sable deco coupe

* o type 3 - Obstacle colonne
* √ type 3 - Obstacle colonne brisée
* o type 3 - Obstacle trou
* o type 3 - Obstacle statue

* o type 4 - Entrée open
* o type 4 - Entrée close

* o type 5 - Sortie open
* o type 5 - Sortie close


###Items
* Anneau d'or
* Emeraude
* Clé de sortie

###Entités
* Viel aventurier + animations
* * idle face
* * idle dos
* * marche face (animation)
* * marche dos (animation)
* * minage face (animation)
* * minage dos (animation)
* * ramasse un item
* * meurt (animation)


* Monstre 1 + animations
* * idle face
* * idle dos
* * frappe face (animation)
* * frappe dos (animation)
* * meurt (animation)

##Outside game design To Do

###Menus
* Accueil
* Choix perso
* Customisation perso
* Lancer mission

###UI
* Or, Emeraudes, vie, clé...

###Messages
* Mort + score, retour au départ

###Page
* habillage
* about