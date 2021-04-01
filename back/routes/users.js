var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
    password VARCHAR(200),
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
  `
  ,
  function (err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);


connection.query(
  `
  CREATE TABLE IF NOT EXISTS Vendors (
    vendor_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom_entreprise VARCHAR(100) NOT NULL,
    nom_gerant VARCHAR(100) NOT NULL,
    prenom_gerant VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    adresse VARCHAR(500),
    categorie VARCHAR(100),
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
  `
  ,
  function (err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);


connection.query(
  `
  CREATE TABLE IF NOT EXISTS Products (
    product_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom_produit VARCHAR(100) NOT NULL,
    prix_produit FLOAT(6) NOT NULL,
    description_courte VARCHAR(300) NOT NULL,
    description_longue VARCHAR(600) NOT NULL,
    producteur_id INT(6) NOT NULL,
    poids_produit FLOAT(6) NOT NULL,
    tva_produit FLOAT(6) NOT NULL,
    frais_port FLOAT(6) NOT NULL,
    categorie_produit VARCHAR(100),
    quantites_disponibles INT(6) NOT NULL,
    img_url VARCHAR(100),
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

  bcrypt.hash(password, saltRounds, function (err, hash) {
    console.log(hash)
    // Store hash in your password DB.
    connection.query(
      `
    INSERT INTO Users (nom, prenom, email, password) VALUES ("${nom}", "${prenom}", "${email}", "${hash}")
    `,
      function (err, results, fields) {
        if (err) {
          console.log(err)
          res.json({ success: false, message: "Erreur lors de l'inscription, merci de réessayer" })
          return;
        }
        console.log(err)
        console.log(results)
        console.log(fields)
        res.json({ success: true, message: "Vous êtes bien inscrit sur le site" })

      }
    )
  });



})

router.post('/login', (req, res) => {
  // req comme request: contient tout ce que le front-end nous a envoyé
  // res comme response: contient tout ce qu'on va envoyer au front-end
  const email = req.body.email
  const password = req.body.password


  connection.query(
    `
    SELECT * FROM Users WHERE email="${email}"
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
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          res.json({ success: true, message: "La connexion s'est bien passée", user: user })

        } else {
          res.json({ success: false, message: "Email ou mot de passe erroné" })

        }

      });

    }
  )

})



router.post('/addvendor', (req, res) => {
  console.log(req.body)

  try {
    const nom_gerant = req.body.nom_gerant
    const nom_entreprise = req.body.nom_entreprise
    const prenom_gerant = req.body.prenom_gerant
    const email = req.body.email
    const adresse = req.body.adresse
    const categorie = req.body.categorie

    connection.query(
      `
    INSERT INTO Vendors (nom_entreprise, nom_gerant, prenom_gerant, email, adresse, categorie) VALUES ("${nom_entreprise}","${nom_gerant}", "${prenom_gerant}", "${email}", "${adresse}", "${categorie}")
    `,
      function (err, results, fields) {
        if (err) {
          console.log(err)
          res.json({ success: false, message: "Erreur lors de l'ajout d'un producteur, merci de réessayer" })
          return;
        }
        console.log(err)
        console.log(results)
        console.log(fields)
        res.json({ success: true, message: "Le producteur a bien été ajouté dans la base de données" })

      }
    )
  } catch (e) {
    console.log(e)
  }
})

// router pour récupérer tous les producteurs
router.get('/getvendors', (req, res) => {
  try {
    connection.query(
      `
    SELECT * FROM Vendors
    `,
      function (err, results, fields) {
        if (err) {
          console.log(err)
          res.json({ success: false, message: "Erreur lors de la récupération des producteurs, merci de réessayer" })
          return;
        }
        console.log(err)
        console.log(results)
        console.log(fields)
        res.json({ success: true, vendors: results })

      }
    )
  } catch (e) {
    console.log(e)
  }
})

router.post('/addproduct', (req, res) => {
  // req comme request: contient tout ce que le front-end nous a envoyé
  // res comme response: contient tout ce qu'on va envoyer au front-end

  try {
    const nom_produit = req.body.nom_produit
    const prix_produit = req.body.prix_produit
    const description_courte = req.body.description_courte
    const description_longue = req.body.description_longue
    const producteur_id = req.body.producteur_id
    const poids_produit = req.body.poids_produit
    const tva_produit = req.body.tva_produit
    const frais_port = req.body.frais_port
    const categorie_produit = req.body.categorie_produit
    const quantites_disponibles = req.body.quantites_disponibles
    const img_url = req.body.img_url

    console.log(req.body)

    connection.query(
      `
    INSERT INTO Products (nom_produit, prix_produit, description_courte, description_longue, producteur_id, poids_produit, tva_produit, frais_port, categorie_produit, quantites_disponibles, img_url) VALUES ("${nom_produit}", "${prix_produit}", "${description_courte}", "${description_longue}", "${producteur_id}", "${poids_produit}", "${tva_produit}", "${frais_port}", "${categorie_produit}", "${quantites_disponibles}", "${img_url}")
    `,
      function (err, results, fields) {
        if (err) {
          console.log(err)
          res.json({ success: false, message: "Erreur lors de l'enregistrement produit, merci de réessayer" })
          return;
        }
        console.log(err)
        console.log(results)
        console.log(fields)
        res.json({ success: true, message: "Le produit a bien été enregistrée" })

      }
    )
  } catch (e) {
    console.log(e)
  }
})


// route pour récupérer tous les produits
router.get('/getproducts', (req, res) => {
  try {
    connection.query(
      `
    SELECT * FROM Products LEFT JOIN Vendors ON Products.producteur_id = Vendors.vendor_id
    `,
      function (err, results, fields) {
        if (err) {
          console.log(err)
          res.json({ success: false, message: "Erreur lors de la récupération des produits, merci de réessayer" })
          return;
        }
        console.log(err)
        console.log(results)
        console.log(fields)
        res.json({ success: true, products: results })

      }
    )
  } catch (e) {
    console.log(e)
  }
})
module.exports = router;
