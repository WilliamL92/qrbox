require('dotenv').config()
const express = require('express')
const app = express()
const qrcode = require('qrcode')
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT),
      database : process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      }
    }
})

const mailjet = require ('node-mailjet')
.connect(process.env.MAIL_PUBLIC_KEY, process.env.MAIL_PRIVATE_KEY)

// qrcode.toDataURL("3", function (err, url) {
//   knex('products').where('id', "3").update({item_id: url}).then(()=>{
//     console.log(url)
//   })
// })


// knex('company').insert({name: "Sodexo", position: "{latitude: 5.15644568, longitude: 2.14586455}"}).then(()=>{
//   console.log("data inserted")
// })

// knex('products').insert({name: "Spaghetti", item_id: "2222", quantity: 25, id_company: 1}).then(()=>{
//   console.log("data inserted")
// })

app.get('/products', (req, res) => {
  knex("products").select('*').then((products)=>{
    res.json(products)
  })
})

app.get('/company', (req, res) => {
  knex("company").select('*').then((company)=>{
    res.json(company)
  })
})

app.get('/company/:id', (req, res) => {
  knex("company").where({id: req.params.id}).select('*').then((company)=>{
    res.json(company)
  })
})

app.get('/products/:id', (req, res) => {
  knex.select('products.*','company.name as company_name').from('products').leftJoin("company","company.id","products.id_company").where({item_id: req.params.id}).then((products)=>{
    res.json(products)
  })
})

app.get('/options', (req, res)=>{
  let mail = req.query.email
  let idOption = req.query.id
  const request = mailjet
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
      {
        "From": {
          "Email": "william.lavit@efrei.net",
          "Name": "Qrbox"
        },
        "To": [
          {
            "Email": mail,
            "Name": "Qrbox"
          }
        ],
        "Subject": "QRBOX",
        "TextPart": "QRBOX",
        "HTMLPart": `<h3>Vous avez choisi l'option ${idOption}</h3><h2>Modification effectué avec succès !</h2>`,
        "CustomID": "AppGettingStartedTest"
      }
    ]
  })
  request
  .then((result) => {
    res.json(result.body)
  })
  .catch((err) => {
    res.json(`error: ${err.statusCode}`)
  })
})


app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})