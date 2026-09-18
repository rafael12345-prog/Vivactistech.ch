# vivactistech.ch

Landing pages publiées sur **vivactistech.ch**, hébergées chez Infomaniak.

## Comment une modification arrive en ligne

Ce dépôt est la seule source de vérité. Personne ne se connecte à Infomaniak à la main.

```
modification -> commit sur main -> GitHub Actions -> build Node -> Infomaniak
```

Tout ce qui est dans `src/` est buildé puis publié. Le reste du dépôt ne l'est pas.

## Build

Le build est du Node.js pur, sans framework imposé :

```
npm install
npm run build
```

`scripts/build.js` copie `src/` vers `dist/`. C'est `dist/` qui est ensuite envoyé sur
Infomaniak. Quand les landing pages définitives remplaceront le contenu actuel de
`src/` (ou l'outillage de build, si un générateur type Astro/Vite/Next export est
introduit), seul `scripts/build.js` (ou le script `build` de `package.json`) a besoin
d'être adapté : le reste de la chaîne (CI, déploiement) ne change pas.

## Déploiement, côté technique

`.github/workflows/deploy.yml` construit `dist/` puis le synchronise par `rsync` via
SSH vers l'hébergement Infomaniak, à chaque push sur `main`.

Quatre secrets de dépôt sont nécessaires (Settings → Secrets and variables →
Actions) :

| Secret | Contenu |
|---|---|
| `INFOMANIAK_HOST` | nom d'hôte SSH de l'hébergement (ex. `xxx.ftp.infomaniak.com`) |
| `INFOMANIAK_USER` | utilisateur SSH de l'hébergement |
| `INFOMANIAK_SSH_KEY` | clé privée SSH dédiée au déploiement (la clé publique associée est ajoutée dans le panneau Infomaniak) |
| `INFOMANIAK_PATH` | chemin distant du dossier servi (ex. `/sites/vivactistech.ch/`) |

`INFOMANIAK_PORT` est optionnel (défaut `22`), à ajouter seulement si Infomaniak
impose un port SSH différent.

La clé SSH se génère en local (`ssh-keygen -t ed25519 -C "deploy-vivactistech-ch"`),
la clé publique s'ajoute depuis le Manager Infomaniak (Hébergement web → SSH), et
la clé privée va dans le secret `INFOMANIAK_SSH_KEY`. Elle n'a pas besoin d'exister
ailleurs que dans les secrets de ce dépôt.

## Règles de contenu

- Chemins **relatifs** ou absolus depuis la racine (`/assets/...`), jamais un chemin local.
- Pas de dépendance externe non versionnée : tout ce qui est nécessaire au build passe par `package.json`.
