const path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();

app.set('view engine', 'ejs');
//app.use(express.static("/public"));
app.use("/public",express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const todoSchema = {
    name: String,
};
const Todo = mongoose.model("todo", todoSchema);
const td1 = new Todo({
    name: "Welcome!",
});
const td2 = new Todo({
    name: "Your List is Empty!!",
});

const td = [td1, td2];

app.get("/",function(req,res)
{
   Todo.find({},function(err,f)
   {
      if(f.length===0)
      {
        Todo.insertMany(td,function(err)
        {
            if(err){
                console.log(err);
            }
            else{
                console.log("Successfully saved items to DB");
            }
        });
      res.redirect("/");
      }
      else{
        res.render("list",{newListTodos:f});
      }
   })
  ;
})
app.post("/",function(req,res)
{
     const itemName=req.body.n;
   const item=new Todo({
       name:itemName
   });
item.save();
res.redirect("/");
});
app.post("/delete",function(req,res)
{
  const check=req.body.checkbox;
  Todo.findByIdAndRemove(check,function(err)
  {
      if(!err)
      {
          console.log("Successfully deleted");
          res.redirect("/");
      }
  })
});

app.listen(3000, function() {
    console.log("Listeing to PORT 3000");
})