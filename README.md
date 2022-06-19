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