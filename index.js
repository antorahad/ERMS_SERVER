// Require files
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.s9c9pgn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Db connection
const dbConnection = async () => {
    try {
        client.connect();
        console.log("Db connection successful");
    } catch (error) {
        console.log(error.name, error.message);
    }
}

dbConnection();
// All database collections
const employeeCollection = client.db('emsDb').collection('employees');

// Default get
app.get('/', (req, res) => {
    res.send('EMS is running on port 4000')
})

// All API methods

// Post method
app.post('/employees', async (req, res) => {
    const newEmployee = req.body;
    console.log(newEmployee);
    const result = await employeeCollection.insertOne(newEmployee);
    res.send(result);
})

// Get method
app.get('/employees', async (req, res) => {
    const cursor = employeeCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})

// Single Get method
app.get('/employees/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await employeeCollection.findOne(query)
    res.send(result)
})

// Put method
app.put('/employees/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updateEmployee = req.body;
    const employee = {
        $set: {
            firstName: updateEmployee.firstName,
            lastName: updateEmployee.lastName,
            gender: updateEmployee.gender,
            email: updateEmployee.email,
            mobile: updateEmployee.mobile,
            telephone: updateEmployee.telephone,
            nid: updateEmployee.nid,
            employee_id: updateEmployee.employee_id,
            department: updateEmployee.department,
            designation: updateEmployee.designation,
            sallary: updateEmployee.sallary,
            joining: updateEmployee.joining,
            photo: updateEmployee.photo,
            status: updateEmployee.status,
            address: updateEmployee.address
        }
    };
    const result = await employeeCollection.updateOne(filter, employee, options);

    res.send(result)
})

//   Delete Method
app.delete('/employees/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await employeeCollection.deleteOne(query);
    res.send(result);
  })


// Port listening
app.listen(port, () => {
    console.log(`EMS listening on port ${port}`)
})