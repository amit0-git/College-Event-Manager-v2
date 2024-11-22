const mongoose = require('mongoose');


const individualSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
   events:{
    type: [String]
   }
   
});





module.exports = mongoose.model('individualEvents', individualSchema,'individualEvents');