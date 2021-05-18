var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require("nodemailer");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("file");

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
    admin BOOLEAN DEFAULT FALSE,
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

        connection.query(
          `
          SELECT * FROM Users WHERE email = "${email}"
          `,
          function (err, results, fields) {
            if (err) {
              console.log(err)
              res.json({ success: false, message: "Votre compte a bien été créé, mais la connexion a échoué. Merci de vous rendre sur la page de Connexion pour vous connecter" })
              return;
            }

            const user = results[0];
            res.json({ success: true, message: "Vous êtes bien inscrit sur le site", user: user })
          }
        )




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

  try {

    const userId = req.body.userId
    // on fait une reqête pour voir si le user est admin

    connection.query(
      `
    SELECT * FROM Users WHERE user_id="${userId}"
    `,
      function (err, results, fields) {
        if (err) {
          res.json({ success: false, message: "Erreur lors de l'inscription, merci de réessayer" })
          return;
        }

        if (results.length == 0) {
          res.json({ success: false, message: "Utilisateur inexistant" })
          return
        }

        if (!results[0].admin) {
          res.json({ success: false, message: "Vous devez être un administrateur pour ajouter un fournisseur" })
          return
        }

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
    const userId = req.body.userId
    // on fait une reqête pour voir si le user est admin

    connection.query(
      `
    SELECT * FROM Users WHERE user_id="${userId}"
    `,
      function (err, results, fields) {
        if (err) {
          res.json({ success: false, message: "Erreur lors de l'inscription, merci de réessayer" })
          return;
        }

        if (results.length == 0) {
          res.json({ success: false, message: "Utilisateur inexistant" })
          return
        }

        if (!results[0].admin) {
          res.json({ success: false, message: "Vous devez être un administrateur pour ajouter un produit" })
          return
        }
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

      }
    )

  } catch (e) {
    console.log(e)
  }
})

router.put("/updateproduct", (req, res) => {
  try {

    const { product_id, nom_produit, prix_produit, description_courte, description_longue, frais_port, img_url } = req.body


    connection.query(
      `
    UPDATE Products SET nom_produit = "${nom_produit}", prix_produit = "${prix_produit}", description_courte = "${description_courte}", description_longue = "${description_longue}", img_url = "${img_url}", frais_port = "${frais_port}" WHERE product_id = "${product_id}"
    `,
      function (err, results, fields) {
        if (err) {
          console.log(err)
          res.json({ success: false, message: "Erreur lors de la mise à jour du produit" })
          return;
        }
        console.log(err)
        console.log(results)
        console.log(fields)
        res.json({ success: true, message: "Le produit a bien été mis à jour" })

      }
    )

  } catch (e) {
    console.log(e)
    res.sendStatus(500)
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

// route pour récup le profil du produit
router.get('/getprofileproduct/:product_id', (req, res) => {
  try {
    const product_id = req.params.product_id
    // dans un premier temps on récupère le vendor avec son id
    connection.query(
      `
    SELECT * FROM Products WHERE product_id = ${product_id}
    `,
      function (err, products, fields) {
        if (err || products.length == 0) {
          console.log(err)
          res.json({ success: false, message: "Erreur lors de la récupération du produits, merci de réessayer" })
          return;
        }
        const product = products[0]
        connection.query(
          `
    SELECT * FROM Vendors WHERE vendor_id = ${product.producteur_id}
    `,
          function (err, vendors, fields) {
            if (err || vendors.length == 0) {
              console.log(err)
              res.json({ success: false, message: "Erreur lors de la récupération des produits, merci de réessayer" })
              return;
            }
            const vendor = vendors[0]

            console.log(vendor)
            res.json({ success: true, product, vendor })

          }
        )
      }
    )
  } catch (e) {
    console.log(e)
  }
})

// route pour récup le profil du vendeur et ses produits
router.get('/getprofilevendor/:vendor_id', (req, res) => {
  try {
    const vendor_id = req.params.vendor_id
    // dans un premier temps on récupère le vendor avec son id
    connection.query(
      `
    SELECT * FROM Vendors WHERE vendor_id = ${vendor_id}
    `,
      function (err, vendors, fields) {
        if (err || vendors.length == 0) {
          console.log(err)
          res.json({ success: false, message: "Erreur lors de la récupération des produits, merci de réessayer" })
          return;
        }
        const vendor = vendors[0]

        // on récupère maintenant tous les produits du vendor trouvé
        connection.query(
          `
          SELECT * FROM Products WHERE producteur_id = ${vendor.vendor_id}
          `,
          function (err, products, fields) {
            if (err) {
              console.log(err)
              res.json({ success: false, message: "Erreur lors de la récupération des produits, merci de réessayer" })
              return;
            }
            console.log(products)

            res.json({ success: true, products: products, vendor: vendor })

          }
        )



      }
    )
  } catch (e) {
    console.log(e)
  }
})


async function sendMail(receiver, products, total, user) {
  try {
    const emailTransporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 465,
      service: 'yahoo',
      secure: false,
      auth: {
        user: 'projetvrac@yahoo.com',
        pass: 'agdvpuiwncbfxojb'
      },
      debug: false,
      logger: true
    });

    // send mail with defined transport object
    let info = await emailTransporter.sendMail({
      from: '"Projet Vrac" <projetvrac@yahoo.com>', // sender address
      to: ["projetvrac@yahoo.com", receiver], // list of receivers
      subject: "Nouvelle commande", // Subject line
      text: "Nouvelle commande de la part de " + user.nom, // plain text body
      html: 'TOTAL: ' + total + '€ ' + JSON.stringify(products), // html body
    });

    console.log(info)
  } catch (e) {
    console.log(e)
  }

}

router.post('/sendDevis', async (req, res) => {
  try {
    const products = req.body.listProducts
    const user = req.body.user
    const total = req.body.total

    // on regroupe les produits par producteur
    let grouped = products.reduce(function (r, a) {
      r[a.email] = r[a.email] || [];
      r[a.email].push(a);
      return r;
    }, Object.create(null));


    // on parcourt les produits des producteurs et on envoie un mail
    for (var key of Object.keys(grouped)) {
      await sendMail(key, grouped[key], total, user)
    }

    res.json({ success: true, message: "Votre commande a bien été prise en compte." })

  } catch (e) {
    console.log(e)
  }
})


router.post('/upload', upload, (req, res) => {
  try {
    console.log(req.file)
    res.json({ success: true, url: req.file.filename })
  } catch (e) {
    console.log(e)
  }
})





module.exports = router;
