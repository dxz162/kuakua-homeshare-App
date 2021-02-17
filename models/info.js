const mongoose = require('mongoose');
const { text } = require('express');
const Schema = mongoose.Schema;

const infoSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
},{timestamps: true})

const Info = mongoose.model('Info', infoSchema);

module.exports = Info;