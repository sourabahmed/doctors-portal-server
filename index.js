const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connect mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u39pp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('doctors_portal');
        const appointmentCollection = database.collection('appointments');

        app.post('/appointments', async(req, res) => {
          const appointment = req.body;
          const result = await appointmentCollection.insertOne(appointment);

          console.log(appointment);
          res.send(result);
        });
        app.get('/appointments', async(req, res) => {
          // const appointment = req.body;
          const email = req.query.email;
          const query = {email:email}
          const result = await appointmentCollection.find(query).toArray();

          // console.log(appointment);
          res.send(result);
        });
    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Doctors Portal !')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})