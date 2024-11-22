const mongoose = require('mongoose');


const countSchema = new mongoose.Schema({
name:{
  type:String,
  required:true
},
 count:{
    type:Number,
    required:true,
    
 }
});



module.exports = mongoose.model('lastCounts', countSchema,'lastCounts');
