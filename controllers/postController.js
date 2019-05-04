var post = require('../models/postModel');
var tag = require('../models/tagModel');

module.exports = function(app){

    app.get('/',(req,res)=>{
        post.find({active: true}).select("title description date url tags").sort({date: -1})
        .exec((err,doc)=>{
            if(err)throw err;
            tag.find()
            .then(tg=>{
                res.render('home',{posts:doc,tags: tg,on:true});
            })
        })
    });

    app.get('/:tag',(req,res,next)=>{
        tag.findOne({code: req.params.tag})
        .then(result=>{
            if(result){
                post.find({tags: {$all:[req.params.tag]},active:true}).select("title description date url tags").sort({date: -1})
                .then(doc=>{
                    if(doc){
                        res.render('home',{posts:doc,on:false,tag: req.params.tag});
                    }else next();
                   
                })
                .catch()
            }else next();
        })
        .catch()
    });

    app.get('/:url',(req,res,next)=>{
        //supposed to fetch post from a database
        post.findOne({url: req.params.url})
        .then(doc=>{
            if(doc){
                post.find({url: {$ne: req.params.url}}).select("title url").limit(5)
                .then(rel=>{
                    res.render('post',{post:doc,others: rel});
                })
                
            }else next();
        })
        .catch(err=>{
            throw err;
        })
        
    });
    app.get('/:tag/:url',(req,res,next)=>{
        //supposed to all posts with that tag
        post.findOne({tags:{$all: req.params.tag},url: req.params.url})
        .then(doc=>{
            if(doc){
                post.find({url: {$ne: req.params.url}}).select("title url").limit(5)
                .then(rel=>{
                    res.render('post',{post:doc,others: rel});
                })
                
            }else next();
        })
        .catch()
    });
}