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

// knex("products").select("*").then((products)=>{
//   knex('company').select('*').then((company)=>{
//     console.log({products, company})
//   })
// }).catch((err)=>{
//     console.log(err)
// })

// knex('company').insert({id: 1, name: "Nvidia", position: "{latitude: 8.15644568, longitude: 4.14586455}"}).then(()=>{
//   console.log("data inserted")
// })

// knex('products').insert({id: 1, name: "Mozarella", qrcode: "", quantity: 55, id_company: 1}).then(()=>{
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


app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})