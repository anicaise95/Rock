# Projet ROCK

Cette DAPP est un projet de tokenisation de biens immobiliers. 
La plateforme est une marketplace de vente de NFT adossés des biens immobiliers.

## Fonctionnalités de la DAPP

Fonctionnalités implémentées : 

- Enregistrement d'un nouveau bien immobilier
- Tokenisation du bien (Nombre de tokens, prix et mint)
- Affichage des biens (vue administrateur, NFT mintés ou non)
- Affichage des biens (vue investisseur, uniquement si les NTT ont été mintés)
- Achat de NFT ======>>>>>>> Attention : blocage sur le safeTransferFrom : problème d'approve 

Fonctionnalités pas encore implémentées : 
- Consulter les NFT détenus par un investisseur
- Consulter l'ensemble des NFT disponibles à la vente (vue synthétique)

Fonctionnalités à développer : 
- Gouvernance 
- versement des loyers

## Installation

```sh
# Récupération des sources depuis Github
$ git clone https://github.com/anicaise95/Rock.git (branche Master)
```

```sh
# Installation des dépendances Truffle
$ cd truffle
$ npm install
```

```sh
# Installation des dépendances du front 
$ cd client
$ npm install
```

```sh
# Installation des dépendances globales du projet 
$ cd ..
$ npm i
```


## Execution environnement local

```sh
# Dans un terminal, lancer la blockchain de développement Ganache (Installer Ganache au préalable si ce n'est pas fait)
$ ganache
```


Déployer le smart contract sur la blockchain de développement Ganache.
<ul>
 <li>Vérifier la présence du smartcontract dans le répertoire truffle/contracts/<b>marketplace.sol</b></li>
  <li>Vérifier la présence d'un fichier de migration dans truffle/migrations/1_xxxx.js</li>
</ul>

```sh
# Dans un autre terminal :
$ cd truffle
$ truffle migrate --reset
```

Démarrer le serveur front de dev : 

```sh
# Dans un autre terminal :
$ cd client
$ npm start
  Starting the development server ...
```

Lancer la DAPP via <a href='http/localhost:3000/'>http/localhost:3000/</a>

## Déploiement du smart contract sur le testnet Goerli

Le connecteur Infura Ethereum utilise l'API Infura JSON-RPC pour accéder à Ethereum.

```sh
# Créer le fichier /truffle/.env et renseigner :
INFURA_ID=XXXXXXXXXXXXX
MNEMONIC="XXXX XXXX XXXX XXXX XXXX XXX XXXXX XXXX"
```

INFURA_ID étant l'API KEY Infura
MNEMONIC étant la SEED du wallet (Metamask)

```sh
# Vérifier que le réseau Goerli est bien paramétré dans le fichier truffle/truffle-config.js
networks: {

    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider(`${process.env.MNEMONIC}`, `https://goerli.infura.io/v3/${process.env.INFURA_ID}`)
      },
      network_id: 5,
    }
  }
```

```sh
# Dans un terminal :
$ cd truffle
$ truffle migrate --network goerli 
```

## Tests unitaires


## Déploiement du front (REACT) sur VERCEL

La Dapp Voting a été déployée sur <a href='https://vercel.com/'>Vercel</a> et est accessible ici : <a href='https://rock-topaz.vercel.app/'>https://projet3-henna.vercel.app/</a>


## Présenttation de l'application en vidéo (LOOM)

Dans une petite video, je présente l'application : https://www.loom.com/share/7a3fd58ea1ce4e1480a500009430b556