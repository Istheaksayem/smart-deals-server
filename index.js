const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express()
const port = process.env.PORT || 3000;

// middleware

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://smartdbUser:0rAx4DT7RVOGsvdL@cluster0.ba90y0b.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// 0rAx4DT7RVOGsvdL

app.get('/', (req, res) => {
    res.send('smart server is running')
})

async function run() {
    try {
        await client.connect();

        const db = client.db('smart_db')
        const productsCollection = db.collection('products');
        const bidCollection = db.collection('bids')
        const userCollection =db.collection('users')

        // Users Api
        app.post('/users',async (req,res) =>{
            const newUser =req.body;

            const email =req.body.email
            const query ={email:email}
            const existingUser =await userCollection.findOne(query)
            if(existingUser){
                res.send({message:'user already exits.do not need to insert again'})
            }
            else{

                const result =await userCollection.insertOne(newUser)
                console.log(result)
                res.send(result)
            }

        })

        app.get('/products', async (req, res) => {

            // const projectFields = { title: 1, price_min: 1, price_max:1,image:1 }
            // const cursor = productsCollection.find()
            //     .sort({ price_min: -1 })
            //     .skip(2)
            //     .limit(2)
            //     .project(projectFields);

            console.log(req.query)

            const email = req.query.email;
            const query = {}
            if (email) {
                query.email = email;
            }


            const cursor = productsCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/latest-products',async(req,res) =>{
            const cursor =productsCollection.find().sort({created_at:-1}).limit(6);
            const result =await cursor.toArray();
            res.send(result)
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productsCollection.findOne(query)
            res.send(result)
         

        })


        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result)
        })

        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    name: updatedProduct.name,
                    price: updatedProduct.price
                }
            }
            const result = await productsCollection.updateOne(query, update)
            console.log(id, updatedProduct)
            res.send(result)
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productsCollection.deleteOne(query)
            res.send(result)
        })

        // bids related api
        app.get('/bids', async (req, res) => {
            const email = req.query.email;
            const query = {}
            if (email) {
                query.buyer_email = email;
            }

            const cursor = bidCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        
        app.get('/products/bids/:productId',async(req,res)=>{
            const product =req.params.productId;
            console.log(product)
            const query ={product:product}
            const cursor =bidCollection.find(query).sort({bid_price:-1})
            const result =await cursor.toArray()
            res.send(result)
        })

        app.get('/bids',async(req,res) =>{


            const query ={}
            if(query.email){
               query.buyer_email=email; 
            }

            const cursor =bidCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/bids',async(req,res)=>{
            const newBid=req.body;
            const result =await bidCollection.insertOne(newBid);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    finally {

    }
}

run().catch(console.dir)

app.listen(port, () => {
    console.log(`smart server is running on port ${port}`)
})
