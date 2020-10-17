const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const fs = require("fs-extra");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ach2z.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const ObjectId = require("mongodb").ObjectId;
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("orders"));
app.use(fileUpload());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client.db("creative-agency").collection("services");
  const ordersCollection = client.db("creative-agency").collection("orders");
  const reviewCollection = client.db("creative-agency").collection("reviews");
  const adminsCollection = client.db("creative-agency").collection("admins");
  
  
  app.get("/allServices", (req, res) => {
    console.log('ok');
    ordersCollection.find({}).toArray((err,documents) => {
      console.log('sefsasfasfsdafasdfsdafasdfasdfasdf',documents);
      res.send(documents);
    });
  });


  app.post("/addOrder", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const service = req.body.service;
    const projectDetails = req.body.projectDetails;
    const price = req.body.price;
    const file = req.files.file;
    const newImg = file.data;
    const encImg = newImg.toString("base64");

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };
    ordersCollection
      .insertOne({ name, email, service, projectDetails, price, image })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  app.get("/getServices", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      console.log(documents);
      res.send(documents);
    });
  });

  app.post("/addService", (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const file = req.files.file;
    const newImg = file.data;
    const encImg = newImg.toString("base64");
    

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };
    console.log(name, description,image);
    serviceCollection
      .insertOne({ name, description, image })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  

  app.get("/showOrders", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addReview", (req, res) => {
    const feedback = req.body;
    reviewCollection.insertOne(feedback).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/getReview", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addAdmin", (req, res) => {
    const email = req.body;
    console.log(email);
    adminsCollection.insertOne(email).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/checkAdmin", (req, res) => {
    const admin = req.query.email;
    adminsCollection.find({email:admin}).toArray((err, documents) => {
      res.send(documents);
    });
  });



});



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port);
