const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
  event: {
    type: String,
    required:true
  },
  description:  {
    type: String
 
  },
  type:{
    type:String,
    required:true,

  },
  venue:{
    type:String
    
  },
  time:{
    type:String
  },
  limit:{
    type:Number
  },
  halt:{
    type:Number,
    default:0
  }
});



module.exports = mongoose.model('events', eventSchema);