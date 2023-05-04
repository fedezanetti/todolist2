//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const mongoose = require("mongoose");

const app = express();


mongoose.connect('mongodb+srv://fede:artj82zc@cluster0.czb2bl3.mongodb.net/new_db?retryWrites=true&w=majority', { useNewUrlParser: true });
const itemsSchema = new mongoose.Schema ({
  name: String
});

const Item = mongoose.model("Item", itemsSchema );

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const bag = new Item ({
  name:"Bag"
});

const pc = new Item ({
  name:"PC"
});
const mouse = new Item ({
  name:"Mouse"
});

const defaultItems = [bag,pc,mouse];

async function insertMany(){
  try{
    const result = await Item.insertMany(defaultItems);
    console.log(result);
  } catch(err){
    console.log(err);
}}


app.get("/", function(req, res) {

  async function findItems(){
    try{
      const foundItems = await Item.find({});
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    } catch(err){
      console.log(err);
  }}

  findItems();
  

});

app.post("/", function(req, res){

 const itemName = req.body.newItem;
 const listName = req.body.list;
console.log(listName);
 const item = new Item ({
  name: itemName });
if (listName === "Today"){
  item.save();
  res.redirect("/")
} else{
  async function findList(listName){
    try{
      const buscar = await List.findOne({name:listName});
      
      buscar.items.push(item);
      buscar.save();
      res.redirect("/" +listName);
    } catch(err){
      console.log(err);
    }}
    findList(listName);
}


});

app.post("/delete", function(req, res) {

  const itemId = req.body.deleteItem;
  const listName = req.body.listName;

  async function deleteItem(itemId, listName) {
    try {
      const result = await Item.deleteOne({_id: itemId});
      console.log(result);
      
    } catch(err) {
      console.log(err);
    } 
    
    try {
      const result = await List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: itemId } } }
      );
      console.log(result);
      
    } catch (err) {
      console.log(err);
    }
    if (listName === "Today") {
      res.redirect("/");
    } else {
      res.redirect("/" + listName);
    }
  }

  deleteItem(itemId, listName);
});



const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/:paramName", function(req, res) {
  const paramNameValue = _.capitalize(req.params.paramName);
  
  async function deleteItem(listName){
    try{
      const resultados = await List.findOne({ name: listName });
      if (!resultados) {
      // Ya existe una lista con ese nombre, utiliza los resultados encontrados
      const list = new List({
        name: listName,
        items: defaultItems
      });
      list.save();
      res.render("list", {listTitle: list.name, newListItems: list.items});
    } else {
      
      
      res.render("list", {listTitle: resultados.name, newListItems: resultados.items});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}
  deleteItem(paramNameValue);
  
});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


async function deleteMany(){
  try{
    const result = await Item.deleteMany({name:"hola como estas"});
    console.log(result);
  } catch(err){
    console.log(err);
}}
