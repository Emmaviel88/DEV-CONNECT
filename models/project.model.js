const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    skills: {type: [String], default: []},
    image: {type: String},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
 }, {timestamps: true});

module.exports = mongoose.model('ProjectObject', projectSchema);