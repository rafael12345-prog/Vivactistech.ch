# vivactistech.ch

Landing pages publiées sur **vivactistech.ch**, hébergées chez Infomaniak sur un site
de type **Node.js**.

## Organisation des pages

Les pages vivent dans `src/`, une landing par dossier :

```
src/
  index.html            -> https://vivactistech.ch/
  <nom>/index.html      -> https://vivactistech.ch/<nom>/
  assets/               -> fichiers partagés (CSS, images, polices…)
```

Les fichiers propres à une landing (images, CSS, etc.) sont rangés dans son dossier,
à côté de son `index.html`.

Pour ajouter une landing : créer `src/<nom>/index.html`, commit, push sur `main`,
puis mettre à jour le site depuis Infomaniak (voir plus bas).

## Build et serveur

Tout est en Node.js pur, **sans aucune dépendance** :

```
npm run build   # scripts/build.js copie src/ vers dist/
npm start       # server.js sert dist/ sur le port $PORT (3000 par défaut)
```

`server.js` est un serveur statique minimal (modules natifs de Node uniquement) :

- il sert le contenu de `dist/` ;
- `/dossier` redirige vers `/dossier/` (sinon les chemins relatifs des pages cassent) ;
- une page inconnue renvoie une 404 ;
- toute tentative de sortir de `dist/` est refusée (403).

Test en local :

```
npm run build && npm start
# puis ouvrir http://localhost:3000/
```

## Mise en ligne

Il n'y a **pas** de déploiement par GitHub Actions : Infomaniak refuse pour l'instant
l'authentification par clé SSH, l'ancien workflow `rsync` a donc été supprimé.

Le déploiement passe par le **git intégré au tableau de bord Infomaniak**, qui a cloné
ce dépôt (branche `main`) sur le serveur.

```
modification -> commit + push sur main -> mise à jour git depuis le Manager Infomaniak
             -> npm run build -> redémarrage du site (npm start)
```

Réglages attendus du site Node.js dans le Manager Infomaniak :

| Réglage | Valeur |
|---|---|
| Branche | `main` |
| Commande de build | `npm run build` |
| Commande de démarrage | `npm start` |
| Version de Node | 18 ou plus (`.nvmrc` indique 20) |

Le port est fourni par Infomaniak via la variable d'environnement `PORT`, que
`server.js` lit automatiquement.

`dist/` n'est pas versionné : il est reconstruit sur le serveur à chaque mise à jour.
Après un push sur `main`, rien ne change en ligne tant que le site n'a pas été mis à
jour (pull + build + redémarrage) depuis le Manager.

## Règles de contenu

- Chemins **relatifs** ou absolus depuis la racine (`/assets/...`), jamais un chemin local.
- Aucune dépendance npm : le build et le serveur n'utilisent que Node.js.
