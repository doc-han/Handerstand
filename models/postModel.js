var mongoose = require('mongoose');

// template
/*
let newPost = new post({
    title: ,
    description: ,
    body: ,
    tags: ,
    url: ,
    date: ,
    active: ,
}); 
*/

const postSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    body: {
        type: String, 
        required: true
    },
    tags: [{
        type: String,
        required: true,
        lowercase: true
    }],
    url: {
        type: String, 
        required: true,
        lowercase: true
    },
    date: {
        type: Date, 
        default: new Date(),
        required: true
    },
    active: {
        type: Boolean,
        default: false
    }
});

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;