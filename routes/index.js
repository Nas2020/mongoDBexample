var express = require('express');
var router = express.Router();

var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb+srv://userNas:userNas@cluster0-jzbyc.gcp.mongodb.net/html_form?retryWrites=true&w=majority';

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
const dbName = 'html_form';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    var db = client.db(dbName);
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc, err) {
        assert.equal(null, err);
        resultArray.push(doc);
    }, function(){
      client.close();
      res.render('index', {items: resultArray});
    });
  });
});

router.post('/insert', function(req, res, next) {
  var item = {
    name: req.body.name,
    height: req.body.height,
    weight: req.body.weight,
    image: req.body.image
  };

  MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    var db = client.db(dbName);
    db.collection('user-data').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      client.close();
    });
  });

  res.redirect('/');
});

router.post('/update', function(req, res, next) {
  var item = {
    name: req.body.name,
    height: req.body.height,
    weight: req.body.weight,
    id: req.body.id,
    image: req.body.image
  };
  var id = req.body.id;
  MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    var db = client.db(dbName);
    db.collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      client.close();
    });
  });
  res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    var db = client.db(dbName);
    db.collection('user-data').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      client.close();
    });
  });
  res.redirect('/');
});

module.exports = router;
