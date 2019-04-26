const express = require('express');
var router = express.Router();
var post = require('../models/postModel');
var tag = require('../models/tagModel');
var seo_url = require('../config/urlgen');

var admin = {
    username: process.env.ADMIN_NAME,
    password: process.env.ADMIN_PASS
}

router.get('/', isNotLoggenIn,(req,res)=>{
    res.render('admin/login');
})

router.get('/new-post', isLoggedIn,(req,res)=>{
    tag.find()
    .then(tgs=>{
        if(!tgs){
            tgs = [];
        }
        res.render('admin/add',{tags:tgs});
    })
    .catch()
});

router.get('/viewer/:url',(req,res,next)=>{
    //supposed to all posts with that tag
    post.findOne({url: req.params.url})
    .then(doc=>{
        if(doc){
             res.render('admin/viewer',{post:doc});
        }else next();
    })
    .catch()
});

router.post('/new-post', isLoggedIn,(req,res)=>{
    let body = req.body;
    let newPost = new post({
        title: body.title,
        description: body.description,
        body: body.body,
        tags: body.keywords,
        url: seo_url(body.title),
        active: body.active,
    });
    var keywords = [];    
    function insertPost(){
        newPost.save()
        .then(()=>{
            console.log("Post inserted successfully");
            res.send('OK');
        })
        .catch(err=>{
            res.send('ERR');
            throw err;
        })
    }
    
    if(body.nkeywords){
        body.nkeywords.forEach(i => {
            keywords.push(new tag({
                title: i.split("-").join(" "),
                code: i
            }))
        });
        tag.collection.insertMany(keywords)
        .then(()=>{
            insertPost();
        })
        .catch()
    }else insertPost();
   
});

router.get('/home', isLoggedIn,(req,res)=>{
    post.find({active:true}).select('title url')
    .then(doc=>{
        res.render('admin/home',{result:doc});
    })
    .catch(err=>{
        console.log(err);
    });
})

router.get('/draft', isLoggedIn,(req,res)=>{
    post.find({active:false}).select('title url')
    .then(doc=>{
        res.render('admin/home',{result:doc});
    })
    .catch(err=>{
        console.log(err);
    });
})

router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/admin');
});

router.post('/login',(req,res)=>{
    var body = req.body;
    if(admin.username == body.username && admin.password == body.password){
        req.session.admin = true;
        res.redirect('/admin/new-post');
    }else{
        res.redirect('/admin');
    }

});

function isLoggedIn(req,res,next){
    if (req.session.admin)
      return next();
  
    res.redirect('/admin');
  }
  
  function isNotLoggenIn(req,res,next){
    if (req.session.admin)
      res.redirect('/admin/home');
    else
      return next();
  
  }

module.exports = router;
