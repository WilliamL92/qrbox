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

// knex('company').insert({name: "Sodexo", position: "{latitude: 5.15644568, longitude: 2.14586455}"}).then(()=>{
//   console.log("data inserted")
// })

// knex('products').insert({name: "RTX 3080 TI", item_id: "", quantity: 25, id_company: 2}).then(()=>{
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
  knex("products").leftJoin('company','products.id_company','company.id').where({item_id: req.params.id}).select('*').then((products)=>{
    res.json(products)
  })
})


app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})