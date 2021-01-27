const express= require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikidb",{useNewUrlParser:true,useUnifiedTopology: true});

const articleSchema=mongoose.Schema({
 
    title:String,
    content:String
});

const Article=mongoose.model("Article",articleSchema);

///////request targetting all articles///////////
app.route("/articles")

.get(function(req,res)
{
        Article.find({},function(err,foundarticles)
        {

            if(!err)
             {
              res.send(foundarticles);
             }
             else{
                 res.send(err);
             }
        });
   
})

.post(function(req,res)
{
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle=new Article({
      title:req.body.title,
      content:req.body.content
  });

  newArticle.save(function(err)
  {
      if(!err)
      {
          res.send("data inserted");
      }
      else{
          res.send(err);
      }
  });

})

.delete(function(req,res)
{
  Article.deleteMany(function(err)
  {
     if(!err)
     {
         res.send("Successfully deleted");
     }
     else{
         res.send(err);
     }
  });

});


/////////request for specific articles/////////

app.route("/articles/:id")
.get(function(req,res){
    
    Article.findOne({_id:req.params.id},function(err,foundarticle){
  
        if(foundarticle)
        {
            res.send(foundarticle);
        }
        else{
            res.send("data not found");
        }
        
    });
})

.put(function(req,res)
{
    Article.update(
        {_id:req.params.id},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        function(err)
        {
            if(!err)
            {
                res.send("successfully updated");
            }
        }
        
   );
})

.patch(function(req,res){
    
    Article.update(
        {_id:req.params.id},
        {$set:req.body},
        function(err)
        {
            if(!err){
                res.send("Susccesfully update");
            }
            else{
                res.send(err);
            }
        }
    );
})

.delete(function(req,res){

    Article.findByIdAndRemove(req.params.id,function(err)
    {
        if(!err)
        {
            res.send("successfully deleted");
        }
    });
});



app.listen(3000,function(){
 console.log("server running");
});

