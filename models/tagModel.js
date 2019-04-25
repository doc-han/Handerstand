var mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        lowercase: true,
    }
});

const tagModel = mongoose.model('Tag', tagSchema);

module.exports = tagModel;