const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors');
const app = express()
// const jwt = require('jsonwebtoken');
require('dotenv').config()
const port = process.env.PORT || 4000
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Middletare
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.xaykuto.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: 'UnAuthorized access' });
//   }
//   const token = authHeader.split(' ')[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
//     if (err) {
//       return res.status(403).send({ message: 'Forbidden access' })
//     }
//     req.decoded = decoded;
//     next();
//   });
// }



async function run() {
  try {
    await client.connect()
    const toolsCollection = client.db('Manufacturer').collection('tools');
    // const orderCollection = client.db('toolsMenu').collection('orders');
    // const userCollection = client.db('toolsMenu').collection('users');
    // const reviewCollection = client.db('toolsMenu').collection('reviews');
    // const profileCollection = client.db('toolsMenu').collection('profiles');
    // const paymentCollection = client.db('toolsMenu').collection('payments');
    // Verify Admin

  //   const verifyAdmin = async (req, res, next) => {
  //     const requester = req.decoded.email;
  //     const requesterAccount = await userCollection.findOne({ email: requester });
  //     if (requesterAccount.role === "admin") {
  //       next();
  //     }
  //     else {
  //       res.status(403).send({ message: 'forbidden' });
  //     }
  //   }


  //   // Payment Api and Verify
  //   app.post('/create-payment-intent', verifyJWT, async (req, res) => {
  //     const service = req.body;
  //     const price = service.price;
  //     const amount = price * 100;
  //     const paymentIntent = await stripe.paymentIntents.create({
  //       amount: amount,
  //       currency: 'usd',
  //       payment_method_types: ['card']
  //     });
  //     res.send({ clientSecret: paymentIntent.client_secret })
  //   });

  // // Payment Update
  // app.patch('/orders/:id', verifyJWT, async(req, res) =>{
  //   const id  = req.params.id;
  //   const payment = req.body;
  //   const filter = {_id: ObjectId(id)};
  //   const updatedDoc = {
  //     $set: {
  //       paid: true,
  //       transactionId: payment.transactionId
  //     }
  //   }

  //   const result = await paymentCollection.insertOne(payment);
  //   const updatedOrder = await orderCollection.updateOne(filter, updatedDoc);
  //   res.send(updatedOrder);
  // })


    // Get All Tools
    console.log("Coooooooo")

    app.get("/tools", async (req, res) => {
      const result = await toolsCollection.find().toArray();
      res.send(result)
    })

    // // Add Users
    // app.post("/tools", async (req, res) => {
    //   const tools = req.body;
    //   const result = await toolsCollection.insertOne(tools)
    //   res.send(result)
    // })

    // // Delete User
    // app.delete('/tools/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: ObjectId(id) };
    //   const result = await toolsCollection.deleteOne(filter);
    //   res.send(result);
    // })

    // // Manage Products
    // app.get("/tools", async (req, res) => {
    //   const result = await toolsCollection.find().toArray();
    //   res.send(result)
    // })

    // // get Specific Tools

    // app.get("/tools/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const quary = { _id: ObjectId(id) }
    //   const tools = await toolsCollection.findOne(quary);
    //   res.send(tools)
    // })

    // // Order

    // app.post("/orders", async (req, res) => {
    //   const order = req.body;
    //   // const query = { email: order.email }
    //   const result = await orderCollection.insertOne(order);
    //   res.send(result)
    // })

    // // Load Order

    // app.get("/orders", verifyJWT, async (req, res) => {
    //   const email = req.query.email;
    //   const emailDecoded = req.decoded.email;
    //   if (email === emailDecoded) {
    //     const filter = { email: email }
    //     const result = await orderCollection.find(filter).toArray();
    //     return res.send(result)
    //   }
    //   else {
    //     return res.status(403).send({ message: "forbiden access" })
    //   }
    // })


    // // Load Specific Id Api
    // app.get("/orders/:id", verifyJWT, async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: ObjectId(id) }
    //   const result = await orderCollection.findOne(filter)
    //   res.send(result)
    // })


    // // Load All Orders
    // app.get("/order", async (req, res) => {
    //   const result = await orderCollection.find().toArray()
    //   res.send(result)
    // })

    // // Delete Orders
    //    app.delete('/orders/:id',verifyJWT, async (req, res) => {
    //     const id = req.params.id;
    //     const filter = { _id: ObjectId(id) };
    //     const result = await orderCollection.deleteOne(filter);
    //     res.send(result);
    //   })

    // // Load upadate User

    // app.put("/users/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const user = req.body;
    //   const filter = { email: email };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: user,
    //   };
    //   const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN)
    //   const result = await userCollection.updateOne(filter, updateDoc, options);
    //   res.send({ result, token })
    // })

    // // Create Admin role
    // app.put('/user/admin/:email', verifyJWT, verifyAdmin, async (req, res) => {
    //   const email = req.params.email;
    //   const filter = { email: email };
    //   const updateDoc = {
    //     $set: { role: 'admin' },
    //   };
    //   const result = await userCollection.updateOne(filter, updateDoc);
    //   res.send(result);
    // })


    // // Check admin or not
    // app.get('/admin/:email', async (req, res) => {
    //   const email = req.params.email;
    //   const user = await userCollection.findOne({ email: email });
    //   const isAdmin = user.role === 'admin';
    //   res.send({ admin: isAdmin })
    // })

    // // Load All Users
    // app.get("/users", verifyJWT, async (req, res) => {
    //   const result = await userCollection.find().toArray();
    //   res.send(result)
    // })

    // // get reviews data
    // app.get("/reviews", async (req, res) => {
    //   const result = await reviewCollection.find().toArray();
    //   res.send(result)
    // })

    // // Post reviews data
    // app.post("/reviews", async (req, res) => {
    //   const reviews = req.body;
    //   const result = await reviewCollection.insertOne(reviews)
    //   res.send(result)
    // })



    // // profile Collection
    // app.post("/profiles", async (req, res) => {
    //   const profiles = req.body;
    //   const result = await profileCollection.insertOne(profiles)
    //   res.send(result)
    // })


  }
  catch {

  }
}
run()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})