const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const cors = require('cors');
const port = 5000; // or process.env.PORT || 3000; 

//MIDDLEWARE
app.use(cors());
app.use(express.json());

// mongo connect================================
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5yjkp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    console.log('database connected successfully');
    const database = client.db("onlineSecurity_cameraShop");
    const productsCollection = database.collection("products");
 
    app.get('/products', async (req,res)=>{
       const cursor = productsCollection.find({});
       const products = await cursor.toArray();
       res.send(products)
    });
  //  products details==========================
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: ObjectId(id) };
      const products = await productsCollection.findOne(query);
      // console.log('load user id', id);
      res.json(products);
    });


    app.post('/products', async (req,res)=>{
 
    });
    app.get('/products/:id', async (req,res)=>{
 
    });
    app.put('/products/:id', async (req,res)=>{
 
    });
    app.delete('/products/:id', async (req,res)=>{
 
    });
   
  } 
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

 



 
app.get('/', (req, res) => {                                                    
  res.send('Hello From third eye infotech')
})
 
app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
  console.log('server running at port', port)
})
