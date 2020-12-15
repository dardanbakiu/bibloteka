const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const adminMiddleware = require('./middleware/adminMiddleware')
const bcrypt = require('bcrypt')

const session = require("express-session");
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/static", express.static("static"));
require('dotenv').config()

const db = mysql.createPool({
  user: process.env.DB_USERNAME,
  database: process.env.DB_EMRI,
  host: process.env.DB_HOST,
});

//Tabelat ne databaz
// - Librat (id,emri,autorin,sasia)
// - lexuesit (id,email,emri, librin qe ekan marr, daten, daten e kthimit)

app.get("/", (req, res) => {
  res.render("index", { info: '' });
});


app.get("/login", (req, res) => {
  res.render("adminLogin", { error: " " });
});

app.use(
  session({
    secret: "asdasdsdadsfwef",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 10 }, //1000ms * 60s * 10mins
  })
);

app.post("/loginForm", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  const query = `SELECT * FROM mbikqyresit WHERE email= "${email}"  `
  db.query(query, (err, results, fields) => {
    if (err) {
      console.log(err)
    }

    console.log(results)

    if (results.length != 0) {
      const dbEmail = results[0].email
      const dbPassword = results[0].password
      // if (dbEmail == email && dbPassword == password) {
      // console.log("jeni loguar")
      const verifiedQuery = `SELECT verified FROM mbikqyresit WHERE email="${email}" `
      db.query(verifiedQuery, (err, fields, response) => {
        // console.log(fields[0].verified)
        const isVerified = fields[0].verified
        if (isVerified === 'false') {
          res.render("adminLogin", { error: "Verifikoni llogarine tuaj" });
        }
        else {
          bcrypt.compare(password, dbPassword, (err, result) => {
            if (!result) res.redirect('/login')
            else {
              req.session.isLogged = email;
              res.redirect("/shtoLexues");
            }
          })

        }
      })
      // }
    }
    else {
      console.log("kredencialet jane gabim")
      res.render("adminLogin", { error: "Kredencialet jane gabim" });
    }

  })
});

app.get("/shtoLexues", adminMiddleware, (req, res) => {
  res.render("shtoLexues", { success: "" });
});

app.get('/superadmin', (req, res) => {
  res.render('superAdmin', { error: " " })
})

app.post('/loginSuperAdmin', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (username === 'dardanbakiu' && password === 'admin') {
    res.render('shtoMbikqyres', { error: '' })
  }
  else {
    res.render('superAdmin', { error: "Username/Password eshte gabim " })
  }
})

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fitim.mehmeti00@gmail.com',
    pass: process.env.EMAIL_PW
  }
});

app.post('/shtoMbikqyresForm', (req, res) => {
  const emri = req.body.emri
  const mbiemri = req.body.mbiemri
  const email = req.body.email
  const password = req.body.password
  const uuid = uuidv4()
  const verified = 'false'

  const doesExistQuery = `SELECT * FROM mbikqyresit WHERE email="${email}" `
  db.query(doesExistQuery, (err, fields, resussss) => {
    console.log(fields)
    if (fields.length === 0) {
      mailOptions = {
        from: 'fitim.mehmeti00@gmail.com',
        to: email,
        subject: 'Verifiko LLogarine',
        text: `Kliko ketu http://localhost:3000/verifiko/${uuid} qe te verifikosh llogarine tende `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      bcrypt.hash(password, 10, (err, hash) => {
        const query = `INSERT INTO mbikqyresit(emri,mbiemri,email,password,verified,uuid) VALUES("${emri}","${mbiemri}","${email}","${hash}","${verified}","${uuid}")`
        db.execute(query)
      })

      res.render('verifikoniEmail')
    }

    else {
      res.render('shtoMbikqyres', { error: 'kjo llogari ekziston' })
    }

  })


})

app.get('/verifiko/:id', (req, res) => {
  const uuid = req.params.id
  console.log(uuid)

  const dbQuery = `UPDATE mbikqyresit
  SET verified = 'true'
  WHERE uuid='${uuid}';`

  db.execute(dbQuery)
  res.redirect('/login')
})


const generator = require('generate-password');
const { query } = require("express");
app.post('/forgetPwForm', (req, res) => {
  const email = req.body.email
  const password = generator.generate({
    length: 10,
    numbers: true
  });

  const query = `UPDATE mbikqyresit SET password="${password}" WHERE email="${email}"`
  db.execute(query)
  mailOptions = {
    from: 'fitim.mehmeti00@gmail.com',
    to: email,
    subject: 'Passwordi i ri',
    text: `Passwordi juaj i ri eshte : ${password} `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
})

app.post("/shtoLexuesForm", (req, res) => {
  const email = req.body.email
  const emri = req.body.emri
  const libri = req.body.libri

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  today = dd + '/' + mm + '/' + yyyy;

  const dataMarrjes = today

  if (mm == 12) {
    mm = 1
    yyyy = parseInt(yyyy) + 1
  }
  else {
    mm = parseInt(mm) + 1
  }
  const dataKthimit = dd + '/' + mm + '/' + yyyy;

  const uuid = generator.generate({
    length: 10,
    numbers: false
  });

  const insertQuery = `INSERT INTO lexuesit(email,emri,emriLibrit,dataMarrjes,dataKthimit,uuid) VALUES("${email}","${emri}","${libri}","${dataMarrjes}","${dataKthimit}","${uuid}")`
  db.execute(insertQuery)

  res.render("shtoLexues", { success: "U shtua me sukses" });

  mailOptions = {
    from: 'fitim.mehmeti00@gmail.com',
    to: email,
    subject: 'Verifiko LLogarine',
    text: `Kodi juaj i librit eshte : ${uuid} , keni kohe 1 muaj per te kthyer librin ose nshpi tvijm`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

})

app.post('/formaLibrit', (req, res) => {
  const kodi = req.body.marresiID

  const queryFinder = `SELECT * FROM lexuesit WHERE uuid="${kodi}" `
  db.query(queryFinder, (err, fields, result) => {
    if (err) console.log(err)
    console.log(fields[0])
    const infos = fields[0]
    res.render('index', { info: infos })
  })
})

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.log(err)
    else {
      console.log("keni dal")
      res.redirect('/')
    }
  })
})

app.post("/changePw", (req, res) => {
  const email = req.body.email
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword

  const isOnDbQuery = `SELECT email,password FROM mbikqyresit WHERE email="${email}"`
  db.query(isOnDbQuery, (err, rezultati, kolonat) => {
    if (rezultati.length === 0) {
      res.redirect('/shtoLexues')
    }
    else {
      console.log(rezultati)
      const dbEmail = rezultati[0].email
      const dbPassword = rezultati[0].password
      bcrypt.compare(oldPassword, dbPassword, (err, result) => {
        if (!result) res.redirect('/shtoLexues')
        else {

        }
      })
    }
  })

})

const port = 3000;
app.listen(port);