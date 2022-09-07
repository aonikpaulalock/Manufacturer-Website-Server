const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors');
const app = express()
var jwt = require('jsonwebtoken');
require('dotenv').config()
const port = process.env.PORT || 4000
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    const orderCollection = client.db('Manufacturer').collection('orders');
    const reviewCollection = client.db('Manufacturer').collection('reviews');
    const profileCollection = client.db('Manufacturer').collection('profiles');
    const userCollection = client.db('Manufacturer').collection('users');
    const blogsCollection = client.db('Manufacturer').collection('blogs');
    const paymentCollection = client.db('Manufacturer').collection('payments');
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


         // Payment Api and Verify
      app.post('/create-payment-intent', async (req, res) => {
        const service = req.body;
        const price = service.price;
        const amount = price * 100;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'usd',
          payment_method_types: ['card']
        });
        res.send({ clientSecret: paymentIntent.client_secret })
      });


      // Upadate Payment
    app.patch('/orders/:id', async(req, res) =>{
      const id  = req.params.id;
      const payment = req.body;
      const filter = {_id: ObjectId(id)};
      const updatedDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId
        }
      }

      const result = await paymentCollection.insertOne(payment);
      const updatedOrder = await orderCollection.updateOne(filter, updatedDoc);
      res.send(updatedOrder);
    })

    // Get All Tools
    app.get("/tools", async (req, res) => {
      const result = await toolsCollection.find().toArray();
      res.send(result)
    })

    // Specifice Id Tools
    app.get("/tool/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const tools = await toolsCollection.findOne(filter);
      res.send(tools);
    })

    // Add Users
    app.post("/tools", async (req, res) => {
      const tools = req.body;
      const result = await toolsCollection.insertOne(tools)
      res.send(result)
    })


    // Delete Manage Product
    app.delete('/tool/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await toolsCollection.deleteOne(filter);
      res.send(result);
    })

    // User Order Data
    app.post("/orders", async (req, res) => {
      const order = req.body;
      // const query = { email: order.email }
      const result = await orderCollection.insertOne(order);
      res.send(result)
    })

    // User Ordering-Data per User
    app.get("/order", async (req, res) => {
      const email = req.query.email;
      const filter = { email: email }
      const cursor = orderCollection.find(filter);
      const result = await cursor.toArray()
      res.send(result);
    })

    // Load All User Aded Order
    app.get("/orders", async (req, res) => {
      const result = await orderCollection.find().toArray()
      res.send(result)
    })

    // Order Data Delete Normal User
    app.delete('/order/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(filter);
      res.send(result);
    })

// Payment Order Data
app.get('/order/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const result = await orderCollection.findOne(filter);
  res.send(result);
})

    // Reviews Get
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find().toArray()
      res.send(result)
    })

    // Post Reviews
    app.post("/review", async (req, res) => {
      const reviews = req.body;
      const result = await reviewCollection.insertOne(reviews);
      res.send(result)
    })


    // Profile Update
    app.post("/profile", async (req, res) => {
      const user = req.body;
      const result = await profileCollection.insertOne(user);
      res.send(result)
    })


    // Create User 
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      console.log(user);
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      // const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN)
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })


    //  Click Admin Button And Create admin
    app.put('/user/admin/:email', async (req, res) => {
      const userEmail = req.params.email;
      console.log(userEmail)
      const filter = { email: userEmail };
      console.log(filter);
      const updateDoc = {
        $set: { role: "admin" }
      }
      const result = await userCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    // Admin or Not
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const user = await userCollection.findOne(filter);
      const isAdmin = user.role === 'admin';
      res.send({ admin: isAdmin })
    })


    // Load All Users
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray()
      res.send(result)
    })


    // Load All Blogs
    app.get("/blogs", async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result)
    })
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const blogs = await blogsCollection.findOne(filter);
      res.send(blogs);
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