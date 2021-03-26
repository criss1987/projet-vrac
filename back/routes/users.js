var express = require('express');
var router = express.Router();
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: '3308',
  user: 'admin',
  password: 'admin',
  database: 'ecommerce'
});


// on crée les tables une fois pour
connection.query(
  `
  CREATE TABLE IF NOT EXISTS Users (
    user_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(30) NOT NULL,
    prenom VARCHAR(30) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50),
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
  `
  ,
  function (err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);

router.post('/register', (req, res) => {
  // req comme request: contient tout ce que le front-end nous a envoyé
  // res comme response: contient tout ce qu'on va envoyer au front-end

  const nom = req.body.nom
  const prenom = req.body.prenom
  const email = req.body.email
  const password = req.body.password

  connection.query(
    `
    INSERT INTO Users (nom, prenom, email, password) VALUES ("${nom}", "${prenom}", "${email}", "${password}")
    `,
    function (err, results, fields) {
      if (err) {
        res.json({ success: false, message: "Erreur lors de l'inscription, merci de réessayer" })
        return;
      }
      console.log(err)
      console.log(results)
      console.log(fields)
      res.json({ success: true, message: "Vous êtes bien inscrit sur le site" })

    }
  )

})

router.post('/login', (req, res) => {
  // req comme request: contient tout ce que le front-end nous a envoyé
  // res comme response: contient tout ce qu'on va envoyer au front-end
  const email = req.body.email
  const password = req.body.password

  connection.query(
    `
    SELECT * FROM Users WHERE email="${email}" AND password="${password}"
    `,
    function (err, results, fields) {
      if (err) {
        res.json({ success: false, message: "Erreur lors de l'inscription, merci de réessayer" })
        return;
      }

      if (results.length == 0) {
        res.json({ success: false, message: "Email ou mot de passe erroné" })
        return
      }

      const user = results[0];
      res.json({ success: true, message: "La connexion s'est bien passée", user: user })

    }
  )

})

module.exports = router;
