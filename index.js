const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
const req = require('express/lib/request');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxf1j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
       await client.connect();
       const servicesCollection = client.db("practiceProject").collection("services");

       //find all read all
       app.get('/services', async(req,res)=>{
           const query = {};
           const cursor = servicesCollection.find(query);
           const services = await cursor.toArray();
           res.send(services);
       });

       app.post('/services',async(req,res)=>{
           const newService = req.body;
           const result = await servicesCollection.insertOne(newService);
           res.send(result);
       })

       app.get('/services/:id',async(req,res)=>{
           const id = req.params.id;
           const query = {_id:Object(id)};
           const result = await servicesCollection.findOne(query);
           res.send(result);
       })
       app.delete('/services/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await servicesCollection.deleteOne(query);
        res.send(result);
    })
   }
   finally{

   }
}
run().catch(console.dir);
//
app.get('/',(req,res)=>{
    res.send('Server is running..');
})


app.listen(port,()=>{
    console.log('Listening to port: ',port);
})