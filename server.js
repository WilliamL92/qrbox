require('dotenv').config()
const express = require('express')
const app = express()
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

// let cpny = ["Mozarella", "RTX 3080 TI", "Carbonara", "Vivobook", "Surface pro", "Macbook pro", "Pâte à tartiner", "Ecran 244Hz", "Spaghetti", "Lasagne surgelé", "Souris gamer"]

// const mailjet = require ('node-mailjet')
// .connect(process.env.MAIL_PUBLIC_KEY, process.env.MAIL_PRIVATE_KEY)

// for(let i = 1; i <= 11; i++){
//   knex('products').where({id: i}).update({item_id: `${i}${i+1}${i-1}`}).then(()=>{
//     console.log(`done id: ${i}`)
//   })
// }


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

app.get('/products/:id', (req, res) => {
  knex.select('*').from('products').where({item_id: req.params.id}).then((products)=>{
    res.json(products)
  })
})

app.get('/approvisionnement', (req, res)=>{
  let htmlPart = ""
  let textPart = ""
  knex('products').where({name: req.query.name}).select('*').then((products)=>{
    if(req.query.id == 1){
      textPart = `Une livraison contenant ${req.query.name} est arrivé !`
      htmlPart = `<p>L'article ${req.query.name} a été réapprovisionné. Le stock en entrepôt est désormais de ${(parseInt(req.query.quantity) + parseInt(products[0].quantity_entrepot))}</p><br><div style="display: flex; flex-direction: row; flexwrap: wrap; align-items: flex-end;"><img width="35" height="35"style="border-radius: 7px;" src="https://qrboxstorage.s3.eu-west-3.amazonaws.com/QR'box.png" alt="logo">&nbsp;<b><p style="font-size: 11px;">L'équipe QRBOX vous remercie pour votre confiance.</p></b></div>`
      knex('products').where({name: req.query.name}).update({quantity_entrepot: (parseInt(req.query.quantity) + parseInt(products[0].quantity_entrepot))}).then(()=>{
      })
    }
    else if(req.query.id == 2){
      textPart = `Une livraison contenant ${req.query.name} est arrivé !`
      htmlPart = `<p>L'article ${req.query.name} a été réapprovisionné en rayon. Le stock en rayon est désormais de ${(parseInt(req.query.quantity) + parseInt(products[0].quantity))}</p><br><div style="display: flex; flex-direction: row; flexwrap: wrap; align-items: flex-end;"><img width="35" height="35"style="border-radius: 7px;" src="https://qrboxstorage.s3.eu-west-3.amazonaws.com/QR'box.png" alt="logo">&nbsp;<b><p style="font-size: 11px;">L'équipe QRBOX vous remercie pour votre confiance.</p></b></div>`
      knex('products').where({name: req.query.name}).update({quantity: (parseInt(req.query.quantity) + parseInt(products[0].quantity))}).then(()=>{
      })
    }
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
              "Email": req.query.email,
              "Name": "Qrbox"
            }
          ],
          "Subject": textPart,
          "TextPart": "QRBOX",
          "HTMLPart": htmlPart,
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
  
})

app.get('/insertProducts', (req, res)=>{
  knex('products').insert({name: req.query.product, item_id: req.query.item_id, quantity_rayon: 0, quantity_entrepot: req.query.quantity_entrepot, company_name: req.query.company}).then((e)=>{
    res.send(e)
  }).catch((e)=>{
    res.send(`error: ${e}`)
  })
})

app.post('/insertproducts', (req, res)=>{
  res.send(`success ${req.body}`)
})


app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})