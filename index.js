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

    app.get("/cars", async (req, res) => {
      try {
        const cursor = carsCollection.find({});
        const data = await cursor.toArray();
        res.send(data);
      } catch (err) {
        console.log(err);
      }
    });

    app.get("/carsData/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      try {
        const singleData = await carsCollection.findOne({ _id: ObjectId(id) });
        res.json(singleData);
      } catch (error) {
        res.status(404).json({ message: error.message });
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
