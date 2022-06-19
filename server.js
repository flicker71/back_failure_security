const express = require('express')
const app = express()
const port = 3080
var cors = require('cors');
var bodyParser = require('body-parser')

const { PrismaClient } = require('@prisma/client');
const { sign } = require("jsonwebtoken");
const { signAccessToken } = require('./utils/jwt');

const prisma = new PrismaClient()

const apiUrl = '/api/athena';
const apiUrlUser = apiUrl + '/user';
const apiUrlLesson = apiUrl + '/lesson';
const apiUrlLogin = apiUrl + '/login';

const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "security_web"
});

app.use(bodyParser.json());
app.use(cors());


function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

app.get(apiUrl, async (req, res) => {
  const data = {
    users: await prisma.users.findMany(),
    lessons: await prisma.lessons.findMany(),
  }
  res.status(200).json(data)
})

app.get(apiUrlUser + '/:userId', async (req, res) => {
  const user = await prisma.users.findUnique({
    where: {
      id: parseInt(req.params.userId),
    },
  })
  res.status(200).json(user)
})

app.get(apiUrlUser, async (req, res) => {
  const user = await prisma.users.findMany({})
  res.status(200).json(user)
})


app.post(apiUrlLogin, async (req, res) => {
  //Option 1 pour l'injection sql qui ne fonctionne pas totalement car je n'arrive pas à générer les informations dans mon token
  //l'injection avec ';-- ou // fonctionne
  //l'injection avec 'password' or 1=1 fonctionne, il me génère un jwt vide car je n'arrive pas à passer les data dans le payload ligne 90
  con.connect();
  const query = `SELECT * FROM users where mail = '${req.body.mail}' and password = ${req.body.password}`;

//Option 2 qui ne fonctionne pas car il ne prend pas en compte les commentaires
  // con.connect();
  
  // con.connect(function (err) {
  //   console.log("Connecté à la base de données MySQL!");
  //   // console.log('SELECT * FROM users where mail = "çagratte@gmail.com')//;-- and password = "' + req.body.password + '"');
  //   // console.log("SELECT * FROM users where mail = '" + req.body.mail + "' and password = 'test'");

  //   con.query("SELECT * FROM users where mail = '" + req.body.mail + "' and password = '" + req.body.password + "'", 
  //   async function (err, result) {
  //     console.log(result)
  //     console.log('err' ,  err)
  
      // console.log('query ', query)
      if (query) {
        const jsontoken = await signAccessToken({ mail: query[0].mail, password: query[0].password, username: query[0].username, firstName: query[0].first_name, lastName: query[0].last_name });
        // const jsontoken = await signAccessToken({ mail: result[0].mail, password: result[0].password, username: result[0].username, firstName: result[0].first_name, lastName: result[0].last_name });
        console.log(jsontoken)
        res.json({
          success: 1,
          message: "Login successfully ",
          token: jsontoken
        });
      }
      else {
        res.json({
          success: 0,
          data: "Fail authentification, mail =  'çagratte@gmail.com' password = 'test' "
        })
      }
    })
//   })
// })

app.post(apiUrlUser, async (req, res) => {
  console.log(req.body);
  const today = new Date();
  const { username, password, first_name, last_name, mail, last_time_online, is_admin, id_coach } = req.body;

  const user = await prisma.users.create({
    data: {
      username,
      password,
      first_name,
      last_name,
      mail,
      created_at: formatDate(today),
      last_time_online,
      is_admin,
      id_coach
    }
  });
  res.status(201).json({
    message: 'Utilisateur créé !',
    user
  });
});

app.get(apiUrlLesson + '/:lessonId', async (req, res) => {
  const lesson = await prisma.lessons.findUnique({
    where: {
      id: parseInt(req.params.lessonId),
    },
  })
  res.status(200).json(lesson)
})

app.post(apiUrlLesson, async (req, res) => {
  console.log(req.body);
  const today = new Date();
  const { name_lesson, content, comment, id_game, id_other } = req.body;

  const lesson = await prisma.lessons.create({
    data: {
      name_lesson,
      content,
      comment,
      id_game,
      id_other
    }
  });
  res.status(201).json({
    message: 'Lesson créé !',
    lesson
  });
});


app.put(apiUrlUser + '/:userId', async (req, res) => {
  const game = await prisma.game.update({
    where: {
      id: parseInt(req.params.gameId),
    },
    data: {
      username: req.body.username,
      password: hashSync(req.body.password, salt),
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      mail: req.body.mail,
      is_admin: req.body.is_admin,
      id_coach: req.body.id_coach
    }
  })

  res.status(200).json({
    message: 'Utilisateur modifié !',
    game
  });
});

app.delete(apiUrlUser + '/:userId', async (req, res) => {
  const user = await prisma.users.delete({
    where: {
      id: parseInt(req.params.userId),
    },
  })
  res.status(204).json({
    message: 'Utilisateur supprimé !',
    user
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})