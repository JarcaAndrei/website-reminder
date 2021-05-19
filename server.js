const express = require('express')
const bodyParser = require('body-parser')
const exp = express()
exp.use(express.static('public'))
exp.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url, {
  useUnifiedTopology: true
    }, (error, client) => {
  if (error) return console.error(error)


  const db = client.db('program');
  const packageInfo = db.collection('query');


  exp.listen("3000", () =>
    console.log("http://localhost:3000")
  );
  //cit
  exp.get('/query', function (req, res) {
      let sortH = { hour : 1};
      const cursor = packageInfo.find().sort(sortH).toArray()
      .then(results => {
        res.send(results);
      })
      .catch(error => console.error(error))
  })
  //creare
  exp.post('/query', (req, res) => {
    packageInfo.insertOne(req.body)
      .then(result => {
        res.status(200);
        res.redirect("/");
      })
      .catch(error => console.error(error))
  })
  //sterg
  exp.delete('/query', (req, res) => {
    let getter = require('mongodb').ObjectID
    let id = new getter(req.body._id);
    packageInfo.deleteOne(
      { "_id": id }
    )
      .then(result => {
        res.redirect("")
      })
      .catch(error => console.error(error))
  })
  //update
  exp.put('/query', (req, res) => {
    let getter = require('mongodb').ObjectID
    let id = new getter(req.body.ID);
    packageInfo.findOneAndUpdate(
      { "_id": id },
      {
        $set: {
          hour: req.body.hour,
          day: req.body.day,
          text: req.body.text
        }
      },
      {
        upsert: true
      }
    )
      .then(result => { 
        res.redirect("")
      })
      .catch(error => console.error(error))
  })
})
