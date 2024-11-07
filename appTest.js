//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/toDOListDB');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Required"]
  }
});

const Item = mongoose.model("Item", itemsSchema);

app.get("/", function(req, res) {

  const day = date.getDate(); 
  Item.find({}).then(function(Items) {
    res.render("list", {listTitle: day, newListItems: Items});
  }).catch(function(err) {
    console.error(err);
  });
});

app.post("/", function(req, res){

  const taskI = req.body.newItem;
  console.log(taskI);
  
  const items = new Item ({
    name: taskI
  });

  items.save();  
  res.redirect("/");
});

app.post("/delete", (req, res)=>{
  Item.deleteOne(
    { _id: req.body.checkbox },  // Filter
  ).then(result => {
    console.log(result);  // Logs the result of the update
  }).catch(err => {
    console.error(err);   // Logs any errors if the update fails
  });

  res.redirect('/');
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

