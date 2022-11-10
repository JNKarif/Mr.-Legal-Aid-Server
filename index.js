const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json())


// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ei4prfy.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('assignment11').collection('services');
        const service3Collection = client.db('assignment11').collection('services3');
        const reviewCollection = client.db('assignment11').collection('reviews');
        const AddedServiceCollection = client.db('assignment11').collection('addedservice');

        // creating all services api
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        });

        // creating 3 services api
        app.get('/services3', async (req, res) => {
            const query = {};
            const cursor = service3Collection.find(query);
            const services3 = await cursor.toArray();
            res.send(services3)
        });


        // creating single service api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service)
        });


        app.get('/services3/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service1 = await service3Collection.findOne(query);
            res.send(service1)
        });


        // reviews api
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
            console.log(result)
        });

        // added service api
       app.get('/addedservice', async(req, res)=>{
        let query= {};
        if (req.query.email) {
            query = {
                email: req.query.email
            }
        }
        const cursor= AddedServiceCollection.find(query);
        const addedService= await cursor.toArray();
        res.send(addedService);
       })
       
        app.post('/addedservice', async (req, res) => {
            const addedService = req.body;
            const result = await AddedServiceCollection.insertOne(addedService);
            res.send(result);
            console.log(result)
        });

        
      
    //   delete operation
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result= await reviewCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('assignment-11 sever is running')
})

app.listen(port, () => {
    console.log(`Assignment-11 server is running on ${port} `)
})