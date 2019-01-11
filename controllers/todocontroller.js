const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Connect to MongoDB

mongoose.connect(
  "mongodb://test:nodejs1@ds255364.mlab.com:55364/todo",
  { useNewUrlParser: true }
);

//Create a schema - blueprint for data

const todoSchema = new mongoose.Schema({
  item: String
});

const todoModel = mongoose.model('Todo', todoSchema);

// let data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'coding'}];
let urlencodedParser = bodyParser.urlencoded({
  extended: false
})

module.exports = function(app){

  app.get('/todo', function(req, res){
    // get data from mongodb and display it. We want the model
    todoModel.find({}, function(err, data){
      if (err) throw err;
      res.render("todo", { todos: data });
    }) // empty objects retrieve all items in the collection
  });

  app.post("/todo", urlencodedParser, function(req, res) {
    // get data from view and add it to mongodb
    let newToDo = todoModel(req.body).save(function(err, data){
      if (err) throw err;
      res.json(data);
    })
  });

  app.delete("/todo/:item", function(req, res) {
    // delete the requested item from mongodb
    todoModel.find({item: req.params.item.replace(/\-/g, " ")}).deleteOne(function(err, data){
      if (err) throw err;
      res.json(data);
    })
    // data = data.filter(function(todo){
    //   return todo.item.replace(/ /g, "-") !== req.params.item;
    // });
  });
}