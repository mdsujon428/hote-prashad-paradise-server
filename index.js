const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const port = process.env.PORT || 9000;
const app = express();


//Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.witrp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db('Hotel');
        const servicesCollection = database.collection('serviece');
        const myOrdersCollection = database.collection('myOrders')
        const galleryCollection = database.collection('gallery');
        const gusetCollection = database.collection('gusets');

        // GET SERVICES DATA FROM database
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        })
        // GET ONE SERVICE DATA FROM servicesCollection
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        //POST API add a new service
        app.post('/services', async (req, res) => {
            const newService = req.body;
            const result = await servicesCollection.insertOne(newService)
            res.send(result)
        })
        //POST API. STORE data to myOrders
        app.post('/myOrders', async (req, res) => {
            console.log('hit to myOrders collection');
            const ORDER = req.body;
            // console.log('Order from client side : ',ORDER)
            // console.log(req.body)
            const email = req.body.email;
            const name = req.body.userName;
            const existOrder = await myOrdersCollection.insertOne(ORDER);
            console.log(existOrder)
            res.send(existOrder)
        })
        //GET DATA FROM myOrderscollection
        app.get('/myOrders',async(req,res)=>{
            const email = req.query.email;
            const cursor =myOrdersCollection.find({email:req.query.email});
            console.log('My Email is : ',email)
            const result =await cursor.toArray()
            console.log(result)
            res.json(result)
        })
        
        //GET GALLERY DATA FROM DATABASE
        app.get('/gallery', async (req, res) => {
            const cursor = galleryCollection.find({});
            const gallery = await cursor.toArray()
            res.send(gallery);
        })
        //GET GUESTS DATA FROM DATABASE
        app.get('/guests', async (req, res) => {
            const cursor = gusetCollection.find({});
            const guests = await cursor.toArray();
            // const count = guests.concat()
            res.send({
                guests
            })
        });
    }
    finally {
        // await close.client()
    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hitting the server')
});
app.listen(port, () => {
    console.log('Server is running on port ', port)
})

