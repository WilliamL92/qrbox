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

// app.get('/products/:id', (req, res) => {
//   knex.select('*').from('products').where({item_id: req.params.id}).then((products)=>{
//     res.json(products)
//   })
// })

app.get('/products/:id', (req, res) => {
  knex.select('*').from('products').leftJoin("company","company.id","products.id_company").where({item_id: req.params.id}).then((products)=>{
    res.json(products)
  })
})


app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})