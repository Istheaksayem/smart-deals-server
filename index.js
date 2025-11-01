const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb')
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

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result)
        })

        app.delete('/products/:id', (req, res) => {
            const id =req.params.id;
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
