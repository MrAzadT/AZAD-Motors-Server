const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ikemc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carSell");
    const carsCollection = database.collection("cars");
    const allOrderCollection = database.collection("orders");
    const reviewCollection = database.collection("review");

    // get cars data
    app.get("/cars", async (req, res) => {
      try {
        const cursor = carsCollection.find({});
        const data = await cursor.toArray();
        res.send(data);
      } catch (err) {
        console.log(err);
      }
    });

    // get single car data
    app.get("/carsData/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      try {
        const singleData = await carsCollection.findOne({ _id: ObjectId(id) });
        res.json(singleData);
      } catch (err) {
        console.log(err);
      }
    });

    //  post order
    app.post("/orders", async (req, res) => {
      const data = req.body;
      try {
        const result = await allOrderCollection.insertOne(data);
        res.status(200).json(result);
      } catch (err) {
        console.log(err);
      }
    });

    //  add a  product
    app.post("/cars", async (req, res) => {
      const data = req.body;
      try {
        const result = await carsCollection.insertOne(data);
        res.status(200).json(result);
      } catch (err) {
        console.log(err);
      }
    });

    //  get single order
    app.get("/orders/:email", async (req, res) => {
      const { email } = req.params;
      try {
        const result = allOrderCollection.find({ email: email });
        const data = await result.toArray();
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
      }
    });

    // single order delete
    // app.get("/orderDelete/:id", async (req, res) => {
    //   const { id } = req.params;
    //   try {
    //     const result = allOrderCollection.deleteOne({ _id: ObjectId(id) });
    //     res.status(200).json({ message: "Deleted successfully" });
    //   } catch (err) {
    //     console.log(err);
    //   }
    // });

    //  add review
    app.post("/review", async (req, res) => {
      const data = req.body;
      try {
        const result = await reviewCollection.insertOne(data);
        res.status(200).json(result);
      } catch (err) {
        console.log(err);
      }
    });

    // get reviews

    app.get("/reviews", async (req, res) => {
      try {
        const cursor = reviewCollection.find({});
        const data = await cursor.toArray();
        res.send(data);
      } catch (err) {
        console.log(err);
      }
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
