# BomberBlock

## Projet Synthese de fin de DEC en informatique

Mon Projet consiste en un jeu multijoueur en temps réel pour le web. Il est de style "MMORPG" (massively multiplayer online role playing game).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

To clone the repo localy, run

```sh
git clone https://github.com/SimonLegros/bomberblock.git
```

After cloning to entire project, you will have to install all dependencies

```sh
    npm install

    #If there is a problem with installing some dependencies, run the following
    npm audit fix
```

Then, run the following line

```sh
    npm run start
```

and you are now ready to access http://localhost:8080 to play!

### Prerequisites

To make my game run, you will need to install :

- [NodeJS](https://nodejs.org/en/download/) - The Javascript run-time environment on the server-side

- [SQLite3]() - The SGBD used to keep all data of games
  Install with NPM:
  > npm install sqlite3

### Installation

All you need is to clone the repository, start the server with the command "node server.js" and finally access "localhost:8080" on any browser. The game will be up and running!
Google Chrome is preferable for this project mainly because of its V8 engine that makes Javascript much faster to execute!

### Author

- **Simon Legros** - [SimonLegros](https://bitbucket.org/SimonLegros)
