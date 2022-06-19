# back_failure_security
 
gestion de package utilisé : NPM

Installation de prisma :
npm install prisma --save-dev
npx prisma db pull   
npx prisma generate

npm install mysql
npm install dotenv --save

utilisation d'express
et de jwt

Utilisation d'un CORS en full access (*)

Pour le front, j'ai repris un projet existant avec le framework angular, 
j'ai enlevé plusieurs éléments de la bdd donc il permet juste d'accéder à la page login pour faire l'injection sql
L'identifiant et le password (l'injection) est au dessus de l'input

Pour le CRSF, je suis sur une SPA donc je n'ai pas réussi à le faire.

Résultat de la commande 'npm list'
├── @prisma/client@3.15.2
├── bcrypt@5.0.1
├── body-parser@1.20.0
├── cors@2.8.5
├── dotenv@16.0.1
├── express@4.18.0
├── http-errors@2.0.0
├── jsonwebtoken@8.5.1
├── mysql@2.18.1
├── nodemon@2.0.16
├── prisma@3.15.2
├── ts-node@10.7.0
└── typescript@4.6.2

résultat de npm list -g
├── @angular/cli@13.2.4
├── @nestjs/cli@8.2.5
├── create-react-app@5.0.0
├── expo-cli@5.4.3
├── express-generator@4.16.1
├── node-gyp@9.0.0
├── nodemon@2.0.15
├── sequelize-cli@6.4.1
├── typeorm@0.2.45
└── yarn@1.22.17

