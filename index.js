const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000; 
// const port = 5000; // or process.env.PORT || 3000; 

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
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");
    const reviewsCollection = database.collection("reviews");

// Reviews for ui ====================================
    app.get('/reviews', async (req, res)=>{
       const cursor = reviewsCollection.find({});
       const reviews = await cursor.toArray();
       res.send(reviews); 
    });

    // Reviews post ================================
      app.post('/reviews', async (req, res)=>{
        const newReview = req.body;
        const result = await reviewsCollection.insertOne(newReview);
        res.json(result);
      })
 
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

     //Post Api: client to server for order conferm======
    app.post('/orders', async (req,res)=>{
      const orders = req.body;
      console.log(orders)
      const result = await ordersCollection.insertOne(orders);
      console.log(result);
      res.json(result);
    });
    // POST users 
    app.post('/users', async (req, res)=>{
      const users = req.body;
      console.log(users)
      const result = await usersCollection.insertOne(users);
      console.log(result);
      res.json(result);
    })

    // upsert===================
    app.put('/users', async (req, res)=>{
      const user = req.body;
      console.log('put',user);
      const filter = {email:user.email};
      const options = {upsert:true};
      const updateDoc = {$set:user};
      const result = await usersCollection.updateOne(filter,options, updateDoc);
      res.json(result);
    });

    //add admin==================================
    app.put('/users/admin', async (req, res)=>{
      const user = req.body;
      console.log('put',user);
      const filter = {email: user.email};
      const updateDoc = {$set:{roll:'admin'}};
      const result = await usersCollection.updateOne(filter,updateDoc);
      res.json(result);
    })

    //check Admin=============================
    app.get('/users/:email', async (req, res)=>{
      const email = req.params.email;
      const query = {email: email};
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
       
      if(user?.roll === 'admin'){
        isAdmin = true;
      }
      res.json({admin: isAdmin});
    }); 
    
    // server to allorder(seen on dasboard by email id)======
    app.get('/orders', async (req,res)=>{
     const email = req.query.email;
     const query = {email: email};
     const cursor = ordersCollection.find(query);
     const orders = await cursor.toArray();
     res.json(orders)
    });
// total order 
    app.get('/orders', async (req,res)=>{
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders)
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
